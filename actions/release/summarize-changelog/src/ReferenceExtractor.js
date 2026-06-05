export class ReferenceExtractor {
	extract(changelogBody) {
		return {
			commitShas: this.#uniqueMatches(changelogBody, /\b[0-9a-f]{7,40}\b/gi),
			pullRequests: this.#uniqueMatches(
				changelogBody,
				/(?:^|[^\w])#(?<number>\d+)\b|\/pull\/(?<urlNumber>\d+)\b/gi,
				["number", "urlNumber"],
			),
			urls: this.#uniqueMatches(changelogBody, /https?:\/\/[^\s)\]>]+/gi),
		};
	}

	#uniqueMatches(source, pattern, groupNames = []) {
		const values = new Set();
		let match = pattern.exec(source);

		while (match) {
			if (groupNames.length > 0) {
				for (const groupName of groupNames) {
					const value = match.groups?.[groupName];
					if (value) {
						values.add(value);
					}
				}
			} else if (match[0]) {
				values.add(match[0]);
			}

			match = pattern.exec(source);
		}

		return [...values];
	}
}
