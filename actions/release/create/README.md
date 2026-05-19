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

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/create@281fe4959997eea619bf3a4be4fde2f16b8b6d0c # 0.23.3
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
```

<!-- usage:end -->

<!--
// jscpd:ignore-start
-->

<!-- inputs:start -->

## Inputs

| **Input**               | **Description**                                                                                                                                       | **Required** | **Default**           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`prerelease`**        | Whether the release is a prerelease                                                                                                                   | **false**    | `false`               |
| **`working-directory`** | Working directory used to scope release automation in a monorepo.                                                                                     | **false**    | -                     |
|                         | If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.                 |              |                       |
|                         | If that file does not exist, a temporary release configuration is generated with `include-paths` for the working directory and current workflow file. |              |                       |
| **`include-paths`**     | Additional paths to include in the release notes filtering (JSON array).                                                                              | **false**    | `[]`                  |
|                         | These paths are added to the `include-paths` configuration of release-drafter.                                                                        |              |                       |
| **`tag`**               | Tag name to associate with the GitHub release                                                                                                         | **false**    | -                     |
| **`name`**              | Name to use for the GitHub release                                                                                                                    | **false**    | -                     |
| **`target-sha`**        | Commit SHA the GitHub release should target                                                                                                           | **false**    | -                     |
| **`github-token`**      | GitHub Token for creating the release.                                                                                                                | **false**    | `${{ github.token }}` |
|                         | Permissions:                                                                                                                                          |              |                       |
|                         | - contents: write                                                                                                                                     |              |                       |
|                         | - pull-requests: read                                                                                                                                 |              |                       |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output** | **Description**        |
| ---------- | ---------------------- |
| **`tag`**  | The tag of the release |

<!-- outputs:end -->

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
