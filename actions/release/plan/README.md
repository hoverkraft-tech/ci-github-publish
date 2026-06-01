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
[![codecov](https://codecov.io/gh/hoverkraft-tech/compose-action/graph/badge.svg?token=90JXB7EIMA)](https://codecov.io/gh/hoverkraft-tech/compose-action)

<!-- badges:end -->

<!-- overview:start -->

## Overview

Plan a release identity without creating a Git tag or GitHub release.

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/plan@ba941863a698984b6596e760f4e7727beea81167 # 0.26.0
  with:
    # Whether to plan the release as a prerelease
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

| **Input**               | **Description**                                                                                                                                       | **Required** | **Default**           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`prerelease`**        | Whether to plan the release as a prerelease                                                                                                           | **false**    | `false`               |
| **`working-directory`** | Working directory used to scope release automation in a monorepo.                                                                                     | **false**    | -                     |
|                         | If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.                 |              |                       |
|                         | If that file does not exist, a temporary release configuration is generated with `include-paths` for the working directory and current workflow file. |              |                       |
| **`include-paths`**     | Additional paths to include in the release notes filtering (JSON array).                                                                              | **false**    | `[]`                  |
|                         | These paths are added to the `include-paths` configuration of release-drafter.                                                                        |              |                       |
| **`github-token`**      | GitHub Token for planning the release.                                                                                                                | **false**    | `${{ github.token }}` |
|                         | Permissions:                                                                                                                                          |              |                       |
|                         | - contents: read                                                                                                                                      |              |                       |
|                         | - pull-requests: read                                                                                                                                 |              |                       |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output** | **Description**          |
| ---------- | ------------------------ |
| **`tag`**  | The planned release tag  |
| **`name`** | The planned release name |

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
