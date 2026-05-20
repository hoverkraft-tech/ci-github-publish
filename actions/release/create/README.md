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

<!-- badges:end -->

<!-- overview:start -->

## Overview

Create a GitHub release from Release Drafter or from an explicit tag, name, and target SHA.
With optional changelog summarization prepended to the published notes.

<!-- overview:end -->

<!-- usage:start -->

## Usage

````yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/create@6a2562a3f4409f39c7fab100636a90430ee0a8cf # 0.24.0
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

    # Tag name to associate with the GitHub release
    tag: ""

    # Name to use for the GitHub release
    name: ""

    # Commit SHA the GitHub release should target
    target-sha: ""

    # GitHub Token for creating the release.
    # Permissions:
    # - contents: write
    # - pull-requests: read
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}

    # Optional JSON-serialized configuration used to generate and prepend a release summary to the published release notes.
    # When provided, the action summarizes the changelog body returned by release-drafter, then updates the created release body to include the summary above the full changelog.
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
````

<!-- usage:end -->

<!--
// jscpd:ignore-start
-->

<!-- inputs:start -->

## Inputs

| **Input**               | **Description**                                                                                                                                                                             | **Required** | **Default**           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`prerelease`**        | Whether the release is a prerelease                                                                                                                                                         | **false**    | `false`               |
| **`working-directory`** | Working directory used to scope release automation in a monorepo.                                                                                                                           | **false**    | -                     |
|                         | If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.                                                       |              |                       |
|                         | If that file does not exist, a temporary release configuration is generated with `include-paths` for the working directory and current workflow file.                                       |              |                       |
| **`include-paths`**     | Additional paths to include in the release notes filtering (JSON array).                                                                                                                    | **false**    | `[]`                  |
|                         | These paths are added to the `include-paths` configuration of release-drafter.                                                                                                              |              |                       |
| **`tag`**               | Tag name to associate with the GitHub release                                                                                                                                               | **false**    | -                     |
| **`name`**              | Name to use for the GitHub release                                                                                                                                                          | **false**    | -                     |
| **`target-sha`**        | Commit SHA the GitHub release should target                                                                                                                                                 | **false**    | -                     |
| **`github-token`**      | GitHub Token for creating the release.                                                                                                                                                      | **false**    | `${{ github.token }}` |
|                         | Permissions:                                                                                                                                                                                |              |                       |
|                         | - contents: write                                                                                                                                                                           |              |                       |
|                         | - pull-requests: read                                                                                                                                                                       |              |                       |
| **`changelog-summary`** | Optional JSON-serialized configuration used to generate and prepend a release summary to the published release notes.                                                                       | **false**    | -                     |
|                         | When provided, the action summarizes the changelog body returned by release-drafter, then updates the created release body to include the summary above the full changelog.                 |              |                       |
|                         | Supported properties:                                                                                                                                                                       |              |                       |
|                         | - llmAuth (required)                                                                                                                                                                        |              |                       |
|                         | - llmProvider (optional, default: `openai`)                                                                                                                                                 |              |                       |
|                         | - llmModel (optional, default: `gpt-5.4`)                                                                                                                                                   |              |                       |
|                         | - llmConfig (optional object or JSON string forwarded to `release/summarize-changelog`)                                                                                                     |              |                       |
|                         | - workingDirectory (optional, default: `working-directory` input or `.`)                                                                                                                    |              |                       |
|                         | - summaryTemplate (optional template forwarded to `release/summarize-changelog`)                                                                                                            |              |                       |
|                         |                                                                                                                                                                                             |              |                       |
|                         | See: [`release/summarize-changelog` action inputs](../summarize-changelog/README.md) for details on the summarization configuration.                                                        |              |                       |
|                         |                                                                                                                                                                                             |              |                       |
|                         | Example value:                                                                                                                                                                              |              |                       |
|                         |                                                                                                                                                                                             |              |                       |
|                         | <!-- textlint-disable --><pre lang="json">{&#13; "llmAuth": "$\{{ secrets.OPENAI_API_KEY }}",&#13; "llmProvider": "openai",&#13; "llmModel": "gpt-5.4",&#13;}</pre><!-- textlint-enable --> |              |                       |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output** | **Description**        |
| ---------- | ---------------------- |
| **`tag`**  | The tag of the release |

<!-- outputs:end -->

When `changelog-summary` is provided, the action summarizes the drafted changelog body with [release/summarize-changelog](../summarize-changelog/README.md) and prepends the generated summary above the full release notes.

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
