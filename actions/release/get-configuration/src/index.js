import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

function run({ core, inputs }) {
	const mapping = (source, label) => {
		const value = parse(source);
		if (!value || typeof value !== "object" || Array.isArray(value)) {
			throw new Error(`${label} must be a YAML or JSON mapping.`);
		}
		return value;
	};
	const githubDirectory = path.join(inputs.workspace, ".github");
	let baseConfig = path.resolve(githubDirectory, inputs.baseConfigPath);
	const defaults = mapping(
		fs.readFileSync(baseConfig, "utf8"),
		"Generated defaults",
	);
	let scope = (defaults.categories || []).filter(
		(category) => category.type === "pre-include",
	);
	const repositoryConfig = inputs.repositoryConfigPath
		? path.resolve(githubDirectory, inputs.repositoryConfigPath)
		: "";
	const directory = fs.mkdtempSync(
		path.join(inputs.runnerTemp, "release-config-"),
	);
	const inherit = (configuration, filename) => {
		if (Array.isArray(configuration.categories)) {
			const explicitScope = configuration.categories.filter(
				(category) => category?.type === "pre-include",
			);
			if (explicitScope.length) {
				scope = explicitScope;
			} else if (scope.length) {
				configuration = {
					...configuration,
					categories: [...scope, ...configuration.categories],
				};
			}
		}
		const target = path.join(directory, filename);
		const content = {
			...configuration,
			_extends: `file:${path.relative(directory, baseConfig).split(path.sep).join("/")}`,
		};
		fs.writeFileSync(target, `${JSON.stringify(content, null, 2)}\n`, {
			mode: 0o600,
		});
		baseConfig = target;
	};
	if (repositoryConfig) {
		const repository = mapping(
			fs.readFileSync(repositoryConfig, "utf8"),
			"Repository release configuration",
		);
		if (Object.hasOwn(repository, "_extends")) {
			baseConfig = repositoryConfig;
			// An explicit inheritance chain owns its defaults and merge semantics.
			scope = [];
		} else {
			inherit(repository, "repository.json");
		}
	}
	if (inputs.configOverrides) {
		const overrides = mapping(inputs.configOverrides, "config-overrides");
		if (Object.hasOwn(overrides, "_extends")) {
			throw new Error(
				"config-overrides cannot override _extends; repository configuration inheritance is preserved automatically.",
			);
		}
		inherit(overrides, "overrides.json");
	}
	core.setOutput(
		"config-path",
		path.relative(githubDirectory, baseConfig).split(path.sep).join("/"),
	);
	core.setOutput("is-generated", String(baseConfig !== repositoryConfig));
}

export { run };
