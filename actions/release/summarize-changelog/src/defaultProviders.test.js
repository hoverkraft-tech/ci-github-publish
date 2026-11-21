import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { PROVIDER_DATASOURCE_MAP } from "../maintenance/selectDefaultModels.js";
import { LlmSummaryService } from "./LlmSummaryService.js";

const seeds = JSON.parse(
	readFileSync(new URL("./default-llm-models.json", import.meta.url), "utf8"),
);

function stubChatModel(calls) {
	return async (model) => {
		calls.push(model);
		return {
			async invoke() {
				return {
					content: JSON.stringify({
						releaseSummary: "ok",
						breakingChanges: "none",
					}),
				};
			},
		};
	};
}

describe("default provider wiring", () => {
	for (const [provider, model] of Object.entries(seeds)) {
		it(`wires ${provider} across data file, curator map and service`, async () => {
			assert.ok(
				PROVIDER_DATASOURCE_MAP[provider],
				`${provider} is seeded but missing from PROVIDER_DATASOURCE_MAP`,
			);

			const calls = [];
			const service = new LlmSummaryService(undefined, stubChatModel(calls));

			await service.generate(
				{ llmProvider: provider, llmModel: model, llmAuth: "t", llmConfig: {} },
				"prompt",
			);

			assert.equal(calls[0], `${provider}:${model}`);
		});
	}
});
