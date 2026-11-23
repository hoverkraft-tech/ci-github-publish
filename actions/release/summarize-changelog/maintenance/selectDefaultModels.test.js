import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	computeDefaultModels,
	isRelevantSummaryModel,
	selectDefaultModel,
	serializeDefaultModels,
} from "./selectDefaultModels.js";

function model(overrides) {
	return {
		id: "chat-1",
		name: "Chat 1",
		status: null,
		tool_call: true,
		release_date: "2025-01-01",
		modalities: { input: ["text"], output: ["text"] },
		...overrides,
	};
}

describe("isRelevantSummaryModel", () => {
	it("keeps a text-in/text-out tool-calling chat model", () => {
		assert.equal(isRelevantSummaryModel(model()), true);
	});

	it("excludes deprecated models", () => {
		assert.equal(
			isRelevantSummaryModel(model({ status: "deprecated" })),
			false,
		);
	});

	it("excludes models without tool-calling", () => {
		assert.equal(isRelevantSummaryModel(model({ tool_call: false })), false);
	});

	it("excludes image generation models", () => {
		assert.equal(
			isRelevantSummaryModel(
				model({
					id: "gpt-image-2",
					modalities: { input: ["text"], output: ["image"] },
				}),
			),
			false,
		);
	});

	it("excludes audio and realtime models by output modality", () => {
		assert.equal(
			isRelevantSummaryModel(
				model({
					id: "gpt-realtime",
					modalities: { input: ["text"], output: ["text", "audio"] },
				}),
			),
			false,
		);
	});

	it("excludes embedding models by id even when output is text", () => {
		assert.equal(
			isRelevantSummaryModel(model({ id: "text-embedding-3-large" })),
			false,
		);
	});

	it("excludes dated snapshots", () => {
		assert.equal(
			isRelevantSummaryModel(model({ id: "claude-sonnet-4-5-20250929" })),
			false,
		);
		assert.equal(
			isRelevantSummaryModel(model({ id: "gpt-4o-2024-08-06" })),
			false,
		);
	});

	it("excludes preview and experimental releases", () => {
		assert.equal(
			isRelevantSummaryModel(
				model({ id: "gemini-3.5-live-translate-preview" }),
			),
			false,
		);
		assert.equal(
			isRelevantSummaryModel(
				model({ id: "model-exp", name: "Model (experimental)" }),
			),
			false,
		);
	});
});

describe("selectDefaultModel", () => {
	it("picks the newest relevant model by release date", () => {
		const providerData = {
			models: {
				a: model({ id: "chat-old", release_date: "2024-01-01" }),
				b: model({ id: "chat-new", release_date: "2025-06-01" }),
				c: model({
					id: "chat-img",
					release_date: "2025-09-01",
					modalities: { input: ["text"], output: ["image"] },
				}),
			},
		};

		assert.equal(selectDefaultModel(providerData).id, "chat-new");
	});

	it("prefers the shorter id when release dates tie", () => {
		const providerData = {
			models: {
				a: model({ id: "chat-flash-variant", release_date: "2025-06-01" }),
				b: model({ id: "chat-flash", release_date: "2025-06-01" }),
			},
		};

		assert.equal(selectDefaultModel(providerData).id, "chat-flash");
	});

	it("returns null when no model qualifies", () => {
		const providerData = {
			models: { a: model({ tool_call: false }) },
		};

		assert.equal(selectDefaultModel(providerData), null);
	});
});

describe("computeDefaultModels", () => {
	it("updates changed providers and reports the changes", () => {
		const apiData = {
			openai: {
				models: { a: model({ id: "gpt-next", release_date: "2025-07-01" }) },
			},
			anthropic: {
				models: {
					a: model({ id: "claude-sonnet-latest", release_date: "2025-07-01" }),
				},
			},
		};

		const { map, changes } = computeDefaultModels(apiData, {
			openai: "gpt-5",
			anthropic: "claude-sonnet-latest",
		});

		assert.deepEqual(map, {
			openai: "gpt-next",
			anthropic: "claude-sonnet-latest",
		});
		assert.equal(changes.length, 1);
		assert.deepEqual(
			{
				provider: changes[0].provider,
				from: changes[0].from,
				to: changes[0].to,
			},
			{ provider: "openai", from: "gpt-5", to: "gpt-next" },
		);
	});

	it("keeps the current value when a provider has no qualifying model", () => {
		const apiData = { openai: { models: { a: model({ tool_call: false }) } } };

		const { map, changes } = computeDefaultModels(apiData, { openai: "gpt-5" });

		assert.deepEqual(map, { openai: "gpt-5" });
		assert.equal(changes.length, 0);
	});

	it("keeps unknown providers untouched", () => {
		const { map, changes } = computeDefaultModels(
			{},
			{ "custom-provider": "x" },
		);

		assert.deepEqual(map, { "custom-provider": "x" });
		assert.equal(changes.length, 0);
	});
});

describe("serializeDefaultModels", () => {
	it("writes valid JSON using Biome-compatible indentation and a final newline", () => {
		const serialized = serializeDefaultModels({
			openai: "gpt-5",
			anthropic: "claude-sonnet-latest",
		});

		assert.equal(
			serialized,
			'{\n\t"openai": "gpt-5",\n\t"anthropic": "claude-sonnet-latest"\n}\n',
		);
		assert.deepEqual(JSON.parse(serialized), {
			openai: "gpt-5",
			anthropic: "claude-sonnet-latest",
		});
	});
});
