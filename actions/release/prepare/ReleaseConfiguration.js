import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse, stringify } from "yaml";

export class ReleaseConfiguration {
	constructor({ workspace, runnerTemp }) {
		this.workspace = workspace;
		this.runnerTemp = runnerTemp;
	}

	async load(loadConfig, options) {
		if (!options.target.startsWith("file:")) {
			return loadConfig(options);
		}

		// The SDK confines local inheritance to one directory. Bundle only files
		// from the checked-out repository and the job's generated configurations.
		const directory = await fs.mkdtemp(
			path.join(os.tmpdir(), "release-config-"),
		);
		try {
			const roots = await Promise.all(
				[this.workspace, this.runnerTemp]
					.filter(Boolean)
					.map((root) => fs.realpath(root)),
			);
			const file = path.resolve(options.cwd, options.target.slice(5));
			const target = await this.copy(file, {
				directory,
				roots,
				files: new Map(),
			});
			return await loadConfig({ ...options, cwd: directory, target });
		} finally {
			await fs.rm(directory, { recursive: true, force: true });
		}
	}

	async copy(file, state) {
		const source = await fs.realpath(file);
		if (!state.roots.some((root) => this.contains(root, source))) {
			throw new Error(
				"Release configuration must remain within the workspace or runner temporary directory.",
			);
		}
		if (state.files.has(source)) {
			return state.files.get(source);
		}
		if (state.files.size >= 33) {
			throw new Error("Release configuration inheritance exceeds 33 files.");
		}
		const filename = `config-${state.files.size}.yml`;
		const target = `file:${filename}`;
		state.files.set(source, target);
		const config = parse(await fs.readFile(source, "utf8"));
		const declaration = config?._extends;
		const inherited =
			typeof declaration === "string" ? declaration : declaration?.from;
		if (typeof inherited === "string" && inherited.startsWith("file:")) {
			const parent = await this.copy(
				path.resolve(path.dirname(source), inherited.slice(5)),
				state,
			);
			config._extends =
				typeof declaration === "string"
					? parent
					: { ...declaration, from: parent };
		}
		await fs.writeFile(
			path.join(state.directory, filename),
			stringify(config),
			{ mode: 0o600 },
		);
		return target;
	}

	contains(root, file) {
		const relative = path.relative(root, file);
		return (
			relative !== "" &&
			relative !== ".." &&
			!relative.startsWith(`..${path.sep}`) &&
			!path.isAbsolute(relative)
		);
	}
}
