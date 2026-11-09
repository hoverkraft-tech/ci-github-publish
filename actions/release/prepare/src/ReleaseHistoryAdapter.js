import { valid } from "semver";

export class ReleaseHistoryAdapter {
	constructor(adapter, tagPrefix) {
		this.adapter = adapter;
		this.tagPrefix = tagPrefix;
	}

	get capabilities() {
		return this.adapter.capabilities;
	}

	async listReleases(request) {
		const releases = await this.adapter.listReleases(request);
		if (typeof this.tagPrefix !== "string") {
			return releases;
		}

		return releases.filter(
			({ tagName }) =>
				tagName.startsWith(this.tagPrefix) &&
				valid(tagName.slice(this.tagPrefix.length)) !== null,
		);
	}

	findChanges(request) {
		return this.adapter.findChanges(request);
	}

	resolveCommitish(request) {
		return this.adapter.resolveCommitish(request);
	}

	createRelease(request) {
		return this.adapter.createRelease(request);
	}

	updateRelease(request) {
		return this.adapter.updateRelease(request);
	}
}
