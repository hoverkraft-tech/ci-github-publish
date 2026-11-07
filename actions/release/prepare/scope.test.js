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
// Load the actual configuration action with this package's YAML dependency.
// Each action's CI installs only its own package dependencies.
const configurationModule = { exports: {} };
compileFunction(
	await fs.readFile(
		new URL("../get-configuration/src/index.js", import.meta.url),
		"utf8",
	),
	["require", "module"],
)((name) => (name === "yaml" ? { parse } : require(name)), configurationModule);
const { run: override } = configurationModule.exports;
const workflow = ".github/workflows/release.yml";
const repo = { owner: "example", repo: "project" };

async function fixture(
	t,
	{
		paths = "[]",
		workingDirectory = "images/widget",
		configOverrides = "",
		repositoryConfig = "",
	} = {},
) {
	const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "release-scope-"));
	t.after(() => fs.rm(workspace, { recursive: true, force: true }));
	const outputs = {};
	const warnings = [];
	const core = {
		debug() {},
		info() {},
		warning(message) {
			warnings.push(message);
		},
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
				ADDITIONAL_PATHS: paths,
			},
		},
		core,
	);
	if (repositoryConfig) {
		await fs.writeFile(
			path.join(workspace, ".github/release-config.yml"),
			repositoryConfig,
		);
	}
	if (configOverrides || repositoryConfig) {
		override({
			core,
			inputs: {
				workspace,
				runnerTemp: workspace,
				baseConfigPath: outputs["config-path"],
				repositoryConfigPath: repositoryConfig ? "release-config.yml" : "",
				configOverrides,
			},
		});
	}
	const config = parse(
		await fs.readFile(
			path.resolve(workspace, ".github", outputs["config-path"]),
			"utf8",
		),
	);
	return { workspace, outputs, core, config, warnings };
}

async function plan(t, pullRequests, options) {
	const { workspace, outputs, core, warnings } = await fixture(t, options);
	const { configPath, marker } = prepareConfiguration({
		configPath: outputs["config-path"],
		workspace,
		runnerTemp: workspace,
	});
	await run({
		core,
		context: { repo, ref: "main" },
		env: {
			GITHUB_WORKSPACE: workspace,
			RUNNER_TEMP: workspace,
			RELEASE_CONFIG: `file:${options?.renderNotes ? outputs["config-path"] : configPath}`,
			RELEASE_TOKEN: "test-token",
			RELEASE_DRY_RUN: "true",
			RELEASE_PRERELEASE: "false",
		},
		adapter: {
			capabilities: { draftReleases: true },
			listReleases: async () => [
				{
					id: 1,
					tagName: options?.previousTag || "widget-1.2.3",
					createdAt: "2026-01-01T00:00:00Z",
				},
			],
			resolveCommitish: async ({ commitish }) => commitish,
			findChanges: async () => ({
				commits: [],
				pullRequests,
				newContributorLogins: new Set(),
			}),
		},
	});
	assert.deepEqual(
		warnings,
		[],
		"Release Drafter should load without warnings",
	);
	if (options?.renderNotes) return { tag: outputs.tag, body: outputs.body };
	const result = await resolvePlan({
		body: outputs.body,
		tag: outputs.tag,
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
	assert.deepEqual(config.categories[0], {
		type: "pre-include",
		when: { paths: ["shared/**", "images/widget"] },
	});
	assert.equal(config["tag-prefix"], "widget-");
});

for (const paths of ["[]", '["", "  "]']) {
	test(`empty additional paths ${paths} scope releases to the working directory`, async (t) => {
		const { config } = await fixture(t, { paths });
		assert.deepEqual(config.categories[0].when.paths, ["images/widget"]);
	});
}

test("repository releases without additional paths have no path filter", async (t) => {
	const { config } = await fixture(t, { paths: "[]", workingDirectory: "" });
	assert.equal(config["include-paths"], undefined);
	assert.ok(
		config.categories.every((category) => category.type !== "pre-include"),
	);
});

test("additional paths can scope a repository release without a working directory", async (t) => {
	const { config } = await fixture(t, {
		workingDirectory: "",
		paths: '["images/widget/**"]',
	});
	assert.deepEqual(config.categories[0].when.paths, ["images/widget/**"]);
	assert.equal(config["tag-prefix"], "");
});

test("path filters preserve quotes and backslashes in YAML", async (t) => {
	const paths = ['shared/"quoted"/**', "shared/escaped\\*/**"];
	const { config } = await fixture(t, {
		workingDirectory: "",
		paths: JSON.stringify(paths),
	});
	assert.deepEqual(config.categories[0].when.paths, paths);
});

test("repository-wide releases load without warnings and include changes in any directory", async (t) => {
	const result = await plan(t, unrelatedChanges, {
		workingDirectory: "",
		previousTag: "1.2.3",
	});
	assert.equal(result.shouldRelease, true);
	assert.equal(result.tag, "2.0.0");
	assert.match(result.body, /#1/);
	assert.match(result.body, /#2/);
});

test("unrelated breaking changes produce a plan without relevant changes", async (t) => {
	const result = await plan(t, unrelatedChanges);
	assert.equal(result.shouldRelease, false);
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
		assert.equal(result.shouldRelease, true);
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
	assert.equal(result.shouldRelease, true);
	assert.equal(result.tag, "widget-1.3.0");
	assert.match(result.body, /#1/);
	assert.match(result.body, /#2/);
});

test("callers can include the workflow through additional paths", async (t) => {
	const result = await plan(t, unrelatedChanges, {
		paths: JSON.stringify([workflow]),
	});
	assert.equal(result.shouldRelease, true);
	assert.equal(result.tag, "widget-2.0.0");
	assert.match(result.body, /#1/);
	assert.doesNotMatch(result.body, /#2/);
});

test("changes touching both the working directory and the workflow are included", async (t) => {
	const result = await plan(t, [
		change(1, "fix: update image build", "images/widget/Dockerfile", workflow),
	]);
	assert.equal(result.shouldRelease, true);
	assert.equal(result.tag, "widget-1.2.4");
});

for (const paths of ["{", "{}", '["images/widget/**", 1]']) {
	test(`invalid additional-paths ${paths} fails configuration generation`, async (t) => {
		await assert.rejects(fixture(t, { paths }), /additional-paths/);
	});
}

for (const [title, version] of [
	["fix: repair", "1.2.4"],
	["feat: extend", "1.3.0"],
	["feat!: replace", "2.0.0"],
]) {
	test(`partial tag overrides inherit Conventional Commit rules for ${title}`, async (t) => {
		const result = await plan(
			t,
			[change(1, title, "images/widget/Dockerfile")],
			{
				configOverrides:
					"tag-prefix: v\ntag-template: v$RESOLVED_VERSION\nname-template: Custom $RESOLVED_VERSION\n",
				previousTag: "v1.2.3",
			},
		);
		assert.equal(result.tag, `v${version}`);
		assert.equal(result.name, `Custom ${version}`);
		assert.equal(result.shouldRelease, true);
	});
}

test("overridden presentation cannot hide no-change detection", async (t) => {
	const result = await plan(t, unrelatedChanges, {
		configOverrides:
			"tag-prefix: v\ntag-template: v$RESOLVED_VERSION\ntemplate: Hidden\nno-changes-template: Hidden\n",
		previousTag: "v1.2.3",
	});
	assert.equal(result.shouldRelease, false);
});

test("release notes inherit categories and compare the resolved overridden tag", async (t) => {
	const result = await plan(
		t,
		[change(1, "feat: expose API", "images/widget/Dockerfile")],
		{
			configOverrides: '{"tag-prefix":"v","tag-template":"v$RESOLVED_VERSION"}',
			previousTag: "v1.2.3",
			renderNotes: true,
		},
	);
	assert.equal(result.tag, "v1.3.0");
	assert.match(result.body, /### Features/);
	assert.match(result.body, /compare\/v1\.2\.3\.\.\.v1\.3\.0/);
	assert.doesNotMatch(result.body, /\$RESOLVED_TAG/);
});

for (const source of ["configOverrides", "repositoryConfig"]) {
	test(`${source} categories replace the inherited release scope and version rules`, async (t) => {
		const result = await plan(
			t,
			[
				change(1, "feat: expose API", "images/other/Dockerfile"),
				change(2, "feat!: change widget", "images/widget/Dockerfile"),
			],
			{
				[source]: JSON.stringify({
					categories: [
						{ type: "pre-include", when: { paths: ["images/other/**"] } },
						{ title: "Custom changes", "semver-increment": "minor" },
					],
				}),
				renderNotes: true,
			},
		);
		assert.equal(result.tag, "widget-1.3.0");
		assert.match(result.body, /### Custom changes/);
		assert.match(result.body, /#1/);
		assert.doesNotMatch(result.body, /#2|### Features/);
	});
}

test("a partial repository file inherits version rules and release note defaults", async (t) => {
	const options = {
		repositoryConfig: "tag-prefix: v\ntag-template: v$RESOLVED_VERSION\n",
		previousTag: "v1.2.3",
	};
	const changes = [change(1, "feat: expose API", "images/widget/Dockerfile")];
	const result = await plan(t, changes, options);
	assert.equal(result.tag, "v1.3.0");
	assert.equal(result.shouldRelease, true);
	const notes = await plan(t, changes, { ...options, renderNotes: true });
	assert.match(notes.body, /### Features/);
	assert.match(notes.body, /compare\/v1\.2\.3\.\.\.v1\.3\.0/);
});

test("workflow settings override repository settings while retaining omitted fields", async (t) => {
	const result = await plan(
		t,
		[change(1, "feat: expose API", "images/widget/Dockerfile")],
		{
			repositoryConfig:
				"tag-prefix: repo-\ntag-template: repo-$RESOLVED_VERSION\nname-template: From file $RESOLVED_VERSION\nheader: Repository header\n",
			configOverrides:
				"tag-prefix: input-\ntag-template: input-$RESOLVED_VERSION\n",
			previousTag: "input-1.2.3",
		},
	);
	assert.equal(result.tag, "input-1.3.0");
	assert.equal(result.name, "From file 1.3.0");
	assert.equal(result.shouldRelease, true);
});

test("an empty categories list clears version rules while preserving the repository scope", async (t) => {
	const result = await plan(
		t,
		[change(1, "feat: outside scope", "images/other/Dockerfile")],
		{
			repositoryConfig: JSON.stringify({
				categories: [
					{ type: "pre-include", when: { paths: ["images/widget/**"] } },
					{ title: "Features", "semver-increment": "minor" },
				],
			}),
			configOverrides: "categories: []",
		},
	);
	assert.equal(result.shouldRelease, false);
	assert.equal(result.tag, "widget-1.2.4");
});

for (const source of ["configOverrides", "repositoryConfig"]) {
	for (const categories of [
		[],
		[{ title: "Custom", "semver-increment": "minor" }],
	]) {
		test(`${source} with ${categories.length} changelog categories preserves the directory and additional paths`, async (t) => {
			const result = await plan(
				t,
				[
					...unrelatedChanges,
					change(3, "fix: repair widget", "images/widget/Dockerfile"),
					change(4, "fix: repair shared script", "shared/build.sh"),
				],
				{
					paths: '["shared/**"]',
					[source]: JSON.stringify({ categories }),
					renderNotes: true,
				},
			);
			assert.equal(
				result.tag,
				categories.length ? "widget-1.3.0" : "widget-1.2.4",
			);
			assert.match(result.body, /#3/);
			assert.match(result.body, /#4/);
			assert.doesNotMatch(result.body, /#1|#2|### Features/);
		});
	}
}

test("category overrides retain an explicit repository pre-include filter", async (t) => {
	const result = await plan(
		t,
		[
			change(1, "feat!: outside repository scope", "images/widget/Dockerfile"),
			change(2, "fix: inside repository scope", "images/other/Dockerfile"),
		],
		{
			repositoryConfig: JSON.stringify({
				categories: [
					{ type: "pre-include", when: { paths: ["images/other/**"] } },
				],
			}),
			configOverrides:
				'categories: [{title: "Custom", semver-increment: minor}]',
			renderNotes: true,
		},
	);
	assert.equal(result.tag, "widget-1.3.0");
	assert.match(result.body, /#2/);
	assert.doesNotMatch(result.body, /#1/);
});

test("an unconditional pre-include explicitly enables repository-wide changes", async (t) => {
	const result = await plan(t, unrelatedChanges, {
		configOverrides: "categories: [{type: pre-include}]",
	});
	assert.equal(result.shouldRelease, true);
	assert.match(result.body, /#1/);
	assert.match(result.body, /#2/);
});
