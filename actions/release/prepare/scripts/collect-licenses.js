import fs from "node:fs";
import path from "node:path";

// ncc cannot recover notices for dependencies already bundled by Release Drafter.
// Preserve notices from every locked runtime package, including its upstream bundle.
const { packages } = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const notices = [];
for (const [directory, metadata] of Object.entries(packages)) {
	if (!directory || metadata.dev) continue;
	const files = fs
		.readdirSync(directory)
		.filter((name) =>
			/^(license|licence|copying|notice|third_party_notices)([.-]|$)/i.test(
				name,
			),
		);
	if (!files.length) throw new Error(`Missing license notice for ${directory}`);
	for (const file of files.sort()) {
		notices.push(
			`${directory}/${file}\n\n${fs.readFileSync(path.join(directory, file), "utf8").trim()}`,
		);
	}
}
fs.writeFileSync(
	"dist/THIRD_PARTY_NOTICES",
	`${notices.join("\n\n---\n\n")}\n`,
);
