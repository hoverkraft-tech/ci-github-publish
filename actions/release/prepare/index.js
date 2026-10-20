import path from "node:path";
import { createForgeAdapter, draftRelease, loadConfig } from "release-drafter";
import { ReleaseConfiguration } from "./ReleaseConfiguration.js";
import { ReleaseHistoryAdapter } from "./ReleaseHistoryAdapter.js";

export async function run({ core, context, env = process.env, adapter }) {
	const token = env.RELEASE_TOKEN?.trim();
	const configName = env.RELEASE_CONFIG?.trim();
	if (!token || !configName) {
		throw new Error("Release token and configuration are required.");
	}
	if (!["true", "false"].includes(env.RELEASE_DRY_RUN)) {
		throw new Error("dry-run must be true or false.");
	}

	const repository = {
		owner: context.repo.owner,
		name: context.repo.repo,
		serverUrl: env.GITHUB_SERVER_URL || "https://github.com",
	};
	const forgeAdapter =
		adapter ||
		createForgeAdapter({
			forge: "github",
			token,
			serverUrl: repository.serverUrl,
			apiUrl: env.GITHUB_API_URL,
			graphqlUrl: env.GITHUB_GRAPHQL_URL,
			logger: core,
		});
	const overrides = {};
	for (const [key, value] of [
		["prerelease", env.RELEASE_PRERELEASE],
		["latest", env.RELEASE_LATEST],
	]) {
		if (value === "true" || value === "false") {
			overrides[key] = value === "true";
		} else if (value) {
			throw new Error(`${key} must be true or false.`);
		}
	}
	const target = env.RELEASE_TARGET?.trim() || context.ref;
	const workspace = env.GITHUB_WORKSPACE || process.cwd();
	const configuration = new ReleaseConfiguration({
		workspace,
		runnerTemp: env.RUNNER_TEMP,
	});
	const config = await configuration.load(loadConfig, {
		adapter: forgeAdapter,
		repository,
		target: configName,
		ref: target,
		cwd: path.join(workspace, ".github"),
		overrides: {
			...overrides,
			...(env.RELEASE_TARGET?.trim() ? { commitish: target } : {}),
		},
		logger: core,
	});
	const result = await draftRelease({
		adapter: new ReleaseHistoryAdapter(forgeAdapter, config["tag-prefix"]),
		repository,
		config,
		input: {
			tag: env.RELEASE_TAG?.trim() || undefined,
			publish: false,
			dryRun: env.RELEASE_DRY_RUN === "true",
		},
		logger: core,
	});

	core.setOutput("tag_name", result.releasePayload.tag);
	core.setOutput("name", result.releasePayload.name);
	core.setOutput("body", result.releasePayload.body);
}
