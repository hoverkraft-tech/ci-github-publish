# Release

Release in this repository is action-first. The release API is built from three focused actions:

- `actions/release/plan`
- `actions/release/create`
- `actions/release/update`

That keeps release state changes explicit in the caller workflow and leaves validation, packaging, and release-file preparation under repository control.

## Core Rule

Compute the release identity early. Publish the GitHub release only after the final release body and assets are ready.

That means:

- run validation before any durable release state is created
- update and merge release-owned files before drafting the final release when they belong in the released source tree
- prefer a single `actions/release/create` step for the simplest validate-and-release flow
- publish the GitHub release only after draft updates and asset uploads are complete

## Release Actions

### `actions/release/plan`

Resolve the release tag and release name without creating any durable release state.

### `actions/release/create`

Create or refresh the GitHub release from Release Drafter or from explicit release inputs, with optional initial asset upload and optional publish.

### `actions/release/update`

Update an existing GitHub release body, upload release assets, and optionally publish an already created release for an existing tag.

## Workflow Examples

Choose the smallest workflow that fits the repository. Copy Example 1 first, add Example 2 only when artifacts must be built from the final release identity, and add Example 3 only when the released source tree must change before the release can be drafted.

Use `actions/release/create` alone when the workflow only needs to validate and publish a release. Add `actions/release/plan` only when later jobs need the release identity before the release can be drafted.

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
  workflow_dispatch:

permissions: {}

concurrency:
  group: release-${{ github.repository }}-${{ github.ref_name }}
  cancel-in-progress: false

jobs:
  plan-release:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    outputs:
      tag: ${{ steps.plan.outputs.tag }}
    steps:
      - id: plan
        uses: hoverkraft-tech/ci-github-publish/actions/release/plan@<sha> # x.y.z
        with:
          github-token: ${{ github.token }}

  validate-source:
    runs-on: ubuntu-latest
    needs: plan-release
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
      - run: make test

  prepare-release-files:
    runs-on: ubuntu-latest
    needs: [plan-release, validate-source]
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
