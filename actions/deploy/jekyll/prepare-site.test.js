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

const prepareSite = require("./prepare-site");

function withTempDir(run) {
  const tempDir = mkdtempSync(join(tmpdir(), "jekyll-prepare-site-"));

  return Promise.resolve()
    .then(() => run(tempDir))
    .finally(() => {
      rmSync(tempDir, { recursive: true, force: true });
    });
}

function createCoreStub() {
  const calls = {
    debug: [],
    outputs: {},
  };

  return {
    calls,
    debug(message) {
      calls.debug.push(message);
    },
    setOutput(name, value) {
      calls.outputs[name] = value;
    },
  };
}

function createIoStub() {
  return {
    async mkdirP(targetPath) {
      mkdirSync(targetPath, { recursive: true });
    },
  };
}

function createGlobStub() {
  return {
    async create(patterns) {
      const entries = patterns
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean);

      return {
        async *globGenerator() {
          for (const entry of entries) {
            yield entry;
          }
        },
      };
    },
  };
}

describe("prepare-site.js", () => {
  describe("prepareSite", () => {
    it("creates the site, rewrites links, copies assets, and sets outputs", async () => {
      await withTempDir(async (tempDir) => {
        const workspacePath = join(tempDir, "workspace");
        const docsPath = join(workspacePath, "docs", "tests");
        const imagesPath = join(workspacePath, "images");
        const previousWorkspace = process.env.GITHUB_WORKSPACE;

        mkdirSync(docsPath, { recursive: true });
        mkdirSync(imagesPath, { recursive: true });
        writeFileSync(
          join(workspacePath, "README.md"),
          ["# Home", "", "- [Source](docs/tests/source.md)"].join("\n"),
        );
        writeFileSync(
          join(docsPath, "source.md"),
          [
            "# Source",
            "",
            "Link to [Target](docs/tests/target.md).",
            "",
            "![Logo](../../images/logo.svg)",
          ].join("\n"),
        );
        writeFileSync(join(docsPath, "target.md"), "# Target\n");
        writeFileSync(join(imagesPath, "logo.svg"), "<svg></svg>");

        process.env.GITHUB_WORKSPACE = workspacePath;

        const core = createCoreStub();

        try {
          await prepareSite({
            core,
            io: createIoStub(),
            glob: createGlobStub(),
            inputs: {
              theme: "acme/theme",
              pages: "docs/tests/source.md\ndocs/tests/target.md",
              assets: "images/logo.svg",
              "site-path": "custom-site",
              "build-path": "public-build",
            },
          });
        } finally {
          if (previousWorkspace === undefined) {
            delete process.env.GITHUB_WORKSPACE;
          } else {
            process.env.GITHUB_WORKSPACE = previousWorkspace;
          }
        }

        const sitePath = join(workspacePath, "custom-site");
        const configContent = readFileSync(
          join(sitePath, "_config.yml"),
          "utf8",
        );
        const indexContent = readFileSync(join(sitePath, "index.md"), "utf8");
        const sourceContent = readFileSync(
          join(sitePath, "docs", "tests", "source", "index.md"),
          "utf8",
        );

        assert.equal(core.calls.outputs["jekyll-source"], "custom-site");
        assert.equal(core.calls.outputs["jekyll-destination"], "public-build");
        assert.match(configContent, /remote_theme: acme\/theme/);
        assert.match(configContent, /jekyll-remote-theme/);
        assert.match(indexContent, /\]\(docs\/tests\/source\)/);
        assert.match(sourceContent, /\]\(\.\.\/target\)/);
        assert.equal(
          existsSync(join(sitePath, "assets", "images", "logo.svg")),
          true,
        );
        assert.equal(
          core.calls.debug.some((message) =>
            message.includes("Configuration:"),
          ),
          true,
        );
        assert.equal(
          core.calls.debug.some((message) =>
            message.includes("Copied 1 additional assets"),
          ),
          true,
        );
        assert.equal(
          core.calls.debug.some((message) =>
            message.includes("Prepared 2 additional pages"),
          ),
          true,
        );
      });
    });
  });
});
