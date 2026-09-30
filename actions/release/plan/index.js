const { randomUUID } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

function prepareConfiguration({ configPath, workspace, runnerTemp }) {
	if (!configPath?.trim()) {
		throw new Error("Configuration path is not specified.");
	}

	const githubDirectory = path.join(workspace, ".github");
	const originalPath = path.resolve(githubDirectory, configPath);
	if (!fs.existsSync(originalPath)) {
		throw new Error(`Configuration file not found: ${configPath}`);
	}

	const directory = fs.mkdtempSync(path.join(runnerTemp, "release-plan-"));
	const detectionPath = path.join(directory, "config.yml");
	const marker = `release-plan-${randomUUID()}`;

	// Inherit all release filters and version rules without rewriting user YAML.
	// Override presentation so custom templates and replacers cannot hide changes.
	const config = {
		_extends: `file:${path.relative(directory, originalPath).split(path.sep).join("/")}`,
		template: `${marker}:$PREVIOUS_TAG\n$CHANGES`,
		"no-changes-template": `${marker}:no-changes`,
		header: "",
		footer: "",
		replacers: [],
	};
	fs.writeFileSync(detectionPath, `${JSON.stringify(config, null, 2)}\n`);

	return {
		configPath: path
			.relative(githubDirectory, detectionPath)
			.split(path.sep)
			.join("/"),
		marker,
	};
}

async function assertTagDoesNotExist(github, repo, tag) {
	try {
		await github.rest.git.getRef({ ...repo, ref: `tags/${tag}` });
	} catch (error) {
		if (error.status === 404) return;
		throw new Error(`Cannot check remote tag ${tag}: ${error.message}`);
	}
	throw new Error(`Remote tag already exists: ${tag}`);
}

async function resolvePlan({ body, marker, tag, name, github, repo }) {
	const prefix = `${marker}:`;
	const lineEnd = body?.indexOf("\n") ?? -1;
	if (!marker || !body?.startsWith(prefix) || lineEnd < 0) {
		throw new Error(
			"Cannot determine release changes from Release Drafter output.",
		);
	}

	const previousTag = body.slice(prefix.length, lineEnd).trim();
	const changes = body.slice(lineEnd + 1).trim();
	if (!changes || previousTag === "$PREVIOUS_TAG" || changes === "$CHANGES") {
		throw new Error(
			"Cannot determine release changes from Release Drafter output.",
		);
	}

	// Release Drafter has no comparison history for a first release.
	const hasChanges = !previousTag || !changes.includes(`${marker}:no-changes`);

	const releaseTag = tag?.trim();
	if (!releaseTag) {
		throw new Error("Cannot determine release tag. Configure Release Drafter.");
	}
	await assertTagDoesNotExist(github, repo, releaseTag);
	return {
		hasChanges,
		tag: releaseTag,
		name: name?.trim() || releaseTag,
	};
}

module.exports = { prepareConfiguration, resolvePlan };
