const { join, relative, dirname, resolve } = require("path");
const { existsSync, readFileSync } = require("fs");

const {
  INDEX_BASENAME,
  createSitePage,
  rewritePageLinks,
} = require("./page-files");
const { AssetManager, toPosixPath } = require("./asset-manager");
const { SiteFileManager } = require("./site-file-manager");
const { WorkspacePathResolver } = require("./workspace-path-resolver");
const DEFAULT_THEME = "jekyll-theme-cayman";
module.exports = async function prepareSite({ core, inputs, io, glob }) {
  const workspacePath = resolveWorkspace();
  const workspacePathResolver = new WorkspacePathResolver({ workspacePath });
  const { theme, pagePatterns, assetPatterns, sitePathInput, buildPathInput } =
    normalizeInputs(inputs);
  const { sitePath, buildPath } = resolveSitePaths(workspacePathResolver, {
    sitePathInput,
    buildPathInput,
  });
  const assetManager = new AssetManager({ workspacePath, sitePath });
  const siteFileManager = new SiteFileManager();

  core.debug(
    `Configuration: ${JSON.stringify({
      theme,
      pagePatterns,
      assetPatterns,
      sitePath: toPosixPath(relative(workspacePath, sitePath)),
      buildPath: toPosixPath(relative(workspacePath, buildPath)),
    })}`,
  );

  core.setOutput("jekyll-source", relative(workspacePath, sitePath));
  core.setOutput("jekyll-destination", relative(workspacePath, buildPath));

  await io.mkdirP(sitePath);
  ensureConfigFile({ core, sitePath, theme });

  if (assetPatterns.length > 0) {
    const assetsGlobber = await glob.create(assetPatterns.join("\n"));
    const copiedAssets = [];
    for await (const assetFile of assetsGlobber.globGenerator()) {
      const assetPathInfo =
        workspacePathResolver.resolveExistingWithinWorkspace(assetFile);
      const publicPath = await assetManager.copyAssetFromWorkspace(
        assetPathInfo.path,
      );
      if (publicPath) {
        copiedAssets.push({
          source: toPosixPath(assetPathInfo.relativePath),
          target: publicPath,
        });
      }
    }

    core.debug(
      `Copied ${copiedAssets.length} additional assets: ${JSON.stringify(copiedAssets)}`,
    );
  }

  const indexPath = join(sitePath, INDEX_BASENAME);
  if (!existsSync(indexPath)) {
    await createSitePage({
      assetManager,
      io,
      pageFilePath:
        workspacePathResolver.resolveExistingWithinWorkspace("README.md").path,
      pageTitle: "Home",
      pagePath: indexPath,
      sitePath,
      workspacePath,
    });

    core.debug(
      `Created site index from README.md at ${toPosixPath(relative(workspacePath, indexPath))}`,
    );
  } else {
    core.debug(
      `Using existing site index at ${toPosixPath(relative(workspacePath, indexPath))}`,
    );
  }

  if (pagePatterns.length === 0) {
    core.debug("No additional page patterns configured.");
    return;
  }

  const globber = await glob.create(pagePatterns.join("\n"));
  const indexContent = readFileSync(indexPath, "utf8");
  const pageMappings = new Map();
  const createdPagePaths = [];

  for await (const pageFile of globber.globGenerator()) {
    const pagePathInfo =
      workspacePathResolver.resolveExistingWithinWorkspace(pageFile);
    const createdPagePath = await createSitePage({
      assetManager,
      io,
      pageFilePath: pagePathInfo.path,
      sitePath,
      workspacePath,
    });

    addPageMapping(
      pageMappings,
      toPosixPath(pagePathInfo.relativePath),
      dirname(createdPagePath),
    );

    createdPagePaths.push(createdPagePath);
  }

  core.debug(
    `Prepared ${createdPagePaths.length} additional pages from patterns ${JSON.stringify(pagePatterns)}: ${JSON.stringify(
      createdPagePaths.map((pagePath) =>
        toPosixPath(relative(workspacePath, pagePath)),
      ),
    )}`,
  );

  if (pageMappings.size === 0) {
    core.debug("No additional pages matched the configured patterns.");
    return;
  }

  const rewrittenIndexContent = rewritePageLinks({
    content: indexContent,
    pagePath: indexPath,
    pageMappings,
  });

  if (rewrittenIndexContent !== indexContent) {
    siteFileManager.writeFile(indexPath, rewrittenIndexContent);
  }

  for (const pagePath of createdPagePaths) {
    const pageContent = readFileSync(pagePath, "utf8");
    const rewrittenContent = rewritePageLinks({
      content: pageContent,
      pagePath,
      pageMappings,
    });

    if (rewrittenContent !== pageContent) {
      siteFileManager.writeFile(pagePath, rewrittenContent);
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

function resolveSitePaths(
  workspacePathResolver,
  { sitePathInput, buildPathInput },
) {
  const sitePath = workspacePathResolver.resolveWithinWorkspace(sitePathInput);
  const buildPath =
    workspacePathResolver.resolveWithinWorkspace(buildPathInput);

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

function addPageMapping(pageMappings, pageFileRelative, targetDir) {
  if (!pageFileRelative || pageMappings.has(pageFileRelative)) {
    return;
  }

  pageMappings.set(pageFileRelative, targetDir);
}

function ensureConfigFile({ core, sitePath, theme }) {
  const siteFileManager = new SiteFileManager();
  const configPath = join(sitePath, "_config.yml");
  if (existsSync(configPath)) {
    core.debug(
      `Using existing Jekyll config at ${toPosixPath(relative(resolveWorkspace(), configPath))}`,
    );
    return;
  }

  if (!theme) {
    throw new Error("Theme input is required.");
  }

  const isGitHubSupportedTheme = theme.startsWith("jekyll-theme-");
  const configContent = isGitHubSupportedTheme
    ? `theme: ${theme}`
    : `remote_theme: ${theme}\nplugins:\n  - jekyll-remote-theme`;

  siteFileManager.writeFile(configPath, configContent);

  core.debug(
    `Created Jekyll config at ${toPosixPath(relative(resolveWorkspace(), configPath))} with theme ${theme}`,
  );
}
