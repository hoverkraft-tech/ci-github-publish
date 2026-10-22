import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { compileFunction } from "node:vm";
import { parse } from "yaml";
import { prepareConfiguration, resolvePlan } from "../plan/index.js";
import { run } from "./index.js";

const require = createRequire(import.meta.url);
const action = parse(
	await fs.readFile(
		new URL("../get-configuration/action.yml", import.meta.url),
		"utf8",
	),
);
const generate = compileFunction(
	action.runs.steps.find((step) => step.id === "create-temp-config").with
		.script,
	["require", "process", "core"],
);
const workflow = ".github/workflows/release.yml";
const repo = { owner: "example", repo: "project" };

async function fixture(
	t,
	{ paths = "[]", workingDirectory = "images/widget" } = {},
) {
	const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "release-scope-"));
	t.after(() => fs.rm(workspace, { recursive: true, force: true }));
	const outputs = {};
	const core = {
		debug() {},
		info() {},
		warning() {},
		error() {},
		setFailed(message) {
			throw new Error(message);
		},
		setOutput(name, value) {
			outputs[name] = value;
		},
	};
	generate(
		require,
		{
			env: {
				GITHUB_WORKSPACE: workspace,
				GITHUB_REPOSITORY: "example/project",
				GITHUB_WORKFLOW_REF: `example/project/${workflow}@refs/heads/main`,
				CONFIG_SLUG: workingDirectory ? "widget" : "",
				CONFIG_PATH: "release.yml",
				WORKING_DIRECTORY: workingDirectory,
				INCLUDE_PATHS: paths,
			},
		},
		core,
	);
	const config = parse(
		await fs.readFile(path.join(workspace, ".github/release.yml"), "utf8"),
	);
	return { workspace, outputs, core, config };
}

async function plan(t, pullRequests, options) {
	const { workspace, outputs, core } = await fixture(t, options);
	const { configPath, marker } = prepareConfiguration({
		configPath: "release.yml",
		workspace,
		runnerTemp: workspace,
	});
	await run({
		core,
		context: { repo, ref: "main" },
		env: {
			GITHUB_WORKSPACE: workspace,
			RUNNER_TEMP: workspace,
			RELEASE_CONFIG: `file:${configPath}`,
			RELEASE_TOKEN: "test-token",
			RELEASE_DRY_RUN: "true",
			RELEASE_PRERELEASE: "false",
		},
		adapter: {
			capabilities: { draftReleases: true },
			listReleases: async () => [
				{ id: 1, tagName: "widget-1.2.3", createdAt: "2026-01-01T00:00:00Z" },
			],
			resolveCommitish: async ({ commitish }) => commitish,
			findChanges: async () => ({
				commits: [],
				pullRequests,
				newContributorLogins: new Set(),
			}),
		},
	});
	const result = await resolvePlan({
		body: outputs.body,
		tag: outputs.tag_name,
		name: outputs.name,
		marker,
		repo,
		github: {
			rest: {
				git: {
					getRef: async () => {
						throw Object.assign(new Error("Not Found"), { status: 404 });
					},
				},
			},
		},
	});
	return { ...result, body: outputs.body };
}

function change(number, title, ...changedFiles) {
	return { number, title, changedFiles, author: { login: "contributor" } };
}

const unrelatedChanges = [
	change(1, "build(deps)!: require build attestations", workflow),
	change(2, "feat!: change another image", "images/other/Dockerfile"),
];

test("additional paths extend the working-directory scope and preserve its tag prefix", async (t) => {
	const { config } = await fixture(t, {
		paths: '[" shared/** ", "shared/**", ""]',
	});
	assert.deepEqual(config["include-paths"], ["shared/**", "images/widget"]);
	assert.equal(config["tag-prefix"], "widget-");
});

for (const paths of ["[]", '["", "  "]']) {
	test(`empty additional paths ${paths} scope releases to the working directory`, async (t) => {
		const { config } = await fixture(t, { paths });
		assert.deepEqual(config["include-paths"], ["images/widget"]);
	});
}

test("repository releases without additional paths have no path filter", async (t) => {
	const { config } = await fixture(t, { paths: "[]", workingDirectory: "" });
	assert.equal(config["include-paths"], undefined);
});

test("additional paths can scope a repository release without a working directory", async (t) => {
	const { config } = await fixture(t, {
		workingDirectory: "",
		paths: '["images/widget/**"]',
	});
	assert.deepEqual(config["include-paths"], ["images/widget/**"]);
	assert.equal(config["tag-prefix"], "");
});

test("unrelated breaking changes produce a plan without relevant changes", async (t) => {
	const result = await plan(t, unrelatedChanges);
	assert.equal(result.hasChanges, false);
	assert.doesNotMatch(result.body, /#1|#2/);
});

for (const [title, version] of [
	["fix: correct startup", "1.2.4"],
	["feat: add startup option", "1.3.0"],
	["feat!: change startup interface", "2.0.0"],
]) {
	test(`${title} resolves to ${version} within the working directory`, async (t) => {
		const result = await plan(t, [
			...unrelatedChanges,
			change(3, title, "images/widget/Dockerfile"),
		]);
		assert.equal(result.hasChanges, true);
		assert.equal(result.tag, `widget-${version}`);
		assert.match(result.body, /#3/);
		assert.doesNotMatch(result.body, /#1|#2/);
	});
}

test("additional shared paths retain changes within the working directory", async (t) => {
	const result = await plan(
		t,
		[
			change(1, "fix: update shared entrypoint", "shared/entrypoint.sh"),
			change(2, "feat: add startup option", "images/widget/Dockerfile"),
		],
		{ paths: '["shared/**"]' },
	);
	assert.equal(result.hasChanges, true);
	assert.equal(result.tag, "widget-1.3.0");
	assert.match(result.body, /#1/);
	assert.match(result.body, /#2/);
});

test("callers can include the workflow through additional paths", async (t) => {
	const result = await plan(t, unrelatedChanges, {
		paths: JSON.stringify([workflow]),
	});
	assert.equal(result.hasChanges, true);
	assert.equal(result.tag, "widget-2.0.0");
	assert.match(result.body, /#1/);
	assert.doesNotMatch(result.body, /#2/);
});

test("changes touching both the working directory and the workflow are included", async (t) => {
	const result = await plan(t, [
		change(1, "fix: update image build", "images/widget/Dockerfile", workflow),
	]);
	assert.equal(result.hasChanges, true);
	assert.equal(result.tag, "widget-1.2.4");
});

for (const paths of ["{", "{}", '["images/widget/**", 1]']) {
	test(`invalid include-paths ${paths} fails configuration generation`, async (t) => {
		await assert.rejects(fixture(t, { paths }), /include-paths/);
	});
}
