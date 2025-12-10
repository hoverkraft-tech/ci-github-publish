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
  const { theme, pagePatterns, assetPatterns, sitePathInput, buildPathInput } =
    normalizeInputs(inputs);
  const { sitePath, buildPath } = resolveSitePaths(workspacePath, {
    sitePathInput,
    buildPathInput,
  });
  const assetManager = new AssetManager({ workspacePath, sitePath });

  core.setOutput("jekyll-source", relative(workspacePath, sitePath));
  core.setOutput("jekyll-destination", relative(workspacePath, buildPath));

  await io.mkdirP(sitePath);
  ensureConfigFile({ sitePath, theme });

  if (assetPatterns.length > 0) {
    const assetsGlobber = await glob.create(assetPatterns.join("\n"));
    for await (const assetFile of assetsGlobber.globGenerator()) {
      const assetPath = resolve(workspacePath, assetFile);
      await assetManager.copyAssetFromWorkspace(assetPath);
    }
  }

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

  const assetsInput = (rawInputs.assets || "").trim();
  const assetPatterns = assetsInput
    ? assetsInput.split(/\s+/).filter(Boolean)
    : [];

  const sitePathInput = requireNonEmptyInput(
    rawInputs["site-path"],
    "site-path",
  );
  const buildPathInput = requireNonEmptyInput(
    rawInputs["build-path"],
    "build-path",
  );

  return {
    theme,
    pagePatterns,
    assetPatterns,
    sitePathInput,
    buildPathInput,
  };
}

function resolveSitePaths(workspacePath, { sitePathInput, buildPathInput }) {
  const sitePath = resolveWithinWorkspace(workspacePath, sitePathInput);
  const buildPath = resolveWithinWorkspace(workspacePath, buildPathInput);

  return { sitePath, buildPath };
}

function requireNonEmptyInput(value, inputName) {
  if (typeof value !== "string") {
    throw new Error(`${inputName} input is required.`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${inputName} input cannot be empty.`);
  }

  return trimmed;
}

function resolveWithinWorkspace(workspacePath, targetPath) {
  const resolvedPath = resolve(workspacePath, targetPath);
  const pathFromWorkspace = relative(workspacePath, resolvedPath);

  if (pathFromWorkspace.startsWith("..")) {
    throw new Error(
      `Path must stay within workspace. Provided value resolves to: ${resolvedPath}`,
    );
  }

  return resolvedPath;
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
