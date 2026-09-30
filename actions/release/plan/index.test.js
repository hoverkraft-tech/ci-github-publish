const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { prepareConfiguration, resolvePlan } = require("./index.js");

const marker = "release-plan-test";
const repo = { owner: "example", repo: "project" };

function fixture(overrides = {}) {
	const calls = [];
	return {
		calls,
		input: {
			body: `${marker}:v1.0.0\n* A relevant change`,
			marker,
			tag: " v1.1.0 ",
			name: " Version 1.1.0 ",
			repo,
			github: {
				rest: {
					git: {
						getRef: async (request) => {
							calls.push(request);
							throw Object.assign(new Error("Not Found"), { status: 404 });
						},
					},
				},
			},
			...overrides,
		},
	};
}

test("unchanged release still produces the planned identity", async () => {
	const { input, calls } = fixture({
		body: `${marker}:v1.0.0\n${marker}:no-changes`,
	});
	assert.deepEqual(await resolvePlan(input), {
		hasChanges: false,
		tag: "v1.1.0",
		name: "Version 1.1.0",
	});
	assert.deepEqual(calls, [{ ...repo, ref: "tags/v1.1.0" }]);
});

test("relevant changes produce the planned identity", async () => {
	const { input, calls } = fixture();
	assert.deepEqual(await resolvePlan(input), {
		hasChanges: true,
		tag: "v1.1.0",
		name: "Version 1.1.0",
	});
	assert.deepEqual(calls, [{ ...repo, ref: "tags/v1.1.0" }]);
});

test("first release is allowed without comparison history", async () => {
	const { input } = fixture({
		body: `${marker}:\n${marker}:no-changes\n---\nNo previous release\n`,
	});
	assert.equal((await resolvePlan(input)).hasChanges, true);
});

test("filtered monorepo and prerelease plans report no changes with an identity", async () => {
	for (const previousTag of ["package-a-1.0.0", "package-a-1.1.0-rc.1"]) {
		const { input, calls } = fixture({
			body: `${marker}:${previousTag}\n${marker}:no-changes`,
		});
		const plan = await resolvePlan(input);
		assert.equal(plan.hasChanges, false);
		assert.equal(plan.tag, "v1.1.0");
		assert.equal(calls.length, 1);
	}
});

test("missing release name falls back to its tag", async () => {
	const { input } = fixture({ name: " " });
	assert.equal((await resolvePlan(input)).name, "v1.1.0");
});

test("missing detection output fails instead of silently skipping", async () => {
	for (const body of [
		undefined,
		"",
		"Some custom body",
		`${marker}:v1.0.0`,
		`${marker}:v1.0.0\n`,
		`${marker}:$PREVIOUS_TAG\n$CHANGES`,
		`${marker}:v1.0.0\n$CHANGES`,
	]) {
		const { input, calls } = fixture({ body });
		await assert.rejects(
			resolvePlan(input),
			/Cannot determine release changes/,
		);
		assert.equal(calls.length, 0);
	}
	const { input } = fixture({ marker: "" });
	await assert.rejects(resolvePlan(input), /Cannot determine release changes/);
});

test("missing planned tag fails regardless of detected changes", async () => {
	for (const changes of ["* A relevant change", `${marker}:no-changes`]) {
		const { input, calls } = fixture({
			body: `${marker}:v1.0.0\n${changes}`,
			tag: " ",
		});
		await assert.rejects(resolvePlan(input), /Cannot determine release tag/);
		assert.equal(calls.length, 0);
	}
});

test("existing tags still block changed releases", async () => {
	const { input } = fixture();
	input.github.rest.git.getRef = async () => ({ data: {} });
	await assert.rejects(resolvePlan(input), /Remote tag already exists: v1.1.0/);
});

test("GitHub API errors are not mistaken for missing tags", async () => {
	const { input } = fixture();
	input.github.rest.git.getRef = async () => {
		throw Object.assign(new Error("Forbidden"), { status: 403 });
	};
	await assert.rejects(
		resolvePlan(input),
		/Cannot check remote tag v1.1.0: Forbidden/,
	);
});

test("detection configuration inherits release rules without rewriting user files", (t) => {
	const workspace = fs.mkdtempSync(
		path.join(os.tmpdir(), "release-plan-test-"),
	);
	t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
	const runnerTemp = path.join(workspace, "temp");
	fs.mkdirSync(runnerTemp);
	fs.mkdirSync(path.join(workspace, ".github", "release-configs"), {
		recursive: true,
	});
	const configPath = "release-configs/package-a.yml";
	const originalPath = path.join(workspace, ".github", configPath);
	const original =
		'_extends: shared.yml\ninclude-paths: [packages/a]\nno-changes-template: |\n  Nothing new\ntemplate: Custom body without changes\nreplacers:\n  - search: ".*"\n    replace: ""\n';
	fs.writeFileSync(originalPath, original);

	const result = prepareConfiguration({ workspace, runnerTemp, configPath });
	const detectionPath = path.resolve(workspace, ".github", result.configPath);
	const config = JSON.parse(fs.readFileSync(detectionPath, "utf8"));
	const inheritedPath = path.resolve(
		path.dirname(detectionPath),
		config._extends.slice("file:".length),
	);
	assert.equal(inheritedPath, originalPath);
	assert.equal(fs.readFileSync(originalPath, "utf8"), original);
	assert.equal(config.template, `${result.marker}:$PREVIOUS_TAG\n$CHANGES`);
	assert.equal(config["no-changes-template"], `${result.marker}:no-changes`);
	assert.equal(config.header, "");
	assert.equal(config.footer, "");
	assert.deepEqual(config.replacers, []);
	const second = prepareConfiguration({ workspace, runnerTemp, configPath });
	assert.notEqual(second.configPath, result.configPath);
	assert.notEqual(second.marker, result.marker);
});

test("generated configuration outside the repository is supported", (t) => {
	const workspace = fs.mkdtempSync(
		path.join(os.tmpdir(), "release-plan-generated-"),
	);
	t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
	const originalPath = path.join(workspace, "generated.yml");
	fs.writeFileSync(originalPath, "include-paths: [packages/a]\n");
	const result = prepareConfiguration({
		workspace,
		runnerTemp: workspace,
		configPath: "../generated.yml",
	});
	const detectionPath = path.resolve(workspace, ".github", result.configPath);
	const config = JSON.parse(fs.readFileSync(detectionPath, "utf8"));
	assert.equal(
		path.resolve(path.dirname(detectionPath), config._extends.slice(5)),
		originalPath,
	);
});

test("missing configuration fails before drafting", () => {
	assert.throws(
		() => prepareConfiguration({ configPath: "" }),
		/Configuration path is not specified/,
	);
	assert.throws(
		() =>
			prepareConfiguration({
				configPath: "missing.yml",
				workspace: os.tmpdir(),
				runnerTemp: os.tmpdir(),
			}),
		/Configuration file not found/,
	);
});

test("unchanged releases still validate tag availability", async () => {
	for (const status of [200, 403]) {
		const { input } = fixture({
			body: `${marker}:v1.0.0\n${marker}:no-changes`,
		});
		input.github.rest.git.getRef = async () => {
			if (status === 200) return { data: {} };
			throw Object.assign(new Error("Forbidden"), { status });
		};
		await assert.rejects(
			resolvePlan(input),
			status === 200 ? /Remote tag already exists/ : /Cannot check remote tag/,
		);
	}
});
