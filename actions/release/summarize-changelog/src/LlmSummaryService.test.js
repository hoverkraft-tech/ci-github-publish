import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LlmSummaryService } from "./LlmSummaryService.js";

describe("LlmSummaryService", () => {
	it("preserves initChatModel baseUrl config and populates OpenAI configuration.baseURL", async () => {
		const initCalls = [];
		const service = new LlmSummaryService(async (model, config) => {
			initCalls.push({ model, config });

			return {
				async invoke() {
					return {
						content: JSON.stringify({
							releaseSummary: "Public API support was added.",
							breakingChanges: "There is no breaking change.",
						}),
					};
				},
			};
		});

		const summary = await service.generate(
			{
				llmProvider: "openai",
				llmModel: "gpt-5.4",
				llmAuth: "token",
				llmConfig: {
					baseUrl: "https://api.openai.com/v1",
					temperature: 0.2,
				},
			},
			"Summarize this changelog",
		);

		assert.deepEqual(initCalls, [
			{
				model: "openai:gpt-5.4",
				config: {
					apiKey: "token",
					baseUrl: "https://api.openai.com/v1",
					configuration: {
						baseURL: "https://api.openai.com/v1",
					},
					temperature: 0.2,
				},
			},
		]);
		assert.equal(summary.releaseSummary, "Public API support was added.");
		assert.equal(summary.breakingChanges, "There is no breaking change.");
	});

	it("fails when the model response is not valid JSON", async () => {
		const service = new LlmSummaryService(async () => ({
			async invoke() {
				return {
					content: "not-json",
				};
			},
		}));

		await assert.rejects(
			() =>
				service.generate(
					{
						llmProvider: "anthropic",
						llmModel: "claude-sonnet-4-6",
						llmAuth: "token",
						llmConfig: {},
					},
					"Summarize this changelog",
				),
			/The configured LLM returned invalid JSON:/,
		);
	});
});
