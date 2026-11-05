const assert = require("node:assert/strict");
const { test } = require("node:test");
const { ReleaseVerification } = require("./index.js");

const context = {
	repo: { owner: "example", repo: "project" },
	runId: 42,
	sha: "source-commit",
};
const missing = () => {
	throw Object.assign(new Error("Not found"), { status: 404 });
};
function arrange({
	artifact = {},
	tags = {},
	releases = [],
	drafts = [],
	annotated = {},
} = {}) {
	const github = {
		rest: {
			actions: {
				getArtifact: async () => ({
					data: {
						expired: false,
						workflow_run: { id: 42, head_sha: context.sha },
						...artifact,
					},
				}),
			},
			git: {
				getRef: async ({ ref }) =>
					tags[ref.slice(5)]
						? { data: { object: tags[ref.slice(5)] } }
						: missing(),
				getTag: async ({ tag_sha }) => ({
					data: { object: annotated[tag_sha] },
				}),
			},
			repos: {
				getReleaseByTag: async ({ tag }) =>
					releases.some((release) => release.tag_name === tag)
						? { data: releases.find((release) => release.tag_name === tag) }
						: missing(),
				listReleases: () => {},
			},
		},
		paginate: async () => drafts,
	};
	const verification = new ReleaseVerification({ github, context });
	const verify = (options = {}) =>
		verification.verify({ artifactIds: ["10"], tags: ["v1.2.3"], ...options });
	return { github, verify };
}
const commit = { type: "commit", sha: context.sha };

test("accepts source releases without a tag and artifacts from the current run, including retries", async () => {
	assert.deepEqual(await arrange().verify(), [
		{ tag: "v1.2.3", published: false },
	]);
});
test("rejects expired artifacts, another run or commit, and missing source metadata", async () => {
	for (const artifact of [
		{ expired: true },
		{ workflow_run: null },
		{ workflow_run: { id: 41, head_sha: context.sha } },
		{ workflow_run: { id: 42, head_sha: "old" } },
	]) {
		await assert.rejects(arrange({ artifact }).verify(), /this run and commit/);
	}
});
test("rejects malformed, unsafe, duplicate and empty inputs before API calls", async () => {
	const { github, verify } = arrange();
	github.rest.actions.getArtifact = () =>
		assert.fail("Invalid input must not call GitHub.");
	for (const artifactIds of [
		[],
		{},
		["0"],
		["-1"],
		["1,2"],
		["9007199254740992"],
		["1", "1"],
		[1],
		[" 1"],
	]) {
		await assert.rejects(verify({ artifactIds }), /artifactIds|artifact IDs/);
	}
	for (const tags of [[], {}, [""], ["v1", "v1"], [null]])
		await assert.rejects(verify({ tags }), /tags/);
});
test("requires prepared tags only when requested", async () => {
	await assert.rejects(
		arrange().verify({ requireTags: true }),
		/does not exist/,
	);
	assert.equal(
		(
			await arrange({ tags: { "v1.2.3": commit } }).verify({
				requireTags: true,
			})
		)[0].published,
		false,
	);
});
test("verifies every tag and artifact for independent package releases", async () => {
	const tags = { "@scope/a@1.2.3": commit, "@scope/b@2.0.0": commit };
	const { github, verify } = arrange({
		tags,
		releases: [{ tag_name: "@scope/a@1.2.3", draft: false }],
	});
	const ids = [];
	const getArtifact = github.rest.actions.getArtifact;
	github.rest.actions.getArtifact = async (args) => {
		ids.push(args.artifact_id);
		return getArtifact(args);
	};
	assert.deepEqual(
		await verify({
			artifactIds: ["10", "11"],
			tags: Object.keys(tags),
			requireTags: true,
		}),
		[
			{ tag: "@scope/a@1.2.3", published: true },
			{ tag: "@scope/b@2.0.0", published: false },
		],
	);
	assert.deepEqual(ids, [10, 11]);
});
test("recognizes published lightweight and nested annotated tags", async () => {
	for (const tag of [commit, { type: "tag", sha: "outer" }]) {
		const { verify } = arrange({
			tags: { "v1.2.3": tag },
			annotated: { outer: { type: "tag", sha: "inner" }, inner: commit },
			releases: [{ tag_name: "v1.2.3", draft: false }],
		});
		assert.equal((await verify())[0].published, true);
	}
});
test("recovers drafts returned directly or through the paginated release list", async () => {
	for (const key of ["releases", "drafts"]) {
		const { verify } = arrange({
			tags: { "v1.2.3": commit },
			[key]: [{ tag_name: "v1.2.3", draft: true }],
		});
		assert.equal((await verify())[0].published, false);
	}
});
test("rejects conflicting commits, non-commit objects and annotation cycles", async () => {
	for (const object of [
		{ type: "commit", sha: "other" },
		{ type: "tree", sha: context.sha },
		{ type: "tag", sha: "loop" },
	]) {
		await assert.rejects(
			arrange({
				tags: { "v1.2.3": object },
				annotated: { loop: object },
			}).verify(),
			/source commit/,
		);
	}
});
test("rejects releases with missing tags", async () => {
	for (const draft of [true, false]) {
		await assert.rejects(
			arrange({ releases: [{ tag_name: "v1.2.3", draft }] }).verify(),
			/no matching Git tag/,
		);
	}
});
test("fails closed on artifact, tag, release and pagination API errors", async () => {
	for (const endpoint of ["artifact", "ref", "tag", "release", "list"]) {
		const { github, verify } = arrange({
			tags: { "v1.2.3": { type: "tag", sha: "annotated" } },
			annotated: { annotated: commit },
		});
		const fail = () => {
			throw Object.assign(new Error("Forbidden"), { status: 403 });
		};
		if (endpoint === "artifact") github.rest.actions.getArtifact = fail;
		if (endpoint === "ref") github.rest.git.getRef = fail;
		if (endpoint === "tag") github.rest.git.getTag = fail;
		if (endpoint === "release") github.rest.repos.getReleaseByTag = fail;
		if (endpoint === "list") github.paginate = fail;
		await assert.rejects(verify(), /Forbidden/);
	}
});
