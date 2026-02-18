import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { run } from "./index.js";

describe("index.run", () => {
  it("sets outputs from the release summary core flow", async () => {
    const outputs = {};
    await run({
      core: {
        info() {},
        warning() {},
        setOutput(name, value) {
          outputs[name] = value;
        },
        setFailed(message) {
          throw new Error(message);
        },
      },
      github: {},
      context: {
        repo: { owner: "hoverkraft-tech", repo: "ci-github-publish" },
      },
      inputs: {
        changelogBody:
          "feat(api): add project filters (#42)\nBREAKING: renamed deployment output https://example.com/breaking",
        workingDirectory: ".",
        llmModel: "gpt-5.4",
        llmProvider: "openai",
        llmAuth: "token",
        llmConfig: "{}",
      },
      services: {
        releaseSummaryCore: {
          async summarize() {
            return {
              llmPrompt:
                "Changelog body:\nfeat(api): add project filters (#42)",
              summary: [
                "## Release Summary",
                "",
                "Project filter support was added for public API consumers.",
                "",
                "## Breaking changes",
                "",
                "There is no breaking change.",
              ].join("\n"),
            };
          },
        },
      },
    });

    assert.match(outputs["llm-prompt"], /Changelog body:/);
    assert.match(outputs["summary"], /^## Release Summary/m);
    assert.match(outputs["summary"], /^## Breaking changes/m);
  });
});
