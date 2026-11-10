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
	sleep = async () => {},
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
	const verification = new ReleaseVerification({ github, context, sleep });
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
test("waits for a newly uploaded artifact to become visible", async () => {
	const delays = [];
	const { github, verify } = arrange({
		sleep: async (milliseconds) => delays.push(milliseconds),
	});
	const getArtifact = github.rest.actions.getArtifact;
	const requests = [];
	github.rest.actions.getArtifact = async (request) => {
		requests.push(request);
		if (requests.length < 4) return missing();
		return getArtifact(request);
	};

	assert.deepEqual(await verify(), [{ tag: "v1.2.3", published: false }]);
	assert.deepEqual(delays, [1000, 2000, 4000]);
	assert.deepEqual(
		requests,
		Array(4).fill({ ...context.repo, artifact_id: 10 }),
	);
});
test("fails with the original error when an artifact remains unavailable", async () => {
	const delays = [];
	const { github, verify } = arrange({
		sleep: async (milliseconds) => delays.push(milliseconds),
	});
	const error = Object.assign(new Error("Artifact not found"), { status: 404 });
	let attempts = 0;
	github.rest.actions.getArtifact = async () => {
		attempts++;
		throw error;
	};

	await assert.rejects(verify(), (caught) => caught === error);
	assert.equal(attempts, 4);
	assert.deepEqual(delays, [1000, 2000, 4000]);
});
test("does not retry artifact authorization or other API errors", async () => {
	for (const status of [401, 403, 422, 500, undefined]) {
		const { github, verify } = arrange({
			sleep: async () => assert.fail("Only artifact 404s may be retried."),
		});
		const error = Object.assign(new Error("Request failed"), { status });
		let attempts = 0;
		github.rest.actions.getArtifact = async () => {
			attempts++;
			throw error;
		};

		await assert.rejects(verify(), (caught) => caught === error);
		assert.equal(attempts, 1);
	}
});
test("still checks artifact identity after it becomes visible", async () => {
	for (const artifact of [
		{ expired: true },
		{ workflow_run: null },
		{ workflow_run: { id: 41, head_sha: context.sha } },
		{ workflow_run: { id: 42, head_sha: "other-commit" } },
	]) {
		const { github, verify } = arrange({ artifact });
		const getArtifact = github.rest.actions.getArtifact;
		let attempts = 0;
		github.rest.actions.getArtifact = async (request) => {
			if (++attempts === 1) return missing();
			return getArtifact(request);
		};

		await assert.rejects(verify(), /this run and commit/);
		assert.equal(attempts, 2);
	}
});
test("rejects malformed artifacts and malformed or empty tags before API calls", async () => {
	const { github, verify } = arrange();
	github.rest.actions.getArtifact = () =>
		assert.fail("Invalid input must not call GitHub.");
	for (const artifactIds of [
		null,
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

for (const artifactIds of [undefined, []]) {
	test(`verifies source-only releases with ${artifactIds === undefined ? "omitted" : "empty"} artifacts`, async () => {
		for (const published of [false, true]) {
			const { github, verify } = arrange({
				tags: { "v1.2.3": commit },
				releases: published ? [{ tag_name: "v1.2.3", draft: false }] : [],
			});
			github.rest.actions.getArtifact = () =>
				assert.fail("Source-only releases need no Actions API permissions.");
			assert.deepEqual(await verify({ artifactIds }), [
				{ tag: "v1.2.3", published },
			]);
		}
	});
}
test("source-only releases retain tag conflicts, missing-tag and API-error checks", async () => {
	await assert.rejects(
		arrange({ tags: { "v1.2.3": { type: "commit", sha: "other" } } }).verify({
			artifactIds: [],
		}),
		/source commit/,
	);
	await assert.rejects(
		arrange().verify({ artifactIds: [], requireTags: true }),
		/does not exist/,
	);
	await assert.rejects(
		arrange({ releases: [{ tag_name: "v1.2.3", draft: false }] }).verify({
			artifactIds: [],
		}),
		/no matching Git tag/,
	);
	const { github, verify } = arrange();
	github.rest.git.getRef = () => {
		throw Object.assign(new Error("Forbidden"), { status: 403 });
	};
	await assert.rejects(verify({ artifactIds: [] }), /Forbidden/);
});
