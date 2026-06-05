const { copyFileSync, mkdirSync, writeFileSync } = require("node:fs");
const { dirname } = require("node:path");

class SiteFileManager {
	writeFile(targetPath, content) {
		mkdirSync(dirname(targetPath), { recursive: true });
		writeFileSync(targetPath, content);
	}

	copyFile(sourcePath, targetPath) {
		mkdirSync(dirname(targetPath), { recursive: true });
		copyFileSync(sourcePath, targetPath);
	}
}

module.exports = {
	SiteFileManager,
};
