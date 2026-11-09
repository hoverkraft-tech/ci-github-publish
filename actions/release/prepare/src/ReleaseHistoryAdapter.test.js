import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { draftRelease, loadConfig } from "release-drafter";
import { ReleaseHistoryAdapter } from "./ReleaseHistoryAdapter.js";

const repository = {
	owner: "example",
	name: "images",
	serverUrl: "https://github.com",
};

async function fixture(t, { prefix = "", releases = [], changes = true } = {}) {
	const directory = await fs.mkdtemp(
		path.join(os.tmpdir(), "release-history-"),
	);
	t.after(() => fs.rm(directory, { recursive: true, force: true }));
	const configPath = path.join(directory, "config.json");
	await fs.writeFile(
		configPath,
		JSON.stringify({
			"tag-prefix": prefix,
			"tag-template": `${prefix || ""}$RESOLVED_VERSION`,
			"name-template": "Version $RESOLVED_VERSION",
			template: "$PREVIOUS_TAG\n$CHANGES",
			"no-changes-template": "No changes",
			categories: [
				{
					title: "Features",
					when: { conventional: { type: "feat" } },
					"semver-increment": "minor",
				},
			],
		}),
	);
	const calls = { comparisons: [], writes: [] };
	const adapter = {
		capabilities: { draftReleases: true },
		listReleases: async () => releases,
		resolveCommitish: async ({ commitish }) => commitish,
		findChanges: async ({ comparison }) => {
			calls.comparisons.push(comparison);
			return {
				commits: [],
				pullRequests: changes
					? [{ number: 1, title: "feat: add a command", labels: [] }]
					: [],
				newContributorLogins: new Set(),
			};
		},
		createRelease: async (request) => {
			calls.writes.push({ kind: "create", ...request });
			return { id: 100, tagName: request.payload.tag };
		},
		updateRelease: async (request) => {
			calls.writes.push({ kind: "update", ...request });
			return { ...request.release, tagName: request.payload.tag };
		},
	};
	const config = await loadConfig({
		adapter,
		repository,
		target: "file:config.json",
		cwd: directory,
		ref: "tested-commit",
	});
	return {
		calls,
		run: (dryRun = true) =>
			draftRelease({
				adapter: new ReleaseHistoryAdapter(adapter, config["tag-prefix"]),
				repository,
				config,
				input: { dryRun, publish: false },
			}),
	};
}

function release(tagName, overrides = {}) {
	return {
		id: tagName,
		tagName,
		createdAt: "2026-01-01T00:00:00Z",
		draft: false,
		prerelease: false,
		...overrides,
	};
}

test("repository planning compares against the repository release despite newer image releases", async (t) => {
	const { run, calls } = await fixture(t, {
		releases: [
			release("tool-9.0.0", { createdAt: "2026-03-01T00:00:00Z" }),
			release("1.2.0"),
			release("other-1.2.0"),
		],
	});
	const result = await run();
	assert.equal(result.releasePayload.tag, "1.3.0");
	assert.match(result.releasePayload.body, /^1.2.0\n/);
	assert.deepEqual(calls.comparisons, [
		{ baseRef: "refs/tags/1.2.0", headRef: "tested-commit" },
	]);
	assert.deepEqual(calls.writes, []);
});

test("image planning uses only releases within its prefix", async (t) => {
	const { run, calls } = await fixture(t, {
		prefix: "tool-",
		releases: [
			release("9.0.0"),
			release("tool-2.1.0"),
			release("tool-debug-8.0.0"),
			release("other-8.0.0"),
		],
	});
	assert.equal((await run()).releasePayload.tag, "tool-2.2.0");
	assert.equal(calls.comparisons[0].baseRef, "refs/tags/tool-2.1.0");
});

test("repository drafting preserves unrelated image drafts", async (t) => {
	const { run, calls } = await fixture(t, {
		releases: [release("tool-9.1.0", { draft: true }), release("1.2.0")],
	});
	await run(false);
	assert.equal(calls.writes.length, 1);
	assert.equal(calls.writes[0].kind, "create");
	assert.equal(calls.writes[0].payload.tag, "1.3.0");
	assert.equal(calls.writes[0].payload.draft, true);
	assert.equal(calls.writes[0].payload.targetCommitish, "tested-commit");
});

test("draft reruns update only the matching repository draft", async (t) => {
	const { run, calls } = await fixture(t, {
		releases: [
			release("tool-9.1.0", { draft: true }),
			release("1.3.0", { draft: true }),
			release("1.2.0"),
		],
	});
	await run(false);
	assert.equal(calls.writes[0].kind, "update");
	assert.equal(calls.writes[0].release.tagName, "1.3.0");
});

test("unchanged repository notes retain the repository comparison base", async (t) => {
	const { run } = await fixture(t, {
		changes: false,
		releases: [release("tool-9.0.0"), release("1.2.0")],
	});
	assert.equal((await run()).releasePayload.body, "1.2.0\nNo changes");
});

test("first repository release does not inherit an image version", async (t) => {
	const { run, calls } = await fixture(t, {
		releases: [release("tool-9.0.0")],
	});
	const result = await run();
	assert.equal(result.releasePayload.tag, "0.0.1");
	assert.deepEqual(calls.comparisons, []);
});

test("SemVer prereleases and build metadata remain in their configured history", async () => {
	const releases = [
		release("tool-1.2.0-rc.1"),
		release("tool-1.2.0+build.1"),
		release("tool-01.2.0"),
		release("other-1.2.0"),
	];
	const adapter = new ReleaseHistoryAdapter(
		{ listReleases: async () => releases },
		"tool-",
	);
	assert.deepEqual(
		await adapter.listReleases({ repository }),
		releases.slice(0, 2),
	);
});

test("custom version configurations without an explicit prefix retain their history", async () => {
	const releases = [release("stable"), release("build-2026")];
	const adapter = new ReleaseHistoryAdapter({
		listReleases: async () => releases,
	});
	assert.equal(await adapter.listReleases({ repository }), releases);
});

test("release discovery errors propagate without writes", async () => {
	const adapter = new ReleaseHistoryAdapter(
		{
			listReleases: async () => {
				throw new Error("Forbidden");
			},
		},
		"",
	);
	await assert.rejects(adapter.listReleases({ repository }), /Forbidden/);
});
