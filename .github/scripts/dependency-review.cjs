const assert = require("node:assert/strict");

// Keep this assessment aligned with ../linters/trivy-ignore.yaml.
// Jampack uses fixed globs; the action only accepts a literal directory.
const assessment = {
	advisory: "GHSA-vfj7-8cjw-p6xm",
	manifest: "actions/deploy/jampack/package-lock.json",
	packageUrl: "pkg:npm/braces@3.0.3",
	expiresAt: "2026-11-12",
};

function verifyDependencyChanges(changes, now = new Date()) {
	assert(Array.isArray(changes), "Missing dependency review changes");
	assert(Number.isFinite(now.getTime()), "Invalid assessment date");

	let assessedFindings = 0;
	for (const change of changes) {
		assert(
			change && ["added", "removed"].includes(change.change_type),
			"Invalid dependency change",
		);
		assert(Array.isArray(change.vulnerabilities), "Missing vulnerability data");
		if (change.change_type === "removed") continue;

		for (const vulnerability of change.vulnerabilities) {
			assert(
				vulnerability?.advisory_ghsa_id === assessment.advisory &&
					change.manifest === assessment.manifest &&
					change.package_url === assessment.packageUrl &&
					change.ecosystem === "npm" &&
					change.name === "braces" &&
					change.version === "3.0.3",
				`Unassessed vulnerability in ${change.manifest}: ${change.name}@${change.version} (${vulnerability?.advisory_ghsa_id})`,
			);
			assert(
				now < new Date(`${assessment.expiresAt}T00:00:00Z`),
				`Dependency assessment expired on ${assessment.expiresAt}; reassess ${assessment.advisory}`,
			);
			assessedFindings += 1;
		}
	}

	return assessedFindings;
}

module.exports = { assessment, verifyDependencyChanges };
