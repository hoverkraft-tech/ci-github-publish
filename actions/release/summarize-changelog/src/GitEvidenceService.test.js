import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { GitEvidenceService } from "./GitEvidenceService.js";
import { ReferenceExtractor } from "./ReferenceExtractor.js";

function createLoggerStub() {
	return {
		info() {},
		warning() {},
	};
}

describe("GitEvidenceService", () => {
	it("collects commit and pull request evidence through GitHub APIs", async () => {
		const calls = [];
		const service = new GitEvidenceService(
			new ReferenceExtractor(),
			createLoggerStub(),
			{
				rest: {
					repos: {
						async getCommit(parameters) {
							calls.push(["getCommit", parameters]);
							return {
								data: {
									sha: "1234567",
									commit: {
										message: "fix(ui): correct status badge",
									},
									files: [
										{
											filename:
												"actions/release/summarize-changelog/src/index.js",
										},
										{ filename: "README.md" },
									],
								},
							};
						},
					},
					pulls: {
						async get(parameters) {
							calls.push(["getPull", parameters]);
							return {
								data: {
									number: 42,
									title: "feat(api): add project filters",
									body: "Adds filters for technical users.",
								},
							};
						},
						listFiles: {},
					},
				},
				async paginate(_method, parameters) {
					calls.push(["paginate", parameters]);
					return [
						{ filename: "actions/release/summarize-changelog/action.yml" },
						{ filename: "docs/guide.md" },
					];
				},
			},
			{ owner: "hoverkraft-tech", repo: "ci-github-publish" },
		);

		const evidence = await service.collect(
			"fix(ui): correct status badge 1234567\nfeat(api): add project filters (#42)",
			{
				getRelativeWorkingDirectory() {
					return "actions/release/summarize-changelog";
				},
			},
		);

		assert.match(evidence, /Commit 1234567:/);
		assert.match(evidence, /Pull request #42:/);
		assert.match(evidence, /fix\(ui\): correct status badge/);
		assert.match(evidence, /feat\(api\): add project filters/);
		assert.equal(calls.length, 3);
	});

	it("filters out evidence unrelated to the working directory", async () => {
		const service = new GitEvidenceService(
			new ReferenceExtractor(),
			createLoggerStub(),
			{
				rest: {
					repos: {
						async getCommit() {
							return {
								data: {
									sha: "1234567",
									commit: {
										message: "fix(ui): correct status badge",
									},
									files: [{ filename: "docs/guide.md" }],
								},
							};
						},
					},
					pulls: {
						async get() {
							return {
								data: {
									number: 42,
									title: "feat(api): add project filters",
									body: "Adds filters for technical users.",
								},
							};
						},
						listFiles: {},
					},
				},
				async paginate() {
					return [{ filename: "docs/guide.md" }];
				},
			},
			{ owner: "hoverkraft-tech", repo: "ci-github-publish" },
		);

		const evidence = await service.collect(
			"fix(ui): correct status badge 1234567\nfeat(api): add project filters (#42)",
			{
				getRelativeWorkingDirectory() {
					return "actions/release/summarize-changelog";
				},
			},
		);

		assert.equal(evidence, "");
	});
});
