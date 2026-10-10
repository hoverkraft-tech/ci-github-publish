# Release

Release in this repository is action-first. The release surface is built from focused actions:

- `actions/release/plan`
- `actions/release/create`
- `actions/release/update`
- `actions/release/delete`
- `actions/release/summarize-changelog`

`plan`, `create`, `update`, and `delete` handle release state directly. `summarize-changelog` is a helper for generating end user release notes from drafted changelog content.

That keeps release state changes explicit in the caller workflow and leaves validation, packaging, signing, and release-file preparation under repository control.

## Core Rule

Compute the release identity early. Publish the GitHub release only after the final release body and assets are ready.

That means:

- run validation before any durable release state is created
- update and merge release-owned files before drafting the final release when they belong in the released source tree
- prefer a single `actions/release/create` step for the simplest validate-and-release flow
- publish the GitHub release only after draft updates and asset uploads are complete
- when a workflow keeps a temporary draft across later jobs, delete that draft if an intermediate job fails before publication

## Release Actions

### `actions/release/plan`

Resolve the release tag and release name without creating any durable release state.
The `has-changes` output reports whether plan found relevant changes under the effective release configuration.
It is also `true` for the first release. Planning always returns the proposed `tag` and `name`, even without changes.
Planning targets `${{ github.sha }}` by default; set `target-sha` when the release identity must be computed from a different ref.
The caller decides whether to release. Example 3 combines `has-changes` with its manual `force` input
in a `should-release` job output, then gates validation and release preparation on that output.
Use a commit containing the `has-changes` output when replacing `<sha>` in the planning examples.

### `actions/release/create`

Create or refresh the GitHub release from Release Drafter or from explicit release inputs, with optional changelog summarization, optional initial asset upload, and optional publish.

### `actions/release/update`

Update an existing GitHub release body, upload release assets, and optionally publish an already created release for an existing tag.

### `actions/release/delete`

Delete an existing GitHub release by tag, with optional draft-only cleanup behavior for fallback jobs that should not remove already published releases.

### `actions/release/summarize-changelog`

Generate a concise end user release summary from drafted changelog content. `actions/release/create` can call this helper through its `changelog-summary` input, or you can run it directly when the summary must be reviewed or transformed before publication.

See [Example 4](#example-4-generate-an-end-user-release-summary) for both usage modes.

The helper reads a Markdown `changelog-body`, calls the configured LLM provider,
and returns a rendered `summary` output. It talks to the GitHub API to inspect
referenced commits and pull requests, so grant the job `contents: read` and
`pull-requests: read`, and provide the provider credentials through `llm-auth`.
See the [`actions/release/summarize-changelog` readme](../../actions/release/summarize-changelog/README.md)
for the full input and output reference.

<!--
// jscpd:ignore-start
-->

## Workflow Examples

Choose the smallest workflow that fits the repository. Copy Example 1 first, add Example 2 only when artifacts must be built from the final release identity, and add Example 3 only when the released source tree must change before the release can be drafted.

Use `actions/release/create` alone when the workflow only needs to validate and publish a release. Add `actions/release/plan` when later jobs need the release identity before drafting, or when validation and publishing should be skipped if there are no release changes.

Example 4 is orthogonal to that release-state ladder: layer it onto any of the previous flows when the release notes need an end user summary generated from the drafted changelog.

### Example 1: Validate source and release

Use this when the release only needs a validated source commit and a published GitHub release. No later job needs the final tag before publication.

```yaml
name: Release

on:
  workflow_dispatch:

permissions: {}

concurrency:
  group: release-${{ github.repository }}-${{ github.ref_name }}
  cancel-in-progress: false

jobs:
  validate-source:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
      - run: make test

  release:
    runs-on: ubuntu-latest
    needs: validate-source
    permissions:
      contents: write
      pull-requests: read
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/create@<sha> # x.y.z
        with:
          github-token: ${{ github.token }}
```

### Example 2: Validate source, create release artifacts, and release

Use this when artifacts must be built from the release identity and attached to the GitHub release, but no later job needs the final tag as a pushed Git ref before publication.

```yaml
name: Release

on:
  workflow_dispatch:

permissions: {}

concurrency:
  group: release-${{ github.repository }}-${{ github.ref_name }}
  cancel-in-progress: false

jobs:
  validate-source:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
      - run: make test

  draft-release:
    runs-on: ubuntu-latest
    needs: validate-source
    permissions:
      contents: write
      pull-requests: read
    outputs:
      tag: ${{ steps.create-release.outputs.tag }}
    steps:
      - id: create-release
        uses: hoverkraft-tech/ci-github-publish/actions/release/create@<sha> # x.y.z
        with:
          publish: "false"
          github-token: ${{ github.token }}

  publish-release-artifacts:
    runs-on: ubuntu-latest
    needs: draft-release
    permissions:
      contents: read
    outputs:
      release-artifact-id: ${{ steps.upload-release-assets.outputs.artifact-id }}
    steps:
      - uses: actions/checkout@<sha> # vx.y.z

      - run: make build-release-artifacts RELEASE_TAG=${{ needs.draft-release.outputs.tag }}

      - id: upload-release-assets
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: release-assets
          path: dist/
          if-no-files-found: error

  cleanup-draft-release:
    runs-on: ubuntu-latest
    needs: [draft-release, publish-release-artifacts]
    if: ${{ failure() && needs.draft-release.result == 'success' && needs.publish-release-artifacts.result == 'failure' }}
    permissions:
      contents: write
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/delete@<sha> # x.y.z
        with:
          tag: ${{ needs.draft-release.outputs.tag }}
          draft-only: "true"
          github-token: ${{ github.token }}

  publish-release:
    runs-on: ubuntu-latest
    needs: [draft-release, publish-release-artifacts]
    permissions:
      contents: write
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/update@<sha> # x.y.z
        with:
          tag: ${{ needs.draft-release.outputs.tag }}
          release-artifact-id: ${{ needs.publish-release-artifacts.outputs.release-artifact-id }}
          publish: "true"
          github-token: ${{ github.token }}
```

### Example 3: Validate source, update files, create release artifacts, and release

Use this when changelogs, version files, Helm values, generated docs, or other release-owned files must be updated before the final release is drafted.

Recommended rule:

- prepare the files in a branch
- open and merge a pull request
- draft the release from the merged commit
- build and publish artifacts from that final release identity
- create the GitHub release from the same final identity

```yaml
name: Release

on:
  schedule:
    - cron: "25 8 * * 1"
  workflow_dispatch:
    inputs:
      force:
        description: Release even when no relevant changes are detected
        type: boolean
        required: false
        default: false

permissions: {}

concurrency:
  group: release-${{ github.repository }}-${{ github.ref_name }}
  cancel-in-progress: false

jobs:
  plan-release:
    if: github.ref_name == github.event.repository.default_branch
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    outputs:
      should-release: ${{ steps.plan.outputs.has-changes == 'true' || (github.event_name == 'workflow_dispatch' && inputs.force) }}
      tag: ${{ steps.plan.outputs.tag }}
    steps:
      - id: plan
        uses: hoverkraft-tech/ci-github-publish/actions/release/plan@<sha> # x.y.z
        with:
          github-token: ${{ github.token }}

  validate-source:
    runs-on: ubuntu-latest
    needs: plan-release
    if: needs.plan-release.outputs.should-release == 'true'
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
      - run: make test

  prepare-release-files:
    runs-on: ubuntu-latest
    needs: [plan-release, validate-source]
    if: needs.plan-release.outputs.should-release == 'true'
    permissions:
      contents: write
      pull-requests: write
    outputs:
      release-sha: ${{ steps.create-and-merge-pr.outputs.merged-sha || github.sha }}
    steps:
      - uses: actions/checkout@<sha> # vx.y.z

      - run: ./scripts/prepare-release-files.sh "${{ needs.plan-release.outputs.tag }}"

      - id: create-and-merge-pr
        uses: hoverkraft-tech/ci-github-common/actions/create-and-merge-pull-request@<sha> # x.y.z
        with:
          github-token: ${{ github.token }}
          branch: release/prepare-${{ needs.plan-release.outputs.tag }}
          title: "chore: prepare release files for ${{ needs.plan-release.outputs.tag }}"
          body: |
            Automated release preparation for `${{ needs.plan-release.outputs.tag }}`.
          commit-message: "chore(release): prepare ${{ needs.plan-release.outputs.tag }}"

  draft-release:
    runs-on: ubuntu-latest
    needs: [plan-release, prepare-release-files]
    permissions:
      contents: write
      pull-requests: read
    outputs:
      tag: ${{ steps.create-release.outputs.tag }}
    steps:
      - id: create-release
        uses: hoverkraft-tech/ci-github-publish/actions/release/create@<sha> # x.y.z
        with:
          tag: ${{ needs.plan-release.outputs.tag }}
          target-sha: ${{ needs.prepare-release-files.outputs.release-sha }}
          publish: "false"
          github-token: ${{ github.token }}

  publish-release-artifacts:
    runs-on: ubuntu-latest
    needs: [plan-release, prepare-release-files, draft-release]
    permissions:
      contents: read
    outputs:
      release-artifact-id: ${{ steps.upload-release-assets.outputs.artifact-id }}
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
        with:
          ref: ${{ needs.prepare-release-files.outputs.release-sha }}

      - run: make build-release-artifacts RELEASE_TAG=${{ needs.plan-release.outputs.tag }}

      - id: upload-release-assets
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: release-assets
          path: dist/
          if-no-files-found: error

  cleanup-draft-release:
    runs-on: ubuntu-latest
    needs: [draft-release, publish-release-artifacts]
    if: ${{ failure() && needs.draft-release.result == 'success' && needs.publish-release-artifacts.result == 'failure' }}
    permissions:
      contents: write
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/delete@<sha> # x.y.z
        with:
          tag: ${{ needs.draft-release.outputs.tag }}
          draft-only: "true"
          github-token: ${{ github.token }}

  publish-release:
    runs-on: ubuntu-latest
    needs: [draft-release, publish-release-artifacts]
    permissions:
      contents: write
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/update@<sha> # x.y.z
        with:
          tag: ${{ needs.draft-release.outputs.tag }}
          release-artifact-id: ${{ needs.publish-release-artifacts.outputs.release-artifact-id }}
          publish: "true"
          github-token: ${{ github.token }}
```

### Example 4: Generate an end user release summary

Use this when the published release notes should open with a short, human readable summary generated from the drafted changelog. Pick one of the two modes below.

Store the LLM provider credential as a repository secret (for example `OPENAI_API_KEY`) and pass it through to the summarizer. The summarizer inspects referenced commits and pull requests through the GitHub API, so the job needs `contents: read` and `pull-requests: read` in addition to the permissions each release action already requires.

#### Mode A: Let `actions/release/create` summarize the changelog

This is the simplest path. `actions/release/create` drafts the release, summarizes the changelog body it produced, and prepends the summary above the full changelog in a single step. Pass the summarizer configuration as JSON through the `changelog-summary` input.

```yaml
name: Release

on:
  workflow_dispatch:

permissions: {}

concurrency:
  group: release-${{ github.repository }}-${{ github.ref_name }}
  cancel-in-progress: false

jobs:
  validate-source:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
      - run: make test

  release:
    runs-on: ubuntu-latest
    needs: validate-source
    permissions:
      contents: write
      pull-requests: read
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/create@<sha> # x.y.z
        with:
          github-token: ${{ github.token }}
          # The summary is generated and prepended automatically before publication.
          changelog-summary: |
            {
              "llmAuth": "${{ secrets.OPENAI_API_KEY }}",
              "llmProvider": "openai",
              "llmModel": "gpt-5.4"
            }
```

#### Mode B: Summarize directly so the summary can be reviewed or transformed

Run `actions/release/summarize-changelog` yourself when the summary must be checked or edited before it is published. Draft the release without publishing, read the drafted changelog, summarize it, apply any review or transformation, then publish the final body with `actions/release/update`.

```yaml
name: Release

on:
  workflow_dispatch:

permissions: {}

concurrency:
  group: release-${{ github.repository }}-${{ github.ref_name }}
  cancel-in-progress: false

jobs:
  validate-source:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
      - run: make test

  release:
    runs-on: ubuntu-latest
    needs: validate-source
    permissions:
      contents: write
      pull-requests: read
    steps:
      - id: draft-release
        uses: hoverkraft-tech/ci-github-publish/actions/release/create@<sha> # x.y.z
        with:
          publish: "false"
          github-token: ${{ github.token }}

      - id: read-draft-body
        env:
          GH_TOKEN: ${{ github.token }}
          TAG: ${{ steps.draft-release.outputs.tag }}
        run: |
          {
            echo 'body<<CHANGELOG_EOF'
            gh release view "$TAG" --repo "$GITHUB_REPOSITORY" --json body --jq .body
            echo CHANGELOG_EOF
          } >> "$GITHUB_OUTPUT"

      - id: summarize
        uses: hoverkraft-tech/ci-github-publish/actions/release/summarize-changelog@<sha> # x.y.z
        with:
          changelog-body: ${{ steps.read-draft-body.outputs.body }}
          llm-auth: ${{ secrets.OPENAI_API_KEY }}

      # Review or transform steps.summarize.outputs.summary here before publishing,
      # for example with an approval gate or an additional formatting step.

      - id: compose-body
        env:
          SUMMARY: ${{ steps.summarize.outputs.summary }}
          CHANGELOG: ${{ steps.read-draft-body.outputs.body }}
        run: |
          {
            echo 'body<<RELEASE_EOF'
            printf '%s\n\n%s\n' "$SUMMARY" "$CHANGELOG"
            echo RELEASE_EOF
          } >> "$GITHUB_OUTPUT"

      - uses: hoverkraft-tech/ci-github-publish/actions/release/update@<sha> # x.y.z
        with:
          tag: ${{ steps.draft-release.outputs.tag }}
          body: ${{ steps.compose-body.outputs.body }}
          publish: "true"
          github-token: ${{ github.token }}
```

<!--
// jscpd:ignore-end
-->

## Artifact and Signature Links

Yes, linking the released artifacts, checksums, signatures, and provenance from the GitHub release is useful. It gives consumers one place to discover what was published and how to verify it.

Recommended rule:

- keep artifact publication and signing in caller-owned jobs
- create the GitHub release only after those immutable outputs exist
- if files are produced in an upstream job, persist them first with workflow artifacts and pass the artifact ID to `actions/release/create`
- use `actions/release/update` only when you need to mutate an already created release later

Keep artifact publication and signing outside the release actions. Artifact names, registry locations, signing format, and provenance style are still repository-specific, but attaching already prepared files during release creation is a good fit for `release/create`.

Typical examples to surface from the release:

- package or archive download URLs
- image digests or package versions in external registries
- checksum files such as `SHA256SUMS`
- detached signatures such as `.sig` or `.minisig`
- provenance or attestation documents

Recommended placement:

1. draft the GitHub release with `actions/release/create`
2. publish and sign artifacts
3. publish the release and upload assets with `actions/release/update`

## Artifact Timing

Publish an artifact before the final release draft only when its immutable metadata must be committed into release-owned files before the final release commit exists.

Otherwise, prefer this order:

1. plan the release
2. validate the source
3. prepare and merge release-owned files when needed
4. draft the GitHub release from the final release identity
5. publish artifacts from that final identity
6. publish the GitHub release with `update` after assets and final metadata are ready

That ordering keeps the release, source archive, and published artifacts aligned while avoiding a partially published release.
