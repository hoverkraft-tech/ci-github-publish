import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LlmSummaryService } from "./LlmSummaryService.js";

const INPUTS = {
	llmProvider: "google-genai",
	llmModel: "gemini-3.8-flash",
	llmAuth: "test-token",
	llmConfig: {},
};
const SUMMARY = {
	releaseSummary: "Public API support was added.",
	breakingChanges: "There is no breaking change.",
};

function mockGemini(context, { failures, status = 503, text } = {}) {
	const requests = [];
	const delays = [];
	context.mock.method(Math, "random", () => 0.5);
	context.mock.method(globalThis, "setTimeout", (callback, delay, ...args) => {
		delays.push(delay);
		return setImmediate(callback, ...args);
	});
	context.mock.method(globalThis, "fetch", async (url, options) => {
		assert.match(String(url), /models\/gemini-3\.8-flash:generateContent$/);
		requests.push(JSON.parse(options.body));
		if (requests.length <= failures) {
			return new Response(
				JSON.stringify({ error: { message: "Provider request failed" } }),
				{ status },
			);
		}
		return new Response(
			JSON.stringify({
				candidates: [
					{
						content: {
							role: "model",
							parts: [{ text: text ?? JSON.stringify(SUMMARY) }],
						},
						finishReason: "STOP",
					},
				],
			}),
		);
	});
	return { requests, delays };
}

describe("LlmSummaryService provider retries", () => {
	it("recovers from prolonged Gemini overload without caller configuration", async (context) => {
		const { requests, delays } = mockGemini(context, { failures: 8 });
		const messages = [];
		const service = new LlmSummaryService({
			info: (message) => messages.push(message),
		});

		const summary = await service.generate(INPUTS, "Summarize this changelog");

		assert.deepEqual(summary, SUMMARY);
		assert.equal(requests.length, 9);
		assert.ok(
			requests.every(
				(request) => JSON.stringify(request) === JSON.stringify(requests[0]),
			),
		);
		assert.deepEqual(
			delays,
			[1500, 3000, 6000, 12000, 24000, 48000, 96000, 192000],
		);
		assert.match(
			messages[0],
			/up to 8 automatic retries with exponential backoff/,
		);
	});

	it("propagates persistent overload after the default retry limit", async (context) => {
		const { requests, delays } = mockGemini(context, { failures: Infinity });

		await assert.rejects(
			new LlmSummaryService().generate(INPUTS, "Summarize this changelog"),
			{ status: 503 },
		);

		assert.equal(requests.length, 9);
		assert.equal(delays.length, 8);
	});

	for (const maxRetries of [0, 2]) {
		it(`honors an explicit retry limit of ${maxRetries}`, async (context) => {
			const { requests, delays } = mockGemini(context, { failures: Infinity });

			await assert.rejects(
				new LlmSummaryService().generate(
					{ ...INPUTS, llmConfig: { maxRetries } },
					"Summarize this changelog",
				),
				{ status: 503 },
			);

			assert.equal(requests.length, maxRetries + 1);
			assert.equal(delays.length, maxRetries);
		});
	}

	for (const status of [400, 401, 403, 404]) {
		it(`fails immediately for HTTP ${status}`, async (context) => {
			const { requests, delays } = mockGemini(context, {
				failures: Infinity,
				status,
			});

			await assert.rejects(
				new LlmSummaryService().generate(INPUTS, "Summarize this changelog"),
				{ status },
			);

			assert.equal(requests.length, 1);
			assert.deepEqual(delays, []);
		});
	}

	it("does not retry invalid summary JSON", async (context) => {
		const { requests, delays } = mockGemini(context, { text: "not-json" });

		await assert.rejects(
			new LlmSummaryService().generate(INPUTS, "Summarize this changelog"),
			/The configured LLM returned invalid JSON:/,
		);

		assert.equal(requests.length, 1);
		assert.deepEqual(delays, []);
	});

	for (const maxRetries of [-1, 1.5, "8", true, {}, Number.MAX_VALUE]) {
		it(`rejects invalid maxRetries ${JSON.stringify(maxRetries)} before initializing the model`, async (context) => {
			const initChatModel = context.mock.fn();
			const service = new LlmSummaryService(undefined, initChatModel);

			await assert.rejects(
				service.generate(
					{ ...INPUTS, llmConfig: { maxRetries } },
					"Summarize this changelog",
				),
				/llm-config.maxRetries must be a non-negative integer\./,
			);

			assert.equal(initChatModel.mock.callCount(), 0);
		});
	}
});
