import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { parse } from "yaml";

const { run } = await import(
	process.env.ACTION_ENTRYPOINT
		? pathToFileURL(process.env.ACTION_ENTRYPOINT)
		: new URL("./index.js", import.meta.url)
);

function fixture(
	t,
	source = '# Keep user formatting\r\n_extends: file:base.yml\r\ntemplate: "$CHANGES"\r\n',
) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "release-override-test-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const workspace = path.join(root, "workspace");
	const runnerTemp = path.join(root, "runner");
	fs.mkdirSync(path.join(workspace, ".github"), { recursive: true });
	fs.mkdirSync(runnerTemp);
	const base = path.join(workspace, ".github/release-config.yml");
	fs.writeFileSync(base, source);
	const defaults = path.join(runnerTemp, "defaults.yml");
	fs.writeFileSync(defaults, 'tag-prefix: ""\ntemplate: "$CHANGES"\n');
	fs.writeFileSync(
		path.join(workspace, ".github/base.yml"),
		"categories: []\n",
	);
	const outputs = {};
	return {
		base,
		defaults,
		outputs,
		source,
		workspace,
		runnerTemp,
		async apply(input) {
			run({
				core: {
					setOutput(name, value) {
						outputs[name] = value;
					},
				},
				inputs: {
					workspace,
					runnerTemp,
					baseConfigPath: path.relative(
						path.join(workspace, ".github"),
						defaults,
					),
					repositoryConfigPath: "release-config.yml",
					configOverrides: input,
				},
			});
			const target = path.resolve(workspace, ".github", outputs["config-path"]);
			return { target, config: parse(fs.readFileSync(target, "utf8")) };
		},
	};
}

test("YAML and JSON overrides inherit the selected configuration without rewriting it", async (t) => {
	for (const input of [
		"tag-prefix: v\ntag-template: v$RESOLVED_VERSION\n",
		'{"tag-prefix":"v","tag-template":"v$RESOLVED_VERSION"}',
	]) {
		const f = fixture(t);
		const { target, config } = await f.apply(input);
		assert.equal(config["tag-prefix"], "v");
		assert.equal(config["tag-template"], "v$RESOLVED_VERSION");
		assert.equal(
			path.resolve(path.dirname(target), config._extends.slice(5)),
			f.base,
		);
		assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
		assert.equal(config.categories, undefined);
		assert.equal(config.template, undefined);
		assert.equal(fs.statSync(target).mode & 0o777, 0o600);
	}
});

test("a partial repository file inherits shared defaults without being rewritten", async (t) => {
	const f = fixture(t, "# My settings\ntag-prefix: v\n");
	const { target, config } = await f.apply("");
	assert.equal(config["tag-prefix"], "v");
	assert.equal(
		path.resolve(path.dirname(target), config._extends.slice(5)),
		f.defaults,
	);
	assert.equal(f.outputs["is-generated"], "true");
	assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
});

test("repository files with explicit inheritance keep their original path without input overrides", async (t) => {
	const f = fixture(t);
	const { target } = await f.apply("");
	assert.equal(target, f.base);
	assert.equal(f.outputs["is-generated"], "false");
	assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
});

test("repository-owned inheritance uses native category replacement without generated scope", async (t) => {
	const f = fixture(t);
	fs.writeFileSync(
		f.defaults,
		"categories: [{type: pre-include, when: {paths: [images/widget]}}]\n",
	);
	const { target, config } = await f.apply("categories: []");
	assert.deepEqual(config.categories, []);
	assert.equal(
		path.resolve(path.dirname(target), config._extends.slice(5)),
		f.base,
	);
	assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
});

test("workflow input extends partial repository settings and shared defaults in order", async (t) => {
	const f = fixture(t, "tag-prefix: repository-\nheader: Repository notes\n");
	const { target, config } = await f.apply("tag-prefix: input-");
	assert.equal(config["tag-prefix"], "input-");
	const repositoryPath = path.resolve(
		path.dirname(target),
		config._extends.slice(5),
	);
	const repository = parse(fs.readFileSync(repositoryPath, "utf8"));
	assert.equal(repository["tag-prefix"], "repository-");
	assert.equal(repository.header, "Repository notes");
	assert.equal(
		path.resolve(path.dirname(repositoryPath), repository._extends.slice(5)),
		f.defaults,
	);
	assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
});

test("overrides preserve empty lists, mappings, false and empty string values", async (t) => {
	const f = fixture(t);
	const supplied = {
		categories: [],
		autolabeler: [],
		"group-changes": { enabled: false },
		header: "",
		prerelease: false,
	};
	const { config } = await f.apply(JSON.stringify(supplied));
	const { _extends, ...overrides } = config;
	assert.deepEqual(overrides, supplied);
	assert.ok(_extends.startsWith("file:"));
});

test("each override has an isolated output and retains previous results", async (t) => {
	const f = fixture(t);
	const first = await f.apply("tag-prefix: first-");
	const second = await f.apply("tag-prefix: second-");
	assert.notEqual(first.target, second.target);
	assert.equal(
		JSON.parse(fs.readFileSync(first.target))["tag-prefix"],
		"first-",
	);
	assert.equal(second.config["tag-prefix"], "second-");
	assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
});

for (const input of [
	"null",
	"[]",
	"true",
	"42",
	"a scalar",
	"{broken",
	"name: first\nname: second",
	"_extends: file:other.yml",
	"&cycle {nested: *cycle}",
]) {
	test(`invalid override ${JSON.stringify(input)} fails without modifying the repository`, async (t) => {
		const f = fixture(t);
		await assert.rejects(() => f.apply(input));
		assert.deepEqual(f.outputs, {});
		assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
	});
}

test("invalid repository configuration fails without modifying its source", async (t) => {
	const f = fixture(t, "[not, a, mapping]");
	await assert.rejects(
		() => f.apply(""),
		/Repository release configuration must be/,
	);
	assert.deepEqual(f.outputs, {});
	assert.equal(fs.readFileSync(f.base, "utf8"), f.source);
});
