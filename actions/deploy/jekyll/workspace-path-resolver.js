const { existsSync } = require("fs");
const { isAbsolute, relative, resolve, sep } = require("path");

class WorkspacePathResolver {
  constructor({ workspacePath }) {
    if (!workspacePath) {
      throw new Error("workspacePath is required.");
    }

    this.workspacePath = resolve(workspacePath);
  }

  resolveWithinWorkspace(targetPath) {
    const resolvedPath = isAbsolute(targetPath)
      ? resolve(targetPath)
      : resolve(this.workspacePath, targetPath);

    this.#assertWithinWorkspace(resolvedPath);
    return resolvedPath;
  }

  resolveExistingWithinWorkspace(targetPath) {
    const resolvedPath = this.resolveWithinWorkspace(targetPath);

    if (!existsSync(resolvedPath)) {
      throw new Error(`Path does not exist: ${resolvedPath}`);
    }

    return {
      path: resolvedPath,
      relativePath: relative(this.workspacePath, resolvedPath),
    };
  }

  #assertWithinWorkspace(targetPath) {
    const pathFromWorkspace = relative(this.workspacePath, targetPath);

    if (
      pathFromWorkspace === ".." ||
      pathFromWorkspace.startsWith(`..${sep}`) ||
      isAbsolute(pathFromWorkspace)
    ) {
      throw new Error(
        `Path must stay within workspace. Provided value resolves to: ${targetPath}`,
      );
    }
  }
}

module.exports = {
  WorkspacePathResolver,
};
