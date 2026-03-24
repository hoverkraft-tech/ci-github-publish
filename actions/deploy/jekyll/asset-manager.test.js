const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  rmSync,
} = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

const { AssetManager } = require("./asset-manager");

function withTempDir(run) {
  const tempDir = mkdtempSync(join(tmpdir(), "jekyll-asset-manager-"));

  return Promise.resolve()
    .then(() => run(tempDir))
    .finally(() => {
      rmSync(tempDir, { recursive: true, force: true });
    });
}

describe("asset-manager.js", () => {
  describe("AssetManager.copyAssetFromWorkspace", () => {
    it("copies a local asset once and returns its public path", async () => {
      await withTempDir(async (tempDir) => {
        const workspacePath = join(tempDir, "workspace");
        const sitePath = join(workspacePath, "_site");
        const assetPath = join(workspacePath, "images", "logo.svg");

        mkdirSync(join(workspacePath, "images"), { recursive: true });
        mkdirSync(sitePath, { recursive: true });
        writeFileSync(assetPath, "<svg></svg>");

        const assetManager = new AssetManager({ workspacePath, sitePath });

        const firstPublicPath = assetManager.copyAssetFromWorkspace(assetPath);
        const secondPublicPath = assetManager.copyAssetFromWorkspace(assetPath);

        assert.equal(
          firstPublicPath,
          "{{site.baseurl}}/assets/images/logo.svg",
        );
        assert.equal(secondPublicPath, firstPublicPath);
        assert.equal(
          existsSync(join(sitePath, "assets", "images", "logo.svg")),
          true,
        );
      });
    });
  });

  describe("AssetManager.rewriteContent", () => {
    it("rewrites local markdown, html, and srcset asset references", async () => {
      await withTempDir(async (tempDir) => {
        const workspacePath = join(tempDir, "workspace");
        const sitePath = join(workspacePath, "_site");
        const docsPath = join(workspacePath, "docs");
        const pageFilePath = join(docsPath, "guide.md");
        const pagePath = join(sitePath, "docs", "guide", "index.md");

        mkdirSync(join(docsPath, "images"), { recursive: true });
        mkdirSync(join(docsPath, "media"), { recursive: true });
        mkdirSync(join(docsPath, "video"), { recursive: true });
        mkdirSync(sitePath, { recursive: true });
        writeFileSync(pageFilePath, "# Guide\n");
        writeFileSync(join(docsPath, "images", "diagram.png"), "png");
        writeFileSync(join(docsPath, "media", "photo.jpg"), "jpg");
        writeFileSync(join(docsPath, "video", "sample.mp4"), "mp4");

        const assetManager = new AssetManager({ workspacePath, sitePath });
        const content = [
          "![Diagram](images/diagram.png)",
          '<img src="media/photo.jpg" alt="Photo">',
          '<source srcset="video/sample.mp4 1x, https://example.com/remote.mp4 2x">',
          "![Remote](https://example.com/logo.png)",
        ].join("\n");

        const rewritten = assetManager.rewriteContent({
          pageFilePath,
          pagePath,
          content,
        });

        assert.match(
          rewritten,
          /\{\{site\.baseurl}}\/assets\/docs\/images\/diagram\.png/,
        );
        assert.match(
          rewritten,
          /\{\{site\.baseurl}}\/assets\/docs\/media\/photo\.jpg/,
        );
        assert.match(
          rewritten,
          /\{\{site\.baseurl}}\/assets\/docs\/video\/sample\.mp4 1x/,
        );
        assert.match(rewritten, /https:\/\/example\.com\/remote\.mp4 2x/);
        assert.match(rewritten, /https:\/\/example\.com\/logo\.png/);
      });
    });
  });
});
