const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

const { AssetManager } = require("./asset-manager");
const { createSitePage, rewritePageLinks } = require("./page-files");

function withTempDir(run) {
  const tempDir = mkdtempSync(join(tmpdir(), "jekyll-page-files-"));

  return Promise.resolve()
    .then(() => run(tempDir))
    .finally(() => {
      rmSync(tempDir, { recursive: true, force: true });
    });
}

function createIoStub() {
  return {
    async mkdirP(targetPath) {
      mkdirSync(targetPath, { recursive: true });
    },
  };
}

describe("page-files.js", () => {
  describe("createSitePage", () => {
    it("writes front matter, escapes Liquid tags, and copies local assets", async () => {
      await withTempDir(async (tempDir) => {
        const workspacePath = join(tempDir, "workspace");
        const sitePath = join(workspacePath, "_site");
        const docsPath = join(workspacePath, "docs");
        const pageFilePath = join(docsPath, "guide.md");

        mkdirSync(join(docsPath, "images"), { recursive: true });
        mkdirSync(sitePath, { recursive: true });
        writeFileSync(
          pageFilePath,
          [
            "# Guide",
            "",
            "{% include note.html %}",
            "",
            "![Diagram](images/diagram.png)",
          ].join("\n"),
        );
        writeFileSync(join(docsPath, "images", "diagram.png"), "png");

        const assetManager = new AssetManager({ workspacePath, sitePath });

        const createdPagePath = await createSitePage({
          io: createIoStub(),
          assetManager,
          pageFilePath,
          workspacePath,
        });

        const createdContent = readFileSync(createdPagePath, "utf8");

        assert.equal(
          createdPagePath,
          join(workspacePath, "_site", "docs", "guide", "index.md"),
        );
        assert.match(
          createdContent,
          /^---\nlayout: default\ntitle: Guide\n---/,
        );
        assert.match(
          createdContent,
          /\{% raw %}\{% include note\.html %}\{% endraw %}/,
        );
        assert.match(
          createdContent,
          /\{\{site\.baseurl}}\/assets\/docs\/images\/diagram\.png/,
        );
        assert.equal(
          existsSync(join(sitePath, "assets", "docs", "images", "diagram.png")),
          true,
        );
      });
    });
  });

  describe("rewritePageLinks", () => {
    it("rewrites generated page links relative to the current page", () => {
      const rewritten = rewritePageLinks({
        content: "See [Target](docs/tests/target.md) for details.",
        pagePath: "/workspace/_site/docs/tests/source/index.md",
        pageMappings: new Map([
          ["docs/tests/target.md", "/workspace/_site/docs/tests/target"],
        ]),
      });

      assert.equal(rewritten, "See [Target](../target) for details.");
    });
  });
});
