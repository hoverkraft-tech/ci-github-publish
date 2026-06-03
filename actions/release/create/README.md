<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9va21hcmsiIGNvbG9yPSJibHVlIj48cGF0aCBkPSJNMTkgMjFsLTctNS03IDVWNWEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ6Ij48L3BhdGg+PC9zdmc+) GitHub Action: Release - Create

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Release - Create" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-release------create-blue?logo=github-actions)](https://github.com/marketplace/actions/release---create)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)
![GitHub Verified Creator](https://img.shields.io/badge/GitHub-Verified%20Creator-4493F8?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJyZ2IoNjgsIDE0NywgMjQ4KSI+CiAgPHBhdGggZD0ibTkuNTg1LjUyLjkyOS42OGMuMTUzLjExMi4zMzEuMTg2LjUxOC4yMTVsMS4xMzguMTc1YTIuNjc4IDIuNjc4IDAgMCAxIDIuMjQgMi4yNGwuMTc0IDEuMTM5Yy4wMjkuMTg3LjEwMy4zNjUuMjE1LjUxOGwuNjguOTI4YTIuNjc3IDIuNjc3IDAgMCAxIDAgMy4xN2wtLjY4LjkyOGExLjE3NCAxLjE3NCAwIDAgMC0uMjE1LjUxOGwtLjE3NSAxLjEzOGEyLjY3OCAyLjY3OCAwIDAgMS0yLjI0MSAyLjI0MWwtMS4xMzguMTc1YTEuMTcgMS4xNyAwIDAgMC0uNTE4LjIxNWwtLjkyOC42OGEyLjY3NyAyLjY3NyAwIDAgMS0zLjE3IDBsLS45MjgtLjY4YTEuMTc0IDEuMTc0IDAgMCAwLS41MTgtLjIxNUwzLjgzIDE0LjQxYTIuNjc4IDIuNjc4IDAgMCAxLTIuMjQtMi4yNGwtLjE3NS0xLjEzOGExLjE3IDEuMTcgMCAwIDAtLjIxNS0uNTE4bC0uNjgtLjkyOGEyLjY3NyAyLjY3NyAwIDAgMSAwLTMuMTdsLjY4LS45MjhjLjExMi0uMTUzLjE4Ni0uMzMxLjIxNS0uNTE4bC4xNzUtMS4xNGEyLjY3OCAyLjY3OCAwIDAgMSAyLjI0LTIuMjRsMS4xMzktLjE3NWMuMTg3LS4wMjkuMzY1LS4xMDMuNTE4LS4yMTVsLjkyOC0uNjhhMi42NzcgMi42NzcgMCAwIDEgMy4xNyAwWk03LjMwMyAxLjcyOGwtLjkyNy42OGEyLjY3IDIuNjcgMCAwIDEtMS4xOC40ODlsLTEuMTM3LjE3NGExLjE3OSAxLjE3OSAwIDAgMC0uOTg3Ljk4N2wtLjE3NCAxLjEzNmEyLjY3NyAyLjY3NyAwIDAgMS0uNDg5IDEuMThsLS42OC45MjhhMS4xOCAxLjE4IDAgMCAwIDAgMS4zOTRsLjY4LjkyN2MuMjU2LjM0OC40MjQuNzUzLjQ4OSAxLjE4bC4xNzQgMS4xMzdjLjA3OC41MDkuNDc4LjkwOS45ODcuOTg3bDEuMTM2LjE3NGEyLjY3IDIuNjcgMCAwIDEgMS4xOC40ODlsLjkyOC42OGMuNDE0LjMwNS45NzkuMzA1IDEuMzk0IDBsLjkyNy0uNjhhMi42NyAyLjY3IDAgMCAxIDEuMTgtLjQ4OWwxLjEzNy0uMTc0YTEuMTggMS4xOCAwIDAgMCAuOTg3LS45ODdsLjE3NC0xLjEzNmEyLjY3IDIuNjcgMCAwIDEgLjQ4OS0xLjE4bC42OC0uOTI4YTEuMTc2IDEuMTc2IDAgMCAwIDAtMS4zOTRsLS42OC0uOTI3YTIuNjg2IDIuNjg2IDAgMCAxLS40ODktMS4xOGwtLjE3NC0xLjEzN2ExLjE3OSAxLjE3OSAwIDAgMC0uOTg3LS45ODdsLTEuMTM2LS4xNzRhMi42NzcgMi42NzcgMCAwIDEtMS4xOC0uNDg5bC0uOTI4LS42OGExLjE3NiAxLjE3NiAwIDAgMC0xLjM5NCAwWk0xMS4yOCA2Ljc4bC0zLjc1IDMuNzVhLjc1Ljc1IDAgMCAxLTEuMDYgMEw0LjcyIDguNzhhLjc1MS43NTEgMCAwIDEgLjAxOC0xLjA0Mi43NTEuNzUxIDAgMCAxIDEuMDQyLS4wMThMNyA4Ljk0bDMuMjItMy4yMmEuNzUxLjc1MSAwIDAgMSAxLjA0Mi4wMTguNzUxLjc1MSAwIDAgMSAuMDE4IDEuMDQyWiI+PC9wYXRoPgo8L3N2Zz4K)

<!-- badges:end -->

<!-- overview:start -->

## Overview

Create or refresh a GitHub release from Release Drafter or from explicit release inputs.
The release is published by default after optional changelog summarization and asset upload succeed.

<!-- overview:end -->

<!-- usage:start -->

## Usage

````yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/create@84d583ba7b357f9476707f54cf5419d630ae0145 # 0.26.2
  with:
    # Whether the release is a prerelease
    # Default: `false`
    prerelease: "false"

    # Working directory used to scope release automation in a monorepo.
    # If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.
    # If that file does not exist, a temporary release configuration is generated with `include-paths` for the working directory and current workflow file.
    working-directory: ""

    # Additional paths to include in the release notes filtering (JSON array).
    # These paths are added to the `include-paths` configuration of release-drafter.
    #
    # Default: `[]`
    include-paths: "[]"

    # Release tag name to use in explicit mode
    tag: ""

    # Optional commit SHA or branch name to target when explicit mode creates a release for a tag that does not already exist.
    # Forwarded to Release Drafter as `commitish`.
    target-sha: ""

    # GitHub Token for creating the draft release.
    # Permissions:
    # - contents: write
    # - pull-requests: read
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}

    # Skip creating or updating the draft release when no changes are detected since the latest relevant published release.
    # In Release Drafter mode, detection respects the configured release filters such as `working-directory` and `include-paths`.
    #
    # Default: `false`
    skip-if-no-changes: "false"

    # Optional JSON-serialized configuration used to generate and prepend a release summary to the drafted release notes.
    # When provided, the action summarizes the changelog body returned by release-drafter, then updates the draft release body to include the summary above the full changelog.
    # Supported properties:
    # - llmAuth (required)
    # - llmProvider (optional, default: `openai`)
    # - llmModel (optional, default: `gpt-5.4`)
    # - llmConfig (optional object or JSON string forwarded to `release/summarize-changelog`)
    # - workingDirectory (optional, default: `working-directory` input or `.`)
    # - summaryTemplate (optional template forwarded to `release/summarize-changelog`)
    #
    # See: [`release/summarize-changelog` action inputs](../summarize-changelog/README.md) for details on the summarization configuration.
    #
    # Example value:
    #
    # ```json
    # {
    # "llmAuth": "$\{{ secrets.OPENAI_API_KEY }}",
    # "llmProvider": "openai",
    # "llmModel": "gpt-5.4",
    # }
    # ```
    changelog-summary: ""

    # Optional workflow artifact ID containing files to upload as GitHub release assets after the draft release is created or updated.
    # The artifact is downloaded automatically before upload.
    # Prefer `actions/release/update` when you only need to mutate an existing release.
    release-artifact-id: ""

    # Whether to publish the release after changelog and asset updates succeed.
    # When disabled, the release remains a draft.
    #
    # Default: `true`
    publish: "true"
````

<!-- usage:end -->

<!--
// jscpd:ignore-start
-->

<!-- inputs:start -->

## Inputs

| **Input**                 | **Description**                                                                                                                                                                             | **Required** | **Default**           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`prerelease`**          | Whether the release is a prerelease                                                                                                                                                         | **false**    | `false`               |
| **`working-directory`**   | Working directory used to scope release automation in a monorepo.                                                                                                                           | **false**    | -                     |
|                           | If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.                                                       |              |                       |
|                           | If that file does not exist, a temporary release configuration is generated with `include-paths` for the working directory and current workflow file.                                       |              |                       |
| **`include-paths`**       | Additional paths to include in the release notes filtering (JSON array).                                                                                                                    | **false**    | `[]`                  |
|                           | These paths are added to the `include-paths` configuration of release-drafter.                                                                                                              |              |                       |
| **`tag`**                 | Release tag name to use in explicit mode                                                                                                                                                    | **false**    | -                     |
| **`target-sha`**          | Optional commit SHA or branch name to target when explicit mode creates a release for a tag that does not already exist.                                                                    | **false**    | -                     |
|                           | Forwarded to Release Drafter as `commitish`.                                                                                                                                                |              |                       |
| **`github-token`**        | GitHub Token for creating the draft release.                                                                                                                                                | **false**    | `${{ github.token }}` |
|                           | Permissions:                                                                                                                                                                                |              |                       |
|                           | - contents: write                                                                                                                                                                           |              |                       |
|                           | - pull-requests: read                                                                                                                                                                       |              |                       |
| **`skip-if-no-changes`**  | Skip creating or updating the draft release when no changes are detected since the latest relevant published release.                                                                       | **false**    | `false`               |
|                           | In Release Drafter mode, detection respects the configured release filters such as `working-directory` and `include-paths`.                                                                 |              |                       |
| **`changelog-summary`**   | Optional JSON-serialized configuration used to generate and prepend a release summary to the drafted release notes.                                                                         | **false**    | -                     |
|                           | When provided, the action summarizes the changelog body returned by release-drafter, then updates the draft release body to include the summary above the full changelog.                   |              |                       |
|                           | Supported properties:                                                                                                                                                                       |              |                       |
|                           | - llmAuth (required)                                                                                                                                                                        |              |                       |
|                           | - llmProvider (optional, default: `openai`)                                                                                                                                                 |              |                       |
|                           | - llmModel (optional, default: `gpt-5.4`)                                                                                                                                                   |              |                       |
|                           | - llmConfig (optional object or JSON string forwarded to `release/summarize-changelog`)                                                                                                     |              |                       |
|                           | - workingDirectory (optional, default: `working-directory` input or `.`)                                                                                                                    |              |                       |
|                           | - summaryTemplate (optional template forwarded to `release/summarize-changelog`)                                                                                                            |              |                       |
|                           |                                                                                                                                                                                             |              |                       |
|                           | See: [`release/summarize-changelog` action inputs](../summarize-changelog/README.md) for details on the summarization configuration.                                                        |              |                       |
|                           |                                                                                                                                                                                             |              |                       |
|                           | Example value:                                                                                                                                                                              |              |                       |
|                           |                                                                                                                                                                                             |              |                       |
|                           | <!-- textlint-disable --><pre lang="json">{&#13; "llmAuth": "$\{{ secrets.OPENAI_API_KEY }}",&#13; "llmProvider": "openai",&#13; "llmModel": "gpt-5.4",&#13;}</pre><!-- textlint-enable --> |              |                       |
| **`release-artifact-id`** | Optional workflow artifact ID containing files to upload as GitHub release assets after the draft release is created or updated.                                                            | **false**    | -                     |
|                           | The artifact is downloaded automatically before upload.                                                                                                                                     |              |                       |
|                           | Prefer `actions/release/update` when you only need to mutate an existing release.                                                                                                           |              |                       |
| **`publish`**             | Whether to publish the release after changelog and asset updates succeed.                                                                                                                   | **false**    | `true`                |
|                           | When disabled, the release remains a draft.                                                                                                                                                 |              |                       |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output** | **Description**        |
| ---------- | ---------------------- |
| **`tag`**  | The tag of the release |

<!-- outputs:end -->

This action creates or refreshes the release as a draft first, then publishes it by default after all requested summary and asset updates succeed. Set `publish` to `false` to keep the release as a draft.

When `changelog-summary` is provided, the action summarizes the drafted changelog body with [release/summarize-changelog](../summarize-changelog/README.md) and prepends the generated summary above the drafted release notes.

When `release-artifact-id` is provided, the action uploads the downloaded artifact files as release assets during release creation or refresh.

For mutating an existing release after creation, prefer [release/update](../update/README.md).

<!-- secrets:start -->
<!-- secrets:end -->

<!-- examples:start -->
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

<!--
// jscpd:ignore-end
-->
