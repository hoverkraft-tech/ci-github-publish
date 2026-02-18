const SYSTEM_PROMPT = [
  "You write accurate release summaries for technical end users.",
  "Use only facts present in the provided changelog and the confirmed evidence sections.",
  "Never hallucinate, invent, infer, or guess.",
  "Prioritize public-facing changes and mention internal changes only after a visible blank line.",
  "When scopes are explicit, group the narrative by scope.",
  "Order highlights as features, fixes, then internal changes.",
  "The Release Summary section must stay within 5 sentences total, with no bullet points and no extra detail.",
  "Return valid JSON only, with string properties `releaseSummary` and `breakingChanges`.",
  "End with a dedicated Breaking changes section. If there is no confirmed breaking change, state that there is no breaking change.",
  "If breaking changes reference URLs, use the linked evidence when it is available below.",
].join(" ");

const SUPPORTED_PROVIDERS = new Set(["openai", "anthropic", "google-genai"]);

export class LlmSummaryService {
  constructor(initChatModelImpl) {
    this.initChatModelImpl = initChatModelImpl;
  }

  async generate(inputs, llmPrompt) {
    if (!SUPPORTED_PROVIDERS.has(inputs.llmProvider)) {
      throw new Error(
        "Unsupported llm-provider. Supported values: openai, anthropic, google-genai.",
      );
    }

    const initChatModel =
      this.initChatModelImpl ||
      (await import("langchain/chat_models/universal")).initChatModel;

    const resolvedModel = `${inputs.llmProvider}:${inputs.llmModel}`;

    const llmConfig = this.#normalizeLlmConfig({
      ...inputs.llmConfig,
      apiKey: inputs.llmAuth,
    });

    const llm = await initChatModel(resolvedModel, llmConfig);
    const response = await llm.invoke([
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: llmPrompt,
      },
    ]);

    return this.#parseStructuredSummary(
      this.#normalizeModelText(response?.content),
    );
  }

  #normalizeLlmConfig(llmConfig) {
    if (!llmConfig) {
      return llmConfig;
    }

    const normalizedConfig = {
      ...llmConfig,
    };

    const baseUrl = normalizedConfig.baseUrl || normalizedConfig.baseURL;

    if (!baseUrl) {
      return normalizedConfig;
    }

    normalizedConfig.baseUrl = baseUrl;

    if (normalizedConfig.configuration?.baseURL) {
      return normalizedConfig;
    }

    return {
      ...normalizedConfig,
      configuration: {
        ...(normalizedConfig.configuration || {}),
        baseURL: baseUrl,
      },
    };
  }

  #normalizeModelText(content) {
    if (typeof content === "string") {
      return content.trim();
    }

    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === "string") {
            return part;
          }

          if (typeof part?.text === "string") {
            return part.text;
          }

          return "";
        })
        .join("")
        .trim();
    }

    return "";
  }

  #parseStructuredSummary(responseText) {
    const sanitized = this.#stripCodeFence(responseText);
    let parsed;

    try {
      parsed = JSON.parse(sanitized);
    } catch (error) {
      throw new Error(
        `The configured LLM returned invalid JSON: ${error.message}`,
      );
    }

    const releaseSummary = parsed?.releaseSummary?.trim();
    const breakingChanges = parsed?.breakingChanges?.trim();

    if (!releaseSummary) {
      throw new Error(
        "The configured LLM returned an invalid `releaseSummary` field.",
      );
    }

    if (!breakingChanges) {
      throw new Error(
        "The configured LLM returned an invalid `breakingChanges` field.",
      );
    }

    return {
      releaseSummary,
      breakingChanges,
    };
  }

  #stripCodeFence(responseText) {
    const trimmed = responseText.trim();
    const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return fencedMatch ? fencedMatch[1].trim() : trimmed;
  }
}
