const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const {
	assessment,
	verifyDependencyChanges,
} = require("../dependency-review.cjs");

const reviewDate = new Date("2026-10-12T00:00:00Z");
const assessedChange = {
	change_type: "added",
	manifest: "actions/deploy/jampack/package-lock.json",
	ecosystem: "npm",
	name: "braces",
	version: "3.0.3",
	package_url: "pkg:npm/braces@3.0.3",
	vulnerabilities: [{ advisory_ghsa_id: "GHSA-vfj7-8cjw-p6xm" }],
};

test("accepts the reviewed finding before expiry", () => {
	assert.equal(verifyDependencyChanges([assessedChange], reviewDate), 1);
});

test("accepts clean changes and removals, including after expiry", () => {
	const afterExpiry = new Date("2026-11-13T00:00:00Z");
	assert.equal(verifyDependencyChanges([], afterExpiry), 0);
	assert.equal(
		verifyDependencyChanges(
			[
				{ ...assessedChange, vulnerabilities: [] },
				{ ...assessedChange, change_type: "removed" },
			],
			afterExpiry,
		),
		0,
	);
});

for (const [field, value] of Object.entries({
	manifest: "actions/deploy/jekyll/package-lock.json",
	ecosystem: "pip",
	name: "another-package",
	version: "3.0.2",
	package_url: "pkg:npm/braces@3.0.2",
})) {
	test(`rejects the advisory with a different ${field}`, () => {
		assert.throws(
			() =>
				verifyDependencyChanges(
					[{ ...assessedChange, [field]: value }],
					reviewDate,
				),
			/Unassessed vulnerability/,
		);
	});
}

test("rejects the advisory when it also appears in another manifest", () => {
	assert.throws(
		() =>
			verifyDependencyChanges(
				[assessedChange, { ...assessedChange, manifest: "package-lock.json" }],
				reviewDate,
			),
		/Unassessed vulnerability/,
	);
});

test("rejects a second advisory on the assessed dependency", () => {
	assert.throws(
		() =>
			verifyDependencyChanges(
				[
					{
						...assessedChange,
						vulnerabilities: [
							...assessedChange.vulnerabilities,
							{ advisory_ghsa_id: "GHSA-hypothetical-other-advisory" },
						],
					},
				],
				reviewDate,
			),
		/Unassessed vulnerability/,
	);
});

test("expires at midnight UTC on the assessment's expiry date", () => {
	assert.equal(
		verifyDependencyChanges([assessedChange], new Date("2026-11-11T23:59:59Z")),
		1,
	);
	assert.throws(
		() =>
			verifyDependencyChanges(
				[assessedChange],
				new Date("2026-11-12T00:00:00Z"),
			),
		/assessment expired/,
	);
});

test("fails closed on missing or malformed review output", () => {
	for (const changes of [
		undefined,
		null,
		{},
		[null],
		[{}],
		[{ ...assessedChange, vulnerabilities: undefined }],
		[{ ...assessedChange, vulnerabilities: [null] }],
	]) {
		assert.throws(() => verifyDependencyChanges(changes, reviewDate));
	}
});

test("keeps the workflow and Trivy assessment aligned", () => {
	const trivy = readFileSync(
		join(__dirname, "../../linters/trivy-ignore.yaml"),
		"utf8",
	);
	for (const value of Object.values(assessment)) {
		assert(trivy.includes(value), `Trivy assessment is missing ${value}`);
	}
	const workflow = readFileSync(
		join(__dirname, "../../workflows/__shared-ci.yml"),
		"utf8",
	);
	assert(workflow.includes(`allow-ghsas: ${assessment.advisory}`));
});
