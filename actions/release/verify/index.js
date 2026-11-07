class ReleaseVerification {
	constructor({ github, context }) {
		this.github = github;
		this.context = context;
	}

	async verify({ artifactIds = [], tags, requireTags = false }) {
		for (const [name, values] of Object.entries({ artifactIds, tags })) {
			if (
				!Array.isArray(values) ||
				(name === "tags" && !values.length) ||
				values.length > 256 ||
				values.some(
					(value) =>
						typeof value !== "string" || !value || value.trim() !== value,
				) ||
				new Set(values).size !== values.length
			) {
				throw new Error(
					`${name} must be an array of unique strings, with at most 256 entries; tags must not be empty.`,
				);
			}
		}
		for (const artifactId of artifactIds) {
			if (
				!/^[1-9]\d*$/.test(artifactId) ||
				!Number.isSafeInteger(Number(artifactId))
			) {
				throw new Error("Expected positive, safe artifact IDs.");
			}
		}
		for (const artifactId of artifactIds) await this.verifyArtifact(artifactId);
		const releases = [];
		for (const tag of tags)
			releases.push({
				tag,
				published: await this.isPublished(tag, requireTags),
			});
		return releases;
	}

	async verifyArtifact(artifactId) {
		const { data: artifact } = await this.github.rest.actions.getArtifact({
			...this.context.repo,
			artifact_id: Number(artifactId),
		});
		if (
			artifact.expired ||
			artifact.workflow_run?.id !== this.context.runId ||
			artifact.workflow_run?.head_sha !== this.context.sha
		) {
			throw new Error(
				"Release artifacts must be unexpired and belong to this run and commit.",
			);
		}
	}

	async isPublished(tag, requireTag) {
		let object;
		try {
			object = (
				await this.github.rest.git.getRef({
					...this.context.repo,
					ref: `tags/${tag}`,
				})
			).data.object;
		} catch (error) {
			if (error.status !== 404) throw error;
		}
		if (!object && requireTag)
			throw new Error(`Prepared release tag ${tag} does not exist.`);
		if (object) {
			let depth = 0;
			while (object.type === "tag" && depth++ < 10) {
				object = (
					await this.github.rest.git.getTag({
						...this.context.repo,
						tag_sha: object.sha,
					})
				).data.object;
			}
			if (object.type !== "commit" || object.sha !== this.context.sha) {
				throw new Error(
					`Release tag ${tag} must identify this run's source commit.`,
				);
			}
		}
		const release = await this.findRelease(tag);
		if (release && !object)
			throw new Error(`Release ${tag} has no matching Git tag.`);
		return Boolean(release && !release.draft);
	}

	async findRelease(tag) {
		try {
			return (
				await this.github.rest.repos.getReleaseByTag({
					...this.context.repo,
					tag,
				})
			).data;
		} catch (error) {
			if (error.status !== 404) throw error;
			// The by-tag endpoint only guarantees published releases; include drafts on retry.
			const releases = await this.github.paginate(
				this.github.rest.repos.listReleases,
				{
					...this.context.repo,
					per_page: 100,
				},
			);
			return releases.find((release) => release.tag_name === tag);
		}
	}
}

module.exports = { ReleaseVerification };
