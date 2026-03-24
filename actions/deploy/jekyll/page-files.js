const { join, relative, basename, extname, dirname, resolve } = require("path");
const { readFileSync } = require("fs");
const { toPosixPath } = require("./asset-manager");
const { SiteFileManager } = require("./site-file-manager");

const INDEX_BASENAME = "index.md";
const LIQUID_TAG_PATTERN = /(\{%[^%]+%\})/g;
const MARKDOWN_EXTENSIONS = new Set([".md", ".markdown", ".mdown", ".mkd"]);
const siteFileManager = new SiteFileManager();

async function createSitePage({
  io,
  assetManager,
  pageFilePath,
  pageTitle,
  pagePath,
  sitePath,
  workspacePath,
}) {
  const resolvedPageFilePath = resolve(pageFilePath);
  const targetPagePath =
    pagePath ||
    getPageSection({
      pageFilePath: resolvedPageFilePath,
      sitePath,
      workspacePath,
    });
  const effectiveTitle =
    pageTitle ||
    getPageTitle({
      pageFilePath: resolvedPageFilePath,
      sitePath,
      workspacePath,
    });

  await io.mkdirP(dirname(targetPagePath));

  const rawContent = readFileSync(resolvedPageFilePath, "utf8");
  const safeContent = isMarkdownPage(resolvedPageFilePath)
    ? escapeLiquidTags(rawContent)
    : rawContent;
  const contentWithFrontMatter = `---\nlayout: default\ntitle: ${effectiveTitle}\n---\n\n${safeContent}`;

  const processedContent = assetManager.rewriteContent({
    pageFilePath: resolvedPageFilePath,
    pagePath: targetPagePath,
    content: contentWithFrontMatter,
  });

  siteFileManager.writeFile(targetPagePath, processedContent);
  return targetPagePath;
}

function rewritePageLinks({ content, pagePath, pageMappings }) {
  if (!content || pageMappings.size === 0) {
    return content;
  }

  let updatedContent = content;
  const currentDir = dirname(pagePath);

  for (const [pageFileRelative, targetDir] of pageMappings.entries()) {
    if (!pageFileRelative) {
      continue;
    }

    const relativeTarget = relative(currentDir, targetDir);
    if (!relativeTarget) {
      continue;
    }

    const replacement = formatLinkReplacement(relativeTarget);
    updatedContent = updatedContent.split(pageFileRelative).join(replacement);
  }

  return updatedContent;
}

function getPageSection({ pageFilePath, sitePath, workspacePath }) {
  const sectionParentDir = toSafeSegment(
    relative(workspacePath, dirname(pageFilePath)),
  );
  const sectionName = basename(
    pageFilePath,
    extname(pageFilePath),
  ).toLowerCase();
  const sectionDir = sectionName !== "readme" ? toSafeSegment(sectionName) : "";
  const indexBasename = getIndexBasename(pageFilePath);

  const segments = [sectionParentDir, sectionDir, indexBasename].filter(
    Boolean,
  );
  return join(sitePath || join(workspacePath, "_site"), ...segments);
}

function getIndexBasename(pageFilePath) {
  const ext = extname(pageFilePath).toLowerCase();
  if (ext === ".html" || ext === ".htm") {
    return "index.html";
  }

  return INDEX_BASENAME;
}

function getPageTitle({ pageFilePath, sitePath, workspacePath }) {
  const sectionPath = getPageSection({ pageFilePath, sitePath, workspacePath });
  const sectionDir = dirname(sectionPath);
  const sectionName = basename(sectionDir);

  return sectionName
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toSafeSegment(value) {
  return value
    .toLowerCase()
    .split(/[\\/]+/)
    .map((segment) => segment.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    .filter(Boolean)
    .join("/");
}

function formatLinkReplacement(relativePath) {
  const normalized = toPosixPath(relativePath);
  return normalized || ".";
}

function isMarkdownPage(pageFilePath) {
  return MARKDOWN_EXTENSIONS.has(extname(pageFilePath).toLowerCase());
}

function escapeLiquidTags(content) {
  if (!content) {
    return content;
  }

  return content.replace(LIQUID_TAG_PATTERN, (_match, tag) => {
    return `{% raw %}${tag}{% endraw %}`;
  });
}

module.exports = {
  INDEX_BASENAME,
  createSitePage,
  rewritePageLinks,
  toPosixPath,
};
