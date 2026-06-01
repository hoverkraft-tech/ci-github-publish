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
[![codecov](https://codecov.io/gh/hoverkraft-tech/compose-action/graph/badge.svg?token=90JXB7EIMA)](https://codecov.io/gh/hoverkraft-tech/compose-action)

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
