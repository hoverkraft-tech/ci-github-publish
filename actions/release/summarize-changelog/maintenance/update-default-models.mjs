#!/usr/bin/env node
/**
 * Maintenance CLI: refresh the release/summarize-changelog default model map.
 *
 * Fetches the models.dev dataset, recomputes the newest task-relevant model per
 * provider and rewrites src/default-llm-models.json only when it changes.
 *
 * It is a reminder/proposal tool: a workflow opens a review pull request with
 * the result. It never auto-selects without human review and fails safe (no
 * change, exit 0) when the dataset cannot be fetched, so scheduled runs never
 * break on a transient upstream outage.
 */
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { computeDefaultModels } from "./selectDefaultModels.js";

const MODELS_DEV_URL = "https://models.dev/api.json";
const FETCH_TIMEOUT_MS = 30_000;

const dataFileUrl = new URL(
	"../src/default-llm-models.json",
	import.meta.url,
);

function log(message) {
	process.stdout.write(`${message}\n`);
}

function warn(message) {
	process.stderr.write(`${message}\n`);
}

function setOutput(name, value) {
	const file = process.env.GITHUB_OUTPUT;
	if (!file) {
		return;
	}

	const delimiter = `ghadelimiter_${name}_${Date.now()}`;
	appendFileSync(file, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
}

async function fetchModelsDataset() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

	try {
		const response = await fetch(MODELS_DEV_URL, {
			signal: controller.signal,
			headers: { accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status} from ${MODELS_DEV_URL}`);
		}

		return await response.json();
	} finally {
		clearTimeout(timeout);
	}
}

function readCurrentMap() {
	return JSON.parse(readFileSync(dataFileUrl, "utf8"));
}

function writeMap(map) {
	writeFileSync(dataFileUrl, `${JSON.stringify(map, null, 2)}\n`);
}

function formatCost(model) {
	const input = model?.cost?.input;
	const output = model?.cost?.output;
	if (input === undefined && output === undefined) {
		return "";
	}
	return ` (cost in/out: ${input ?? "?"}/${output ?? "?"})`;
}

function buildPrBody(changes) {
	const lines = [
		"Automated review of the release/summarize-changelog default model map.",
		"",
		"Source: [models.dev](https://models.dev/api.json). Selection rule: newest",
		"non-deprecated, non-preview, non-dated text chat model (tool-calling, text",
		"input and output only). Review that each model is appropriate and",
		"cost-effective for changelog summarization before merging.",
		"",
		"Proposed changes:",
		"",
	];

	for (const change of changes) {
		lines.push(
			`- \`${change.provider}\`: \`${change.from}\` -> \`${change.to}\` (released ${change.model.release_date ?? "unknown"})${formatCost(change.model)}`,
		);
	}

	return lines.join("\n");
}

async function main() {
	const currentMap = readCurrentMap();

	let apiData;
	try {
		apiData = await fetchModelsDataset();
	} catch (error) {
		warn(`Could not fetch models dataset, keeping current map: ${error.message}`);
		setOutput("changed", "false");
		return;
	}

	const { map, changes } = computeDefaultModels(apiData, currentMap);

	if (changes.length === 0) {
		log("Default model map already up to date.");
		setOutput("changed", "false");
		return;
	}

	writeMap(map);

	log("Updated default model map:");
	for (const change of changes) {
		log(`  ${change.provider}: ${change.from} -> ${change.to}`);
	}

	setOutput("changed", "true");
	setOutput("pr-body", buildPrBody(changes));
}

main().catch((error) => {
	warn(`Unexpected failure: ${error.stack || error.message}`);
	process.exitCode = 1;
});
