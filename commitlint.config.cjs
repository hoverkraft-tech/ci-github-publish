module.exports = {
	extends: ["@commitlint/config-conventional"],
	// Dependabot generates unwrapped bodies; PR titles are validated separately.
	ignores: [
		(message) =>
			/^updated-dependencies:$/m.test(message) &&
			/^Signed-off-by: dependabot\[bot\] <support@github\.com>$/m.test(message),
	],
};
