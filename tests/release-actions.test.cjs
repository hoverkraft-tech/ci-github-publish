const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { test } = require("node:test");

const workflow = JSON.parse(
	execFileSync("ruby", [
		"-rjson",
		"-ryaml",
		"-e",
		"puts JSON.generate(YAML.safe_load(File.read(ARGV[0])))",
		path.join(__dirname, "../.github/workflows/release-actions.yml"),
	]),
);
const publication = workflow.jobs["upload-documentation-artifact"];

function shouldPublish(result, pending, artifact, changedFiles) {
	const needs = {
		"update-documentation": {
			result,
			outputs: { "merge-pending": pending },
		},
		"generate-documentation": { outputs: { "artifact-id": artifact } },
		"get-documentation-changes": {
			outputs: { "documentation-files": changedFiles },
		},
	};
	const expression = publication.if
		.replace(/always\(\)/g, "true")
		.replace(
			/needs\.([\w-]+)\.(outputs\.([\w-]+)|result)/g,
			(_, job, field, output) =>
				JSON.stringify(output ? needs[job].outputs[output] : needs[job][field]),
		);
	return Boolean(new Function(`return (${expression});`)());
}

test("publication waits for the documentation merge request", () => {
	assert.ok(publication.needs.includes("update-documentation"));
	assert.equal(
		workflow.jobs["update-documentation"].outputs["merge-pending"],
		// biome-ignore lint/suspicious/noTemplateCurlyInString: GitHub Actions expression.
		"${{ steps.update-documentation.outputs.merge-pending }}",
	);
});

test("merged documentation can trigger CI to publish after leaving the queue", () => {
	const update = workflow.jobs["update-documentation"].steps.find(
		(step) => step.id === "update-documentation",
	);
	assert.doesNotMatch(update.with["commit-message"], /\[(skip ci|ci skip)\]/i);
});

for (const [name, result, pending, artifact, changedFiles, expected] of [
	["completed merge", "success", "false", "artifact", "", true],
	["queued merge", "success", "true", "artifact", "README.md", false],
	["unchanged generated files", "success", "false", "artifact", "", true],
	["only existing documentation changed", "skipped", "", "", "README.md", true],
	["no changes", "skipped", "", "", "", false],
	["failed merge", "failure", "", "artifact", "README.md", false],
	["cancelled merge", "cancelled", "", "artifact", "README.md", false],
]) {
	test(`publication handles ${name}`, () => {
		assert.equal(
			shouldPublish(result, pending, artifact, changedFiles),
			expected,
		);
	});
}
