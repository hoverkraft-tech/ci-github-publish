export const RELEASE_SUMMARY_PLACEHOLDER = "{{release_summary}}";
export const BREAKING_CHANGES_PLACEHOLDER = "{{breaking_changes}}";

const TRUNCATION_NOTICE = "[truncated for prompt budget]";
const MAX_TEMPLATE_LENGTH = 1200;
const MAX_CHANGELOG_LENGTH = 6000;
const MAX_GIT_EVIDENCE_LENGTH = 2500;
const MAX_LINK_EVIDENCE_LENGTH = 1500;
const MAX_PROMPT_LENGTH = 12000;

export const DEFAULT_SUMMARY_TEMPLATE = [
  "## Release Summary",
  "",
  RELEASE_SUMMARY_PLACEHOLDER,
  "",
  "## Breaking changes",
  "",
  BREAKING_CHANGES_PLACEHOLDER,
].join("\n");

export class PromptBuilder {
  build({
    summaryTemplate,
    changelogBody,
    workingDirectory,
    gitEvidence,
    linkEvidence,
  }) {
    const prunedTemplate = this.#pruneSection(
      summaryTemplate.trim(),
      MAX_TEMPLATE_LENGTH,
    );
    let prunedChangelog = this.#pruneSection(
      changelogBody,
      MAX_CHANGELOG_LENGTH,
    );
    let prunedGitEvidence = this.#pruneSection(
      gitEvidence,
      MAX_GIT_EVIDENCE_LENGTH,
    );
    let prunedLinkEvidence = this.#pruneSection(
      linkEvidence,
      MAX_LINK_EVIDENCE_LENGTH,
    );

    const sections = [
      "Summarize the provided release changelog for technical end users.",
      "",
      "Required output template:",
      prunedTemplate,
      "",
      "Template placeholders:",
      `- ${RELEASE_SUMMARY_PLACEHOLDER}: replace with the release summary paragraph(s) only.`,
      `- ${BREAKING_CHANGES_PLACEHOLDER}: replace with the breaking changes paragraph only.`,
      "- Do not rewrite headings or surrounding template text.",
      "",
      "Rules:",
      "- Highlight ordering: features, fixes, internal (chore, build, dev).",
      "- Maximum 5 sentences in `## Release Summary`.",
      "- No bullet points.",
      "- No details.",
      "- Separate public and internal changes with a blank line.",
      "- Never mention uncertain items.",
      "",
      `Working directory focus: ${workingDirectory}`,
      "",
      "Changelog body:",
      prunedChangelog,
    ];

    if (prunedGitEvidence) {
      sections.push("", "Confirmed git evidence:", prunedGitEvidence);
    }

    if (prunedLinkEvidence) {
      sections.push("", "Linked reference evidence:", prunedLinkEvidence);
    }

    sections.push(
      "",
      "Do not describe anything that is not explicit in the changelog body or confirmed evidence above.",
      "Return only the two placeholder values as structured data, not the fully rendered markdown.",
    );

    let prompt = this.#normalizePrompt(sections.join("\n").trim());
    if (prompt.length <= MAX_PROMPT_LENGTH) {
      return prompt;
    }

    prunedLinkEvidence = this.#pruneSection(prunedLinkEvidence, 600);
    prompt = this.#buildPromptWithPrunedSections({
      prunedTemplate,
      prunedChangelog,
      prunedGitEvidence,
      prunedLinkEvidence,
      workingDirectory,
    });
    if (prompt.length <= MAX_PROMPT_LENGTH) {
      return prompt;
    }

    prunedGitEvidence = this.#pruneSection(prunedGitEvidence, 1200);
    prompt = this.#buildPromptWithPrunedSections({
      prunedTemplate,
      prunedChangelog,
      prunedGitEvidence,
      prunedLinkEvidence,
      workingDirectory,
    });
    if (prompt.length <= MAX_PROMPT_LENGTH) {
      return prompt;
    }

    prunedChangelog = this.#pruneSection(prunedChangelog, 3500);
    return this.#buildPromptWithPrunedSections({
      prunedTemplate,
      prunedChangelog,
      prunedGitEvidence,
      prunedLinkEvidence,
      workingDirectory,
    });
  }

  #buildPromptWithPrunedSections({
    prunedTemplate,
    prunedChangelog,
    prunedGitEvidence,
    prunedLinkEvidence,
    workingDirectory,
  }) {
    const sections = [
      "Summarize the provided release changelog for technical end users.",
      "",
      "Required output template:",
      prunedTemplate,
      "",
      "Template placeholders:",
      `- ${RELEASE_SUMMARY_PLACEHOLDER}: replace with the release summary paragraph(s) only.`,
      `- ${BREAKING_CHANGES_PLACEHOLDER}: replace with the breaking changes paragraph only.`,
      "- Do not rewrite headings or surrounding template text.",
      "",
      "Rules:",
      "- Highlight ordering: features, fixes, internal (chore, build, dev).",
      "- Maximum 5 sentences in `## Release Summary`.",
      "- No bullet points.",
      "- No details.",
      "- Separate public and internal changes with a blank line.",
      "- Never mention uncertain items.",
      "",
      `Working directory focus: ${workingDirectory}`,
      "",
      "Changelog body:",
      prunedChangelog,
    ];

    if (prunedGitEvidence) {
      sections.push("", "Confirmed git evidence:", prunedGitEvidence);
    }

    if (prunedLinkEvidence) {
      sections.push("", "Linked reference evidence:", prunedLinkEvidence);
    }

    sections.push(
      "",
      "Do not describe anything that is not explicit in the changelog body or confirmed evidence above.",
      "Return only the two placeholder values as structured data, not the fully rendered markdown.",
    );

    return this.#normalizePrompt(sections.join("\n").trim());
  }

  #pruneSection(content, maxLength) {
    if (!content) {
      return "";
    }

    const normalizedContent = this.#normalizePrompt(content.trim());
    if (normalizedContent.length <= maxLength) {
      return normalizedContent;
    }

    const sliceLength = Math.max(0, maxLength - TRUNCATION_NOTICE.length - 2);
    return `${normalizedContent.slice(0, sliceLength).trimEnd()}\n${TRUNCATION_NOTICE}`;
  }

  #normalizePrompt(content) {
    return content.replace(/\n{3,}/g, "\n\n").trim();
  }
}
