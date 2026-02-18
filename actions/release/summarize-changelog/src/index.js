export async function run({ core, github, context, inputs, services }) {
  try {
    const { releaseSummaryCore } =
      services || (await createDefaultServices(core, github, context, inputs));

    const { llmPrompt, summary } = await releaseSummaryCore.summarize(inputs);

    core.setOutput("llm-prompt", llmPrompt);
    core.setOutput("summary", summary);
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
    throw error;
  }
}

async function createDefaultServices(core, github, context, inputs) {
  const { FileSystemService } = await import("./FileSystemService.js");
  const { LoggerService } = await import("./LoggerService.js");
  const { ReferenceExtractor } = await import("./ReferenceExtractor.js");
  const { GitEvidenceService } = await import("./GitEvidenceService.js");
  const { LinkEvidenceService } = await import("./LinkEvidenceService.js");
  const { PromptBuilder } = await import("./PromptBuilder.js");
  const { LlmSummaryService } = await import("./LlmSummaryService.js");
  const { ReleaseSummaryCore } = await import("./ReleaseSummaryCore.js");

  const fileSystemService = new FileSystemService(inputs.workingDirectory);
  const logger = new LoggerService(core);
  const referenceExtractor = new ReferenceExtractor();

  return {
    releaseSummaryCore: new ReleaseSummaryCore(
      fileSystemService,
      logger,
      new GitEvidenceService(referenceExtractor, logger, github, context.repo),
      new LinkEvidenceService(referenceExtractor, logger),
      new PromptBuilder(),
      new LlmSummaryService(),
    ),
  };
}
