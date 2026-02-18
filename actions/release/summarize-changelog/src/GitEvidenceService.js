const MAX_REFERENCES = 8;
const MAX_EVIDENCE_LENGTH = 1500;
const MAX_FILE_LINES = 20;

export class GitEvidenceService {
  constructor(referenceExtractor, logger, githubClient, repositoryContext) {
    this.referenceExtractor = referenceExtractor;
    this.logger = logger;
    this.githubClient = githubClient;
    this.repositoryContext = repositoryContext;
  }

  async collect(changelogBody, fileSystemService) {
    const references = this.referenceExtractor.extract(changelogBody);
    const workingDirectory = fileSystemService.getRelativeWorkingDirectory();
    const evidenceBlocks = [];

    for (const sha of references.commitShas.slice(0, MAX_REFERENCES)) {
      const block = await this.#getCommitEvidence(sha, workingDirectory);

      if (block) {
        evidenceBlocks.push(
          `Commit ${sha}:\n${this.#limitText(block, MAX_EVIDENCE_LENGTH)}`,
        );
      }
    }

    for (const prNumber of references.pullRequests.slice(0, MAX_REFERENCES)) {
      const block = await this.#getPullRequestEvidence(
        prNumber,
        workingDirectory,
      );

      if (block) {
        evidenceBlocks.push(
          `Pull request #${prNumber}:\n${this.#limitText(block, MAX_EVIDENCE_LENGTH)}`,
        );
      }
    }

    if (evidenceBlocks.length > 0) {
      this.logger.info(
        `Collected ${evidenceBlocks.length} git evidence block(s)`,
      );
    }

    return evidenceBlocks.join("\n\n").trim();
  }

  async #getCommitEvidence(sha, workingDirectory) {
    try {
      const response = await this.githubClient.rest.repos.getCommit({
        ...this.repositoryContext,
        ref: sha,
      });
      const relevantFiles = this.#filterFiles(
        response.data.files || [],
        workingDirectory,
      );
      if (relevantFiles.length === 0) {
        return "";
      }

      return [
        response.data.sha,
        response.data.commit.message,
        "Files:",
        ...relevantFiles
          .slice(0, MAX_FILE_LINES)
          .map((file) => `- ${file.filename}`),
      ].join("\n");
    } catch {
      return "";
    }
  }

  async #getPullRequestEvidence(prNumber, workingDirectory) {
    try {
      const pullRequest = await this.githubClient.rest.pulls.get({
        ...this.repositoryContext,
        pull_number: Number(prNumber),
      });
      const files = await this.githubClient.paginate(
        this.githubClient.rest.pulls.listFiles,
        {
          ...this.repositoryContext,
          pull_number: Number(prNumber),
          per_page: 100,
        },
      );
      const relevantFiles = this.#filterFiles(files, workingDirectory);
      if (relevantFiles.length === 0) {
        return "";
      }

      return [
        `#${pullRequest.data.number} ${pullRequest.data.title}`,
        pullRequest.data.body || "",
        "Files:",
        ...relevantFiles
          .slice(0, MAX_FILE_LINES)
          .map((file) => `- ${file.filename}`),
      ]
        .filter(Boolean)
        .join("\n");
    } catch {
      return "";
    }
  }

  #filterFiles(files, workingDirectory) {
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }

    if (!workingDirectory || workingDirectory === ".") {
      return files;
    }

    const normalizedPrefix = `${workingDirectory.replace(/\\/g, "/").replace(/\/$/, "")}/`;
    return files.filter((file) => {
      const filename = file?.filename;
      return (
        filename === workingDirectory || filename?.startsWith(normalizedPrefix)
      );
    });
  }

  #limitText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength - 1).trimEnd()}…`;
  }
}
