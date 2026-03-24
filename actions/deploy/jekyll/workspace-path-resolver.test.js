const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

const { WorkspacePathResolver } = require("./workspace-path-resolver");

function withTempDir(run) {
  const tempDir = mkdtempSync(join(tmpdir(), "jekyll-workspace-path-"));

  return Promise.resolve()
    .then(() => run(tempDir))
    .finally(() => {
      rmSync(tempDir, { recursive: true, force: true });
    });
}

describe("workspace-path-resolver.js", () => {
  describe("WorkspacePathResolver.resolveExistingWithinWorkspace", () => {
    it("resolves an existing path inside the workspace", async () => {
      await withTempDir(async (tempDir) => {
        const workspacePath = join(tempDir, "workspace");
        const filePath = join(workspacePath, "content", "guide.md");

        mkdirSync(join(workspacePath, "content"), { recursive: true });
        writeFileSync(filePath, "# Guide\n");

        const resolver = new WorkspacePathResolver({ workspacePath });

        const pathInfo = resolver.resolveExistingWithinWorkspace(filePath);

        assert.equal(pathInfo.path, filePath);
        assert.equal(pathInfo.relativePath, "content/guide.md");
      });
    });

    it("rejects paths outside the workspace", async () => {
      await withTempDir(async (tempDir) => {
        const workspacePath = join(tempDir, "workspace");
        const externalPath = join(tempDir, "external", "guide.md");

        mkdirSync(join(tempDir, "external"), { recursive: true });
        mkdirSync(workspacePath, { recursive: true });
        writeFileSync(externalPath, "# Guide\n");

        const resolver = new WorkspacePathResolver({ workspacePath });

        assert.throws(
          () => resolver.resolveExistingWithinWorkspace(externalPath),
          /Path must stay within workspace/,
        );
      });
    });
  });
});
