const { copyFileSync, mkdirSync, writeFileSync } = require("fs");
const { dirname } = require("path");

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
