import path from "node:path";

const CURRENT_DIRECTORY = ".";

export class FileSystemService {
	constructor(workingDirectory) {
		this.workingDirectory = this.#normalizeRepositoryPath(workingDirectory);
	}

	getRelativeWorkingDirectory() {
		return this.workingDirectory;
	}

	#normalizeRepositoryPath(workingDirectory) {
		const rawPath =
			(workingDirectory || CURRENT_DIRECTORY).trim() || CURRENT_DIRECTORY;
		const normalizedPath = path.posix.normalize(rawPath.replace(/\\/g, "/"));

		if (
			path.posix.isAbsolute(normalizedPath) ||
			normalizedPath === ".." ||
			normalizedPath.startsWith("../")
		) {
			throw new Error(
				"The working-directory input must stay within the repository.",
			);
		}

		return normalizedPath === CURRENT_DIRECTORY
			? CURRENT_DIRECTORY
			: normalizedPath.replace(/\/$/, "");
	}
}
