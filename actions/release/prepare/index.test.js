import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { run } from "./index.js";
import { ReleaseConfiguration } from "./ReleaseConfiguration.js";

async function fixture(t) {
	const directory = await fs.mkdtemp(
		path.join(os.tmpdir(), "release-prepare-"),
	);
	t.after(() => fs.rm(directory, { recursive: true, force: true }));
	const workspace = path.join(directory, "workspace");
	const runnerTemp = path.join(directory, "temp");
	await fs.mkdir(path.join(workspace, ".github"), { recursive: true });
	await fs.mkdir(runnerTemp);
	await fs.writeFile(
		path.join(workspace, ".github", "release.yml"),
		'tag-prefix: ""\ntag-template: "$RESOLVED_VERSION"\ntemplate: "$PREVIOUS_TAG\\n$CHANGES"\n',
	);
	await fs.writeFile(
		path.join(runnerTemp, "plan.yml"),
		'_extends: "file:../workspace/.github/release.yml"\n',
	);
	const outputs = {};
	const comparisons = [];
	const writes = [];
	const input = {
		env: {
			GITHUB_WORKSPACE: workspace,
			RUNNER_TEMP: runnerTemp,
			RELEASE_CONFIG: "file:../../temp/plan.yml",
			RELEASE_TOKEN: "test-token",
			RELEASE_TARGET: "tested-commit",
			RELEASE_DRY_RUN: "true",
		},
		context: {
			repo: { owner: "example", repo: "images" },
			ref: "refs/heads/main",
		},
		core: {
			debug() {},
			info() {},
			warning() {},
			error() {},
			setOutput: (name, value) => {
				outputs[name] = value;
			},
		},
		adapter: {
			capabilities: { draftReleases: true },
			listReleases: async () => [
				{ id: 1, tagName: "1.2.0", createdAt: "2026-01-01T00:00:00Z" },
				{ id: 2, tagName: "tool-9.0.0", createdAt: "2026-03-01T00:00:00Z" },
			],
			resolveCommitish: async ({ commitish }) => commitish,
			findChanges: async ({ comparison }) => {
				comparisons.push(comparison);
				return {
					commits: [],
					pullRequests: [],
					newContributorLogins: new Set(),
				};
			},
			createRelease: async (request) => {
				writes.push(request);
				return { id: 3, tagName: request.payload.tag };
			},
		},
	};
	return {
		directory,
		workspace,
		runnerTemp,
		input,
		outputs,
		comparisons,
		writes,
	};
}

test("action loads generated configuration with repository inheritance and emits planning outputs", async (t) => {
	const { input, outputs, comparisons, writes } = await fixture(t);
	await run(input);
	assert.equal(outputs.tag_name, "1.2.1");
	assert.match(outputs.body, /^1.2.0/);
	assert.equal(typeof outputs.name, "string");
	assert.deepEqual(comparisons, [
		{ baseRef: "refs/tags/1.2.0", headRef: "tested-commit" },
	]);
	assert.deepEqual(writes, []);
});

test("explicit drafting uses the planned tag and tested commit without publishing", async (t) => {
	const { input, outputs, writes } = await fixture(t);
	input.env.RELEASE_DRY_RUN = "false";
	input.env.RELEASE_TAG = "1.4.0";
	await run(input);
	assert.equal(outputs.tag_name, "1.4.0");
	assert.equal(writes[0].payload.tag, "1.4.0");
	assert.equal(writes[0].payload.targetCommitish, "tested-commit");
	assert.equal(writes[0].payload.draft, true);
});

test("configuration cannot inherit files outside workspace and runner temporary storage", async (t) => {
	const { directory, runnerTemp, input } = await fixture(t);
	await fs.writeFile(path.join(directory, "outside.yml"), "template: secret");
	await fs.writeFile(
		path.join(runnerTemp, "plan.yml"),
		'_extends: "file:../outside.yml"',
	);
	await assert.rejects(run(input), /must remain within the workspace/);
});

test("configuration symlinks cannot escape permitted directories", async (t) => {
	const { directory, workspace, input } = await fixture(t);
	await fs.writeFile(path.join(directory, "outside.yml"), "template: secret");
	await fs.symlink(
		path.join(directory, "outside.yml"),
		path.join(workspace, ".github", "linked.yml"),
	);
	input.env.RELEASE_CONFIG = "file:linked.yml";
	await assert.rejects(run(input), /must remain within the workspace/);
});

test("configuration bundling preserves inherited merge strategies and leaves originals untouched", async (t) => {
	const { workspace, runnerTemp } = await fixture(t);
	const original =
		'_extends:\n  from: "file:../workspace/.github/release.yml"\n  strategy:\n    categories: append\n';
	await fs.writeFile(path.join(runnerTemp, "plan.yml"), original);
	const configuration = new ReleaseConfiguration({ workspace, runnerTemp });
	let bundle;
	await configuration.load(
		async ({ cwd, target }) => {
			bundle = cwd;
			const content = await fs.readFile(
				path.join(cwd, target.slice(5)),
				"utf8",
			);
			assert.match(content, /categories: append/);
			assert.match(content, /file:config-1.yml/);
		},
		{
			target: "file:../../temp/plan.yml",
			cwd: path.join(workspace, ".github"),
		},
	);
	assert.equal(
		await fs.readFile(path.join(runnerTemp, "plan.yml"), "utf8"),
		original,
	);
	await assert.rejects(fs.access(bundle), { code: "ENOENT" });
});

test("invalid release inputs fail before calling GitHub", async () => {
	const context = { repo: { owner: "example", repo: "images" } };
	await assert.rejects(
		run({ core: {}, context, env: {} }),
		/token and configuration/,
	);
	await assert.rejects(
		run({
			core: {},
			context,
			env: {
				RELEASE_TOKEN: "test",
				RELEASE_CONFIG: "file:config.yml",
				RELEASE_DRY_RUN: "maybe",
			},
		}),
		/dry-run must be/,
	);
});
