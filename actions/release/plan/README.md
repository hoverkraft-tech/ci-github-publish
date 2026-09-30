<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9va21hcmsiIGNvbG9yPSJibHVlIj48cGF0aCBkPSJNMTkgMjFsLTctNS03IDVWNWEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ6Ij48L3BhdGg+PC9zdmc+) GitHub Action: Release - Plan

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Release - Plan" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-release------plan-blue?logo=github-actions)](https://github.com/marketplace/actions/release---plan)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)
![GitHub Verified Creator](https://img.shields.io/badge/GitHub-Verified%20Creator-4493F8?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJyZ2IoNjgsIDE0NywgMjQ4KSI+CiAgPHBhdGggZD0ibTkuNTg1LjUyLjkyOS42OGMuMTUzLjExMi4zMzEuMTg2LjUxOC4yMTVsMS4xMzguMTc1YTIuNjc4IDIuNjc4IDAgMCAxIDIuMjQgMi4yNGwuMTc0IDEuMTM5Yy4wMjkuMTg3LjEwMy4zNjUuMjE1LjUxOGwuNjguOTI4YTIuNjc3IDIuNjc3IDAgMCAxIDAgMy4xN2wtLjY4LjkyOGExLjE3NCAxLjE3NCAwIDAgMC0uMjE1LjUxOGwtLjE3NSAxLjEzOGEyLjY3OCAyLjY3OCAwIDAgMS0yLjI0MSAyLjI0MWwtMS4xMzguMTc1YTEuMTcgMS4xNyAwIDAgMC0uNTE4LjIxNWwtLjkyOC42OGEyLjY3NyAyLjY3NyAwIDAgMS0zLjE3IDBsLS45MjgtLjY4YTEuMTc0IDEuMTc0IDAgMCAwLS41MTgtLjIxNUwzLjgzIDE0LjQxYTIuNjc4IDIuNjc4IDAgMCAxLTIuMjQtMi4yNGwtLjE3NS0xLjEzOGExLjE3IDEuMTcgMCAwIDAtLjIxNS0uNTE4bC0uNjgtLjkyOGEyLjY3NyAyLjY3NyAwIDAgMSAwLTMuMTdsLjY4LS45MjhjLjExMi0uMTUzLjE4Ni0uMzMxLjIxNS0uNTE4bC4xNzUtMS4xNGEyLjY3OCAyLjY3OCAwIDAgMSAyLjI0LTIuMjRsMS4xMzktLjE3NWMuMTg3LS4wMjkuMzY1LS4xMDMuNTE4LS4yMTVsLjkyOC0uNjhhMi42NzcgMi42NzcgMCAwIDEgMy4xNyAwWk03LjMwMyAxLjcyOGwtLjkyNy42OGEyLjY3IDIuNjcgMCAwIDEtMS4xOC40ODlsLTEuMTM3LjE3NGExLjE3OSAxLjE3OSAwIDAgMC0uOTg3Ljk4N2wtLjE3NCAxLjEzNmEyLjY3NyAyLjY3NyAwIDAgMS0uNDg5IDEuMThsLS42OC45MjhhMS4xOCAxLjE4IDAgMCAwIDAgMS4zOTRsLjY4LjkyN2MuMjU2LjM0OC40MjQuNzUzLjQ4OSAxLjE4bC4xNzQgMS4xMzdjLjA3OC41MDkuNDc4LjkwOS45ODcuOTg3bDEuMTM2LjE3NGEyLjY3IDIuNjcgMCAwIDEgMS4xOC40ODlsLjkyOC42OGMuNDE0LjMwNS45NzkuMzA1IDEuMzk0IDBsLjkyNy0uNjhhMi42NyAyLjY3IDAgMCAxIDEuMTgtLjQ4OWwxLjEzNy0uMTc0YTEuMTggMS4xOCAwIDAgMCAuOTg3LS45ODdsLjE3NC0xLjEzNmEyLjY3IDIuNjcgMCAwIDEgLjQ4OS0xLjE4bC42OC0uOTI4YTEuMTc2IDEuMTc2IDAgMCAwIDAtMS4zOTRsLS42OC0uOTI3YTIuNjg2IDIuNjg2IDAgMCAxLS40ODktMS4xOGwtLjE3NC0xLjEzN2ExLjE3OSAxLjE3OSAwIDAgMC0uOTg3LS45ODdsLTEuMTM2LS4xNzRhMi42NzcgMi42NzcgMCAwIDEtMS4xOC0uNDg5bC0uOTI4LS42OGExLjE3NiAxLjE3NiAwIDAgMC0xLjM5NCAwWk0xMS4yOCA2Ljc4bC0zLjc1IDMuNzVhLjc1Ljc1IDAgMCAxLTEuMDYgMEw0LjcyIDguNzhhLjc1MS43NTEgMCAwIDEgLjAxOC0xLjA0Mi43NTEuNzUxIDAgMCAxIDEuMDQyLS4wMThMNyA4Ljk0bDMuMjItMy4yMmEuNzUxLjc1MSAwIDAgMSAxLjA0Mi4wMTguNzUxLjc1MSAwIDAgMSAuMDE4IDEuMDQyWiI+PC9wYXRoPgo8L3N2Zz4K)

<!-- badges:end -->

<!-- overview:start -->

## Overview

Detect release changes and plan a release identity without creating a Git tag or GitHub release.

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/plan@a0a9d185c51c10710a5987822e78feb2b5ce1932 # 0.29.0
  with:
    # Whether to plan the release as a prerelease
    # Default: `false`
    prerelease: "false"

    # Working directory used to scope release automation in a monorepo.
    # If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.
    # If that file does not exist, a temporary release configuration is generated with `include-paths` for the working directory and current workflow file.
    # The generated defaults follow Conventional Commits and Semantic Versioning: breaking changes increment major, `feat` increments minor, and all other changes increment patch.
    # They also define Conventional Commit labels.
    # They credit co-authors and highlight new contributors, with an explicit empty state when there are none.
    working-directory: ""

    # Additional paths to include in the release notes filtering (JSON array).
    # These paths are added to the `include-paths` configuration of release-drafter.
    #
    # Default: `[]`
    include-paths: "[]"

    # Optional branch, commit SHA, fully qualified tag ref, or pull request ref to plan from.
    # Forwarded to Release Drafter as `commitish`; tag and pull request refs are resolved to commit SHAs.
    target-sha: ""

    # GitHub Token for planning the release.
    # Permissions:
    # - contents: read
    # - pull-requests: read
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**               | **Description**                                                                                                                                                               | **Required** | **Default**           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`prerelease`**        | Whether to plan the release as a prerelease                                                                                                                                   | **false**    | `false`               |
| **`working-directory`** | Working directory used to scope release automation in a monorepo.                                                                                                             | **false**    | -                     |
|                         | If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.                                         |              |                       |
|                         | If that file does not exist, a temporary release configuration is generated with `include-paths` for the working directory and current workflow file.                         |              |                       |
|                         | The generated defaults follow Conventional Commits and Semantic Versioning: breaking changes increment major, `feat` increments minor, and all other changes increment patch. |              |                       |
|                         | They also define Conventional Commit labels.                                                                                                                                  |              |                       |
|                         | They credit co-authors and highlight new contributors, with an explicit empty state when there are none.                                                                      |              |                       |
| **`include-paths`**     | Additional paths to include in the release notes filtering (JSON array).                                                                                                      | **false**    | `[]`                  |
|                         | These paths are added to the `include-paths` configuration of release-drafter.                                                                                                |              |                       |
| **`target-sha`**        | Optional branch, commit SHA, fully qualified tag ref, or pull request ref to plan from.                                                                                       | **false**    | -                     |
|                         | Forwarded to Release Drafter as `commitish`; tag and pull request refs are resolved to commit SHAs.                                                                           |              |                       |
| **`github-token`**      | GitHub Token for planning the release.                                                                                                                                        | **false**    | `${{ github.token }}` |
|                         | Permissions:                                                                                                                                                                  |              |                       |
|                         | - contents: read                                                                                                                                                              |              |                       |
|                         | - pull-requests: read                                                                                                                                                         |              |                       |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output**        | **Description**                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **`has-changes`** | Whether the release has relevant changes, or no previous matching release exists (true or false) |
| **`tag`**         | The planned release tag, including when there are no relevant changes                            |
| **`name`**        | The planned release name, including when there are no relevant changes                           |

<!-- outputs:end -->

<!-- secrets:start -->
<!-- secrets:end -->

<!-- examples:start -->

## Examples

## Scheduled and manual releases

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
  group: release-${{ github.repository }}
  cancel-in-progress: false

jobs:
  plan:
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
        uses: hoverkraft-tech/ci-github-publish/actions/release/plan@a0a9d185c51c10710a5987822e78feb2b5ce1932 # 0.29.0

  release:
    needs: plan
    if: needs.plan.outputs.should-release == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: read
    steps:
      - uses: hoverkraft-tech/ci-github-publish/actions/release/create@ed354ada70b9f518c2bb663e18a80041c2cf5156 # 0.27.1
        with:
          tag: ${{ needs.plan.outputs.tag }}
          target-sha: ${{ github.sha }}
```

Scheduled runs happen on Mondays at 08:25 UTC and skip unchanged releases.

Manual runs skip unchanged releases by default; select `force` to request the planned version anyway.

The `force` input and `should-release` job output belong to this caller workflow.

Apply the same `should-release` guard to validation, packaging, and registry publishing jobs that depend on planning.

A `skip-if-no-changes` check during release creation happens too late to prevent packages from being published by earlier steps.

<!-- examples:end -->

<!-- contributing:start -->

## Contributing

Contributions are welcome! Please see the [contributing guidelines](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md) for more details.

<!-- contributing:end -->

<!-- security:start -->
<!-- security:end -->

<!-- license:start -->

## License

This project is licensed under the MIT License.

SPDX-License-Identifier: MIT

Copyright © 2026 hoverkraft

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->
