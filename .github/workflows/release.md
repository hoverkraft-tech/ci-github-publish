# Release

Release in this repository is action-first. The release API is built from three focused actions:

- `actions/release/plan`
- `actions/release/create-tag`
- `actions/release/create`

That keeps release state changes explicit in the caller workflow and leaves validation, packaging, and release-file preparation under repository control.

## Core Rule

Compute the release identity early. Create the Git tag and the GitHub release only after the final release commit is known.

That means:

- run validation before any durable release state is created
- update and merge release-owned files before tagging when they belong in the released source tree
- create the GitHub release only after the final tag already exists

## Release Actions

### `actions/release/plan`

Resolve the release tag, release name, and source SHA without creating any durable release state.

### `actions/release/create-tag`

Create and push the final annotated Git tag once the final release commit is fixed.

### `actions/release/create`

Create or publish the GitHub release for an existing tag.

## Recommended Workflow

This is the recommended nominal flow. It keeps release state mutation serialized and leaves validation and artifact publication in caller-owned jobs.

```yaml
name: Release

on:
  workflow_dispatch:

permissions: {}

concurrency:
  group: release-${{ github.repository }}-${{ github.ref_name }}
  cancel-in-progress: false

jobs:
  # Compute the release identity without creating a tag or GitHub release.
  plan-release:
    name: Plan release
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    outputs:
      tag: ${{ steps.plan.outputs.tag }}
      name: ${{ steps.plan.outputs.name }}
      release-sha: ${{ steps.plan.outputs.release-sha }}
    steps:
      - id: plan
        uses: hoverkraft-tech/ci-github-publish/actions/release/plan@<sha> # x.y.z
        with:
          github-token: ${{ github.token }}

  # Prove the planned source commit is releasable before mutating release state.
  validate-source:
    name: Validate source
    runs-on: ubuntu-latest
    needs: plan-release
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
        with:
          ref: ${{ needs.plan-release.outputs.release-sha }}
      - run: make test

  # Create the final immutable Git tag for the release commit.
  create-git-tag:
    name: Create Git tag
    runs-on: ubuntu-latest
    needs: [plan-release, validate-source]
    permissions:
      contents: write
    outputs:
      tag-sha: ${{ steps.create-tag.outputs.tag-sha }}
    steps:
      - id: create-tag
        uses: hoverkraft-tech/ci-github-publish/actions/release/create-tag@<sha> # x.y.z
        with:
          release-sha: ${{ needs.plan-release.outputs.release-sha }}
          tag: ${{ needs.plan-release.outputs.tag }}
          message: ${{ needs.plan-release.outputs.name }}
          github-token: ${{ github.token }}

  # Publish packages, images, or other release artifacts from the tagged source.
  publish-release-artifacts:
    name: Publish release artifacts
    runs-on: ubuntu-latest
    needs: [plan-release, create-git-tag]
    permissions:
      contents: read
      packages: write
      attestations: write
      id-token: write
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
        with:
          ref: ${{ needs.plan-release.outputs.release-sha }}
      - run: make publish-release-artifacts RELEASE_TAG=${{ needs.plan-release.outputs.tag }}

  # Create or publish the GitHub release once the tag and artifacts exist.
  create-release:
    name: Create GitHub release
    runs-on: ubuntu-latest
    needs: [plan-release, publish-release-artifacts]
    permissions:
      contents: write
      pull-requests: read
    steps:
      - id: create-release
        uses: hoverkraft-tech/ci-github-publish/actions/release/create@<sha> # x.y.z
        with:
          tag: ${{ needs.plan-release.outputs.tag }}
          name: ${{ needs.plan-release.outputs.name }}
          target-sha: ${{ needs.plan-release.outputs.release-sha }}
          github-token: ${{ github.token }}
          changelog-summary: >-
            {"llmAuth":"${{ secrets.OPENAI_API_KEY }}"}

  # Run final verification checks against the published release outputs.
  verify-release:
    name: Verify release
    runs-on: ubuntu-latest
    needs: [plan-release, create-release]
    permissions:
      contents: read
      packages: read
    steps:
      - run: |
          echo "Verify ${{ needs.plan-release.outputs.tag }}"
```

## When Release Files Must Change

If the release process updates changelogs, version files, Helm chart values, generated chart docs, or other release-owned files, add a caller-owned preparation phase before `create-tag`.

Recommended rule:

- prepare the files in a branch
- open and merge a pull request
- switch downstream jobs to the merged commit SHA
- only then create the tag and publish artifacts that must match the final source tree

Use `hoverkraft-tech/ci-github-common/actions/create-and-merge-pull-request` for that pull-request boundary.

Example:

```yaml
  # Prepare and merge release-owned file changes before the final tag is created.
  prepare-release-files:
    name: Prepare release files
    runs-on: ubuntu-latest
    needs: [plan-release, validate-source]
    permissions:
      contents: write
      pull-requests: write
    outputs:
      release-sha: ${{ steps.final-release-sha.outputs.release-sha }}
    steps:
      - uses: actions/checkout@<sha> # vx.y.z
        with:
          ref: ${{ needs.plan-release.outputs.release-sha }}

      - name: Update release-owned files
        run: ./scripts/prepare-release-files.sh "${{ needs.plan-release.outputs.tag }}"

      - name: Detect prepared changes
        id: detect-changes
        run: |
          if git diff --quiet --exit-code; then
            echo "has-changes=false" >> "$GITHUB_OUTPUT"
          else
            echo "has-changes=true" >> "$GITHUB_OUTPUT"
          fi

      - name: Create and merge release PR
        id: create-and-merge-pr
        if: steps.detect-changes.outputs.has-changes == 'true'
        uses: hoverkraft-tech/ci-github-common/actions/create-and-merge-pull-request@<sha> # x.y.z
        with:
          github-token: ${{ github.token }}
          branch: release/prepare-${{ needs.plan-release.outputs.tag }}
          title: Prepare release files for ${{ needs.plan-release.outputs.tag }}
          body: |
            Automated release preparation for `${{ needs.plan-release.outputs.tag }}`.
          commit-message: chore(release): prepare ${{ needs.plan-release.outputs.tag }}

      - name: Select final release SHA
        id: final-release-sha
        run: |
          if [[ "${{ steps.detect-changes.outputs.has-changes }}" == "true" ]]; then
            echo "release-sha=${{ steps.create-and-merge-pr.outputs.merged-sha }}" >> "$GITHUB_OUTPUT"
          else
            echo "release-sha=${{ needs.plan-release.outputs.release-sha }}" >> "$GITHUB_OUTPUT"
          fi

  # Tag the merged release-preparation commit instead of the original planned SHA.
  create-git-tag:
    name: Create Git tag
    runs-on: ubuntu-latest
    needs: [plan-release, prepare-release-files]
    permissions:
      contents: write
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/create-tag@<sha> # x.y.z
        with:
          release-sha: ${{ needs.prepare-release-files.outputs.release-sha }}
          tag: ${{ needs.plan-release.outputs.tag }}
          message: ${{ needs.plan-release.outputs.name }}
          github-token: ${{ github.token }}
```

## Artifact Timing

Publish an artifact before the Git tag only when its immutable metadata must be committed into release-owned files before the final release commit exists.

Otherwise, prefer this order:

1. plan the release
2. validate the source
3. create the final tag from the final release commit
4. publish artifacts from that final identity
5. create the GitHub release

That ordering keeps the tag, release, source archive, and published artifacts aligned.
