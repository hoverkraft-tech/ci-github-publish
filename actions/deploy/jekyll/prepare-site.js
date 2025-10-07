const { join, relative, dirname, resolve } = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");

const {
  INDEX_BASENAME,
  createSitePage,
  rewritePageLinks,
} = require("./page-files");
const { AssetManager, toPosixPath } = require("./asset-manager");
const DEFAULT_THEME = "jekyll-theme-cayman";
module.exports = async function prepareSite({ core, inputs, io, glob }) {
  const workspacePath = resolveWorkspace();
  const { theme, pagePatterns } = normalizeInputs(inputs);
  const { sitePath, buildPath } = resolveSitePaths(workspacePath);
  const assetManager = new AssetManager({ workspacePath, sitePath });

  core.setOutput("build-path", buildPath);
  core.setOutput("jekyll-source", relative(workspacePath, sitePath));
  core.setOutput("jekyll-destination", relative(workspacePath, buildPath));

  await io.mkdirP(sitePath);
  ensureConfigFile({ sitePath, theme });

  const indexPath = join(sitePath, INDEX_BASENAME);
  if (!existsSync(indexPath)) {
    await createSitePage({
      assetManager,
      io,
      pageFilePath: resolve(workspacePath, "README.md"),
      pageTitle: "Home",
      pagePath: indexPath,
      workspacePath,
    });
  }

  if (pagePatterns.length === 0) {
    return;
  }

  const globber = await glob.create(pagePatterns.join("\n"));
  const indexContent = readFileSync(indexPath, "utf8");
  const pageMappings = new Map();
  const createdPagePaths = [];

  for await (const pageFile of globber.globGenerator()) {
    const pageFilePath = resolve(workspacePath, pageFile);
    const createdPagePath = await createSitePage({
      assetManager,
      io,
      pageFilePath,
      workspacePath,
    });

    const pageFileRelative = toPosixPath(relative(workspacePath, pageFilePath));
    if (!pageMappings.has(pageFileRelative)) {
      pageMappings.set(pageFileRelative, dirname(createdPagePath));
    }

    createdPagePaths.push(createdPagePath);
  }

  if (pageMappings.size === 0) {
    return;
  }

  const rewrittenIndexContent = rewritePageLinks({
    content: indexContent,
    pagePath: indexPath,
    pageMappings,
  });

  if (rewrittenIndexContent !== indexContent) {
    writeFileSync(indexPath, rewrittenIndexContent);
  }

  for (const pagePath of createdPagePaths) {
    const pageContent = readFileSync(pagePath, "utf8");
    const rewrittenContent = rewritePageLinks({
      content: pageContent,
      pagePath,
      pageMappings,
    });

    if (rewrittenContent !== pageContent) {
      writeFileSync(pagePath, rewrittenContent);
    }
  }
};

function resolveWorkspace() {
  const workspacePath = process.env.GITHUB_WORKSPACE;
  if (!workspacePath) {
    throw new Error("GITHUB_WORKSPACE environment variable is not defined.");
  }

  return resolve(workspacePath);
}

function normalizeInputs(rawInputs = {}) {
  const theme = (rawInputs.theme || DEFAULT_THEME).trim();
  const pagesInput = (rawInputs.pages || "").trim();
  const pagePatterns = pagesInput
    ? pagesInput.split(/\s+/).filter(Boolean)
    : [];

  return { theme, pagePatterns };
}

function resolveSitePaths(workspacePath) {
  const sitePath = join(workspacePath, "_site");
  const buildPath = join(sitePath, "build");
  return { sitePath, buildPath };
}

function ensureConfigFile({ sitePath, theme }) {
  const configPath = join(sitePath, "_config.yml");
  if (existsSync(configPath)) {
    return;
  }

  if (!theme) {
    throw new Error("Theme input is required.");
  }

  const isGitHubSupportedTheme = theme.startsWith("jekyll-theme-");
  const configContent = isGitHubSupportedTheme
    ? `theme: ${theme}`
    : `remote_theme: ${theme}\nplugins:\n  - jekyll-remote-theme`;

  writeFileSync(configPath, configContent);
}
