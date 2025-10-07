const { join, relative, basename, extname, dirname, resolve } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const { toPosixPath } = require("./asset-manager");

const INDEX_BASENAME = "index.md";

async function createSitePage({
  io,
  assetManager,
  pageFilePath,
  pageTitle,
  pagePath,
  workspacePath,
}) {
  const absolutePageFilePath = resolve(pageFilePath);
  const targetPagePath =
    pagePath ||
    getPageSection({ pageFilePath: absolutePageFilePath, workspacePath });
  const effectiveTitle =
    pageTitle ||
    getPageTitle({ pageFilePath: absolutePageFilePath, workspacePath });

  await io.mkdirP(dirname(targetPagePath));

  const rawContent = readFileSync(absolutePageFilePath, "utf8");
  const contentWithFrontMatter = `---\nlayout: default\ntitle: ${effectiveTitle}\n---\n\n${rawContent}`;

  const processedContent = assetManager.rewriteContent({
    pageFilePath: absolutePageFilePath,
    pagePath: targetPagePath,
    content: contentWithFrontMatter,
  });

  writeFileSync(targetPagePath, processedContent);
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

function getPageSection({ pageFilePath, workspacePath }) {
  const sectionParentDir = toSafeSegment(
    relative(workspacePath, dirname(pageFilePath)),
  );
  const sectionName = basename(
    pageFilePath,
    extname(pageFilePath),
  ).toLowerCase();
  const sectionDir = sectionName !== "readme" ? toSafeSegment(sectionName) : "";

  const segments = [sectionParentDir, sectionDir, INDEX_BASENAME].filter(
    Boolean,
  );
  return join(workspacePath, "_site", ...segments);
}

function getPageTitle({ pageFilePath, workspacePath }) {
  const sectionPath = getPageSection({ pageFilePath, workspacePath });
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

module.exports = {
  INDEX_BASENAME,
  createSitePage,
  rewritePageLinks,
  toPosixPath,
};
