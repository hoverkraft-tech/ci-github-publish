const { randomUUID } = require("crypto");
const { join, basename, dirname, resolve, sep } = require("path");
const { statSync, mkdirSync } = require("fs");
const { WorkspacePathResolver } = require("./workspace-path-resolver");
const { SiteFileManager } = require("./site-file-manager");

const ASSETS_ROOT = "assets";
const ASSETS_PUBLIC_PREFIX = `{{site.baseurl}}/${ASSETS_ROOT}`;
const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*]\(\s*<?([^\s)>"']+)[^)]*\)/g;
const HTML_IMAGE_REGEX = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
const HTML_SOURCE_REGEX = /<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi;

class AssetManager {
  constructor({ workspacePath, sitePath }) {
    this.workspacePath = workspacePath;
    this.sitePath = sitePath;
    this.cache = new Map();
    this.workspacePathResolver = new WorkspacePathResolver({ workspacePath });
    this.siteFileManager = new SiteFileManager();
  }

  copyAssetFromWorkspace(assetAbsolutePath) {
    if (!assetAbsolutePath) {
      return null;
    }

    const assetPathInfo = this.#resolveAssetPathInfo(assetAbsolutePath);
    if (!assetPathInfo) {
      return null;
    }

    const stats = statSync(assetPathInfo.path);
    if (!stats.isFile()) {
      return null;
    }

    let record = this.cache.get(assetPathInfo.path);
    if (!record) {
      const sanitizedTarget = this.#sanitizeAssetTarget(
        assetPathInfo.relativePath,
        assetPathInfo.path,
      );
      const destination = join(this.sitePath, ASSETS_ROOT, sanitizedTarget);
      mkdirSync(dirname(destination), { recursive: true });
      this.siteFileManager.copyFile(assetPathInfo.path, destination);

      const normalizedTarget = toPosixPath(sanitizedTarget);
      const publicPath = `${ASSETS_PUBLIC_PREFIX}/${normalizedTarget}`;
      record = { destination, publicPath };
      this.cache.set(assetPathInfo.path, record);
    }

    return record.publicPath;
  }

  rewriteContent({ pageFilePath, pagePath, content }) {
    if (!content) {
      return content;
    }

    let updatedContent = content;
    updatedContent = this.#rewriteMarkdownImages(
      pageFilePath,
      pagePath,
      updatedContent,
    );
    updatedContent = this.#rewriteHtmlImages(
      pageFilePath,
      pagePath,
      updatedContent,
    );
    updatedContent = this.#rewriteHtmlSources(
      pageFilePath,
      pagePath,
      updatedContent,
    );
    return updatedContent;
  }

  #rewriteMarkdownImages(pageFilePath, pagePath, content) {
    return content.replace(MARKDOWN_IMAGE_REGEX, (match, assetRef) => {
      const rewritten = this.#copyAsset(pageFilePath, pagePath, assetRef);
      return rewritten ? match.replace(assetRef, rewritten) : match;
    });
  }

  #rewriteHtmlImages(pageFilePath, pagePath, content) {
    return content.replace(HTML_IMAGE_REGEX, (match, assetRef) => {
      const rewritten = this.#copyAsset(pageFilePath, pagePath, assetRef);
      return rewritten ? match.replace(assetRef, rewritten) : match;
    });
  }

  #rewriteHtmlSources(pageFilePath, pagePath, content) {
    return content.replace(HTML_SOURCE_REGEX, (match, assetRef) => {
      const variants = assetRef
        .split(",")
        .map((variant) => variant.trim())
        .filter(Boolean);
      if (variants.length === 0) {
        return match;
      }

      const rewrittenVariants = variants.map((variant) => {
        const [pathPart, descriptor] = variant.split(/\s+/, 2);
        const rewrittenPath = this.#copyAsset(pageFilePath, pagePath, pathPart);
        return rewrittenPath
          ? [rewrittenPath, descriptor].filter(Boolean).join(" ")
          : variant;
      });

      const rewrittenSrcSet = rewrittenVariants.join(", ");
      return rewrittenSrcSet === assetRef
        ? match
        : match.replace(assetRef, rewrittenSrcSet);
    });
  }

  #copyAsset(pageFilePath, pagePath, assetReference) {
    if (!this.#isLocalAsset(assetReference)) {
      return null;
    }

    const { path: assetPath, suffix } =
      this.#splitAssetReference(assetReference);
    const logicalAssetPath = resolve(dirname(pageFilePath), assetPath);
    const assetPathInfo = this.#resolveAssetPathInfo(logicalAssetPath);
    if (!assetPathInfo) {
      return null;
    }

    const stats = statSync(assetPathInfo.path);
    if (!stats.isFile()) {
      return null;
    }

    let record = this.cache.get(assetPathInfo.path);
    if (!record) {
      const sanitizedTarget = this.#sanitizeAssetTarget(
        assetPathInfo.relativePath,
        assetPathInfo.path,
      );
      const destination = join(this.sitePath, ASSETS_ROOT, sanitizedTarget);
      mkdirSync(dirname(destination), { recursive: true });
      this.siteFileManager.copyFile(assetPathInfo.path, destination);

      const normalizedTarget = toPosixPath(sanitizedTarget);
      const publicPath = `${ASSETS_PUBLIC_PREFIX}/${normalizedTarget}`;
      record = { destination, publicPath };
      this.cache.set(assetPathInfo.path, record);
    }

    return `${record.publicPath}${suffix}`;
  }

  #resolveAssetPathInfo(assetAbsolutePath) {
    try {
      return this.workspacePathResolver.resolveExistingWithinWorkspace(
        assetAbsolutePath,
      );
    } catch {
      return null;
    }
  }

  #sanitizeAssetTarget(relativeAssetPath, assetAbsolutePath) {
    const cleanedSegments = relativeAssetPath
      .split(/[\\/]+/)
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) =>
        segment.replace(/^\.+/, "").replace(/[^a-zA-Z0-9._-]/g, "-"),
      )
      .filter(Boolean);

    if (cleanedSegments.length === 0) {
      const fallback = basename(assetAbsolutePath).replace(
        /[^a-zA-Z0-9._-]/g,
        "-",
      );
      cleanedSegments.push(fallback || `asset-${randomUUID()}`);
    }

    return cleanedSegments.join("/");
  }

  #splitAssetReference(assetReference) {
    const trimmed = assetReference.trim();
    const match = trimmed.match(/^([^?#]+)(\?[^#]+)?(#.+)?$/);
    if (!match) {
      return { path: trimmed, suffix: "" };
    }

    return {
      path: match[1],
      suffix: `${match[2] || ""}${match[3] || ""}`,
    };
  }

  #isLocalAsset(assetReference) {
    if (!assetReference) {
      return false;
    }

    const trimmed = assetReference.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("data:")) {
      return false;
    }

    if (trimmed.startsWith("{%") || trimmed.startsWith("{{")) {
      return false;
    }

    if (trimmed.startsWith("/")) {
      return false;
    }

    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
      return false;
    }

    return true;
  }
}

function toPosixPath(value) {
  return value.split(sep).join("/");
}

module.exports = {
  AssetManager,
  toPosixPath,
};
