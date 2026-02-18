import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ReleaseSummaryCore } from "./ReleaseSummaryCore.js";
import { PromptBuilder } from "./PromptBuilder.js";

function createFileSystemServiceStub(relativeWorkingDirectory = ".") {
  return {
    getRelativeWorkingDirectory() {
      return relativeWorkingDirectory;
    },
  };
}

function createLoggerStub() {
  return {
    info() {},
    warning() {},
  };
}

describe("ReleaseSummaryCore", () => {
  it("builds the prompt from evidence services and returns the generated summary", async () => {
    const prompts = [];
    const core = new ReleaseSummaryCore(
      createFileSystemServiceStub("actions/release"),
      createLoggerStub(),
      {
        async collect(changelogBody, fileSystemService) {
          assert.match(changelogBody, /feat\(api\)/);
          assert.equal(
            fileSystemService.getRelativeWorkingDirectory(),
            "actions/release",
          );
          return "Commit 1234567:\nfix(ui): correct status badge";
        },
      },
      {
        async collect(changelogBody) {
          assert.match(changelogBody, /BREAKING:/);
          return "https://example.com/breaking\nBreaking change details";
        },
      },
      new PromptBuilder(),
      {
        async generate(inputs, prompt) {
          prompts.push(prompt);
          assert.equal(inputs.llmProvider, "openai");
          assert.equal(inputs.llmModel, "gpt-5.4");
          return {
            releaseSummary: [
              "Project filter support was added for public API consumers.",
              "",
              "Internal workflow maintenance was updated.",
            ].join("\n"),
            breakingChanges: "The deployment output name changed.",
          };
        },
      },
    );

    const result = await core.summarize({
      changelogBody:
        "feat(api): add project filters (#42)\nBREAKING: renamed deployment output https://example.com/breaking",
      llmModel: "gpt-5.4",
      llmProvider: "openai",
      llmAuth: "token",
      llmConfig: JSON.stringify({
        baseUrl: "https://api.openai.com/v1",
      }),
    });

    assert.match(result.summary, /^## Release Summary/m);
    assert.match(result.summary, /^## Breaking changes/m);
    assert.equal(prompts.length, 1);
    assert.match(prompts[0], /Confirmed git evidence:/);
    assert.match(prompts[0], /Linked reference evidence:/);
    assert.match(prompts[0], /Maximum 5 sentences/);
    assert.match(prompts[0], /\{\{release_summary\}\}/);
    assert.match(prompts[0], /\{\{breaking_changes\}\}/);
  });

  it("rejects templates that remove the breaking changes placeholder", async () => {
    const core = new ReleaseSummaryCore(
      createFileSystemServiceStub(),
      createLoggerStub(),
      {
        async collect() {
          return "";
        },
      },
      {
        async collect() {
          return "";
        },
      },
      new PromptBuilder(),
      {
        async generate() {
          return "";
        },
      },
    );

    await assert.rejects(
      () =>
        core.summarize({
          changelogBody: "feat: add search",
          llmModel: "gpt-5.4",
          llmProvider: "openai",
          llmAuth: "token",
          summaryTemplate:
            "## Release Summary\n\n{{release_summary}}\n\n## Breaking changes",
        }),
      /The summary-template input must include exactly one `\{\{breaking_changes\}\}` placeholder\./,
    );
  });

  it("rejects llm-config values that are not JSON objects", async () => {
    const core = new ReleaseSummaryCore(
      createFileSystemServiceStub(),
      createLoggerStub(),
      {
        async collect() {
          return "";
        },
      },
      {
        async collect() {
          return "";
        },
      },
      new PromptBuilder(),
      {
        async generate() {
          return "";
        },
      },
    );

    await assert.rejects(
      () =>
        core.summarize({
          changelogBody: "feat: add search",
          llmModel: "gpt-5.4",
          llmProvider: "openai",
          llmAuth: "token",
          llmConfig: "[]",
        }),
      /The llm-config input must be a JSON object\./,
    );
  });

  it("prunes oversized prompt sections to stay within a prompt budget", async () => {
    const prompts = [];
    const repeatedLine =
      "feat(api): introduce a large amount of changelog context for token pruning checks (#42)";
    const largeChangelogBody = Array.from(
      { length: 400 },
      () => repeatedLine,
    ).join("\n");
    const largeGitEvidence = Array.from(
      { length: 200 },
      (_, index) =>
        `Commit ${index}: details about changed files and implementation context`,
    ).join("\n");
    const largeLinkEvidence = Array.from(
      { length: 100 },
      (_, index) =>
        `https://example.com/${index} linked breaking-change context and release notes`,
    ).join("\n");

    const core = new ReleaseSummaryCore(
      createFileSystemServiceStub("actions/release"),
      createLoggerStub(),
      {
        async collect() {
          return largeGitEvidence;
        },
      },
      {
        async collect() {
          return largeLinkEvidence;
        },
      },
      new PromptBuilder(),
      {
        async generate(_inputs, prompt) {
          prompts.push(prompt);
          return {
            releaseSummary: "Public API support was added.",
            breakingChanges: "There is no breaking change.",
          };
        },
      },
    );

    await core.summarize({
      changelogBody: largeChangelogBody,
      llmModel: "gpt-5.4",
      llmProvider: "openai",
      llmAuth: "token",
      llmConfig: "{}",
    });

    assert.equal(prompts.length, 1);
    assert.ok(prompts[0].length <= 12000);
    assert.match(prompts[0], /\[truncated for prompt budget\]/);
  });
});
