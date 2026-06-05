import { compile } from "html-to-text";

const MAX_LINKS = 3;
const MAX_EVIDENCE_LENGTH = 2000;

const convertHtmlToText = compile({
	wordwrap: false,
	selectors: [
		{ selector: "script", format: "skip" },
		{ selector: "style", format: "skip" },
	],
});

export class LinkEvidenceService {
	constructor(referenceExtractor, logger, fetchImpl = globalThis.fetch) {
		this.referenceExtractor = referenceExtractor;
		this.logger = logger;
		this.fetch = fetchImpl;
	}

	async collect(changelogBody) {
		if (typeof this.fetch !== "function") {
			return "";
		}

		const references = this.referenceExtractor.extract(changelogBody);
		const prioritizedUrls = this.#prioritizeUrls(
			references.urls,
			changelogBody,
		);
		const evidenceBlocks = [];

		for (const url of prioritizedUrls.slice(0, MAX_LINKS)) {
			try {
				const response = await this.fetch(url, {
					headers: {
						"user-agent": "hoverkraft-release-summary-action",
					},
					signal: AbortSignal.timeout(10000),
				});

				if (!response.ok) {
					continue;
				}

				const responseText = await response.text();
				const normalized = this.#normalizeFetchedText(responseText);
				if (normalized) {
					evidenceBlocks.push(
						`${url}\n${this.#limitText(normalized, MAX_EVIDENCE_LENGTH)}`,
					);
				}
			} catch {}
		}

		if (evidenceBlocks.length > 0) {
			this.logger.info(
				`Collected ${evidenceBlocks.length} linked evidence block(s)`,
			);
		}

		return evidenceBlocks.join("\n\n").trim();
	}

	#prioritizeUrls(urls, changelogBody) {
		const breakingLines = changelogBody
			.split(/\r?\n/)
			.filter((line) => /breaking/i.test(line));

		return [...urls].sort((left, right) => {
			const leftPriority = breakingLines.some((line) => line.includes(left))
				? 0
				: 1;
			const rightPriority = breakingLines.some((line) => line.includes(right))
				? 0
				: 1;
			return leftPriority - rightPriority;
		});
	}

	#normalizeFetchedText(text) {
		return convertHtmlToText(text).replace(/\s+/g, " ").trim();
	}

	#limitText(text, maxLength) {
		if (text.length <= maxLength) {
			return text;
		}

		return `${text.slice(0, maxLength - 1).trimEnd()}…`;
	}
}
