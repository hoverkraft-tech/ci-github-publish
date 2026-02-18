const { execSync } = require("node:child_process");

module.exports = async ({ core }) => {
  const baseRef = process.env.BASE_REF.trim();
  const headRef = process.env.HEAD_REF.trim();
  const useConventionalCommits =
    process.env.CONVENTIONAL_COMMITS.trim() === "true";
  const llmSummaryInput = process.env.LLM_SUMMARY.trim();
  const llmModel = process.env.LLM_MODEL.trim();
  const llmApiKey = process.env.LLM_API_KEY.trim();
  const llmBaseUrl = process.env.LLM_BASE_URL.trim();
  const llmSummaryCommand = process.env.LLM_SUMMARY_COMMAND.trim();
  const markdownTemplate = process.env.MARKDOWN_TEMPLATE;

  if (!baseRef || !headRef) {
    core.setFailed("Both base-ref and head-ref inputs are required.");
    return;
  }

  const rawLog = execSync(
    `git log --no-merges --pretty=format:%s ${baseRef}..${headRef}`,
    {
      encoding: "utf8",
    },
  ).trim();

  const commits = rawLog
    ? rawLog
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
  const groupedCommits = commits.reduce((acc, subject) => {
    const match = subject.match(
      /^(?<type>[a-z]+)(?:\([^)]+\))?(?:!)?:\s+(?<description>.+)$/i,
    );
    const rawType = match?.groups?.type?.toLowerCase();
    const description = match?.groups?.description || subject;

    let section = "Other changes";
    if (useConventionalCommits && rawType) {
      const typeToTitle = {
        feat: "Features",
        fix: "Bug fixes",
        perf: "Performance",
        refactor: "Refactors",
        docs: "Documentation",
        test: "Tests",
        build: "Build",
        ci: "CI",
        chore: "Chores",
        style: "Style",
        revert: "Reverts",
      };
      section = typeToTitle[rawType] || "Other changes";
    } else if (!useConventionalCommits) {
      section = "Changes";
    }

    if (!acc.has(section)) {
      acc.set(section, []);
    }

    acc.get(section).push(useConventionalCommits ? description : subject);
    return acc;
  }, new Map());

  const changes = [...groupedCommits.entries()]
    .map(
      ([section, entries]) =>
        `### ${section}\n${entries.map((entry) => `- ${entry}`).join("\n")}`,
    )
    .join("\n\n")
    .trim();

  const llmPrompt = [
    "Summarize the following release changes as markdown:",
    `Base ref: ${baseRef}`,
    `Head ref: ${headRef}`,
    "",
    changes || "- No user-facing changes found.",
  ].join("\n");

  let llmSummary = llmSummaryInput;
  if (!llmSummary && llmModel) {
    if (!llmApiKey) {
      core.setFailed("llm-api-key is required when llm-model is provided.");
      return;
    }

    const OpenAI = require("openai");
    const openai = new OpenAI({
      apiKey: llmApiKey,
      baseURL: llmBaseUrl || undefined,
    });

    const completion = await openai.chat.completions.create({
      model: llmModel,
      messages: [
        {
          role: "system",
          content: "You generate concise release summaries in Markdown.",
        },
        { role: "user", content: llmPrompt },
      ],
    });

    llmSummary = completion.choices?.[0]?.message?.content?.trim() || "";
  }

  if (!llmSummary && llmSummaryCommand) {
    llmSummary = execSync(llmSummaryCommand, {
      encoding: "utf8",
      input: llmPrompt,
    }).trim();
  }

  const summary = llmSummary ? `### Summary\n${llmSummary}` : "";
  const changelog = markdownTemplate
    .replace(/\{\{base_ref\}\}/g, baseRef)
    .replace(/\{\{head_ref\}\}/g, headRef)
    .replace(/\{\{commit_count\}\}/g, `${commits.length}`)
    .replace(/\{\{summary\}\}/g, summary)
    .replace(/\{\{changes\}\}/g, changes)
    .trim();

  core.setOutput("commit-count", `${commits.length}`);
  core.setOutput("changes", changes);
  core.setOutput("llm-prompt", llmPrompt);
  core.setOutput("changelog", changelog);
};
