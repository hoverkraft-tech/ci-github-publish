import {
	BREAKING_CHANGES_PLACEHOLDER,
	DEFAULT_SUMMARY_TEMPLATE,
	RELEASE_SUMMARY_PLACEHOLDER,
} from "./PromptBuilder.js";

export class ReleaseSummaryCore {
	constructor(
		fileSystemService,
		logger,
		gitEvidenceService,
		linkEvidenceService,
		promptBuilder,
		llmSummaryService,
	) {
		this.fileSystemService = fileSystemService;
		this.logger = logger;
		this.gitEvidenceService = gitEvidenceService;
		this.linkEvidenceService = linkEvidenceService;
		this.promptBuilder = promptBuilder;
		this.llmSummaryService = llmSummaryService;
	}

	async summarize(inputs) {
		const normalizedInputs = this.#normalizeInputs(inputs);

		this.logger.info(
			`Working directory: ${this.fileSystemService.getRelativeWorkingDirectory() || "."}`,
		);
		this.logger.info(`LLM provider: ${normalizedInputs.llmProvider}`);
		this.logger.info(`LLM model: ${normalizedInputs.llmModel}`);

		const gitEvidence = await this.gitEvidenceService.collect(
			normalizedInputs.changelogBody,
			this.fileSystemService,
		);
		const linkEvidence = await this.linkEvidenceService.collect(
			normalizedInputs.changelogBody,
		);

		const llmPrompt = this.promptBuilder.build({
			summaryTemplate: normalizedInputs.summaryTemplate,
			changelogBody: normalizedInputs.changelogBody,
			workingDirectory:
				this.fileSystemService.getRelativeWorkingDirectory() || ".",
			gitEvidence,
			linkEvidence,
		});

		const summarySections = await this.llmSummaryService.generate(
			normalizedInputs,
			llmPrompt,
		);

		const summary = this.#renderSummary(
			normalizedInputs.summaryTemplate,
			summarySections,
		);

		return {
			llmPrompt,
			summary,
		};
	}

	#normalizeInputs(inputs) {
		const changelogBody = (inputs.changelogBody || "").trim();
		const llmModel = (inputs.llmModel || "").trim();
		const llmProvider = (inputs.llmProvider || "openai").trim();
		const llmAuth = (inputs.llmAuth || "").trim();
		const llmConfig = this.#parseLlmConfig(inputs.llmConfig);
		const summaryTemplate = inputs.summaryTemplate || DEFAULT_SUMMARY_TEMPLATE;

		if (!changelogBody) {
			throw new Error("The changelog-body input is required.");
		}

		if (!llmModel) {
			throw new Error("The llm-model input is required.");
		}

		if (!llmAuth) {
			throw new Error("The llm-auth input is required.");
		}

		if (
			this.#countOccurrences(summaryTemplate, RELEASE_SUMMARY_PLACEHOLDER) !== 1
		) {
			throw new Error(
				"The summary-template input must include exactly one `{{release_summary}}` placeholder.",
			);
		}

		if (
			this.#countOccurrences(summaryTemplate, BREAKING_CHANGES_PLACEHOLDER) !==
			1
		) {
			throw new Error(
				"The summary-template input must include exactly one `{{breaking_changes}}` placeholder.",
			);
		}

		return {
			changelogBody,
			llmModel,
			llmProvider,
			llmAuth,
			llmConfig,
			summaryTemplate,
		};
	}

	#parseLlmConfig(rawValue) {
		const llmConfigValue = (rawValue || "{}").trim() || "{}";
		let parsedValue;

		try {
			parsedValue = JSON.parse(llmConfigValue);
		} catch (error) {
			throw new Error(
				`The llm-config input must be valid JSON: ${error.message}`,
			);
		}

		if (
			!parsedValue ||
			typeof parsedValue !== "object" ||
			Array.isArray(parsedValue)
		) {
			throw new Error("The llm-config input must be a JSON object.");
		}

		return parsedValue;
	}

	#renderSummary(summaryTemplate, summarySections) {
		const summary = summaryTemplate
			.replace(RELEASE_SUMMARY_PLACEHOLDER, summarySections.releaseSummary)
			.replace(BREAKING_CHANGES_PLACEHOLDER, summarySections.breakingChanges)
			.trim();

		if (!summary) {
			throw new Error("The configured LLM returned an empty release summary.");
		}

		return summary;
	}

	#countOccurrences(source, value) {
		return source.split(value).length - 1;
	}
}
