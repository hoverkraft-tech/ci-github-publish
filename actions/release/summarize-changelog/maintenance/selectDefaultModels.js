/**
 * Pure model-selection logic for the release/summarize-changelog default model map.
 *
 * The summarize-changelog action sends text and expects a text (JSON) answer.
 * It does not generate images, audio or embeddings, so this module keeps only
 * text-in/text-out chat models and picks the newest non-deprecated, non-preview,
 * non-dated release per provider.
 *
 * It operates on the models.dev dataset shape (https://models.dev/api.json) but
 * takes the parsed data as an argument so it stays free of network and file I/O.
 */

/** Maps our LangChain provider keys to models.dev provider ids. */
export const PROVIDER_DATASOURCE_MAP = Object.freeze({
	openai: "openai",
	anthropic: "anthropic",
	"google-genai": "google",
	xai: "xai",
	deepseek: "deepseek",
});

const DATED_SNAPSHOT = /-(\d{8}|\d{4}-\d{2}-\d{2})$/;
const PREVIEW = /(preview|experimental|\bexp\b|beta|alpha|-rc\d*\b)/i;
const NON_CHAT =
	/(embedding|whisper|transcribe|\btts\b|audio|realtime|image|live|lyria)/i;

function includesText(modalities) {
	return Array.isArray(modalities) && modalities.includes("text");
}

function outputsOnlyText(output) {
	return (
		includesText(output) &&
		!output.includes("image") &&
		!output.includes("audio")
	);
}

/**
 * Returns true when a models.dev model entry is usable for text summarization.
 */
export function isRelevantSummaryModel(model) {
	if (!model || typeof model.id !== "string") {
		return false;
	}

	if (model.status === "deprecated") {
		return false;
	}

	if (model.tool_call !== true) {
		return false;
	}

	if (!includesText(model.modalities?.input)) {
		return false;
	}

	if (!outputsOnlyText(model.modalities?.output)) {
		return false;
	}

	if (DATED_SNAPSHOT.test(model.id)) {
		return false;
	}

	if (PREVIEW.test(model.id) || PREVIEW.test(model.name ?? "")) {
		return false;
	}

	if (NON_CHAT.test(model.id)) {
		return false;
	}

	return true;
}

/**
 * Orders relevant models newest first, with deterministic tie-breaking:
 * newest release_date, then shortest id (prefers the stable alias over a
 * variant), then lexical id.
 */
function compareByRelevance(a, b) {
	if (a.release_date !== b.release_date) {
		return (b.release_date ?? "").localeCompare(a.release_date ?? "");
	}

	if (a.id.length !== b.id.length) {
		return a.id.length - b.id.length;
	}

	return a.id.localeCompare(b.id);
}

/**
 * Picks the newest relevant model for a single models.dev provider entry,
 * or null when none qualifies.
 */
export function selectDefaultModel(providerData) {
	const models = Object.values(providerData?.models ?? {});
	const relevant = models.filter(isRelevantSummaryModel);

	if (relevant.length === 0) {
		return null;
	}

	relevant.sort(compareByRelevance);
	return relevant[0];
}

/**
 * Computes the default model map for the given current map, keeping its provider
 * keys. Unknown providers or providers without a qualifying model keep their
 * current value.
 *
 * @returns {{ map: Record<string,string>, changes: Array<{provider:string, from:string, to:string, model:object}> }}
 */
export function computeDefaultModels(apiData, currentMap) {
	const map = {};
	const changes = [];

	for (const [provider, currentModel] of Object.entries(currentMap)) {
		const datasourceId = PROVIDER_DATASOURCE_MAP[provider];
		const selected = datasourceId
			? selectDefaultModel(apiData?.[datasourceId])
			: null;

		if (!selected) {
			map[provider] = currentModel;
			continue;
		}

		map[provider] = selected.id;

		if (selected.id !== currentModel) {
			changes.push({
				provider,
				from: currentModel,
				to: selected.id,
				model: selected,
			});
		}
	}

	return { map, changes };
}
