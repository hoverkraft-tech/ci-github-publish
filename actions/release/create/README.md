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

Action to create a new release

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/create@fcfe73575a3809b254acb6004cd42741f20b931a # main
  with:
    # Whether the release is a prerelease
    # Default: `false`
    prerelease: "false"

    # Working directory for monorepo support.
    # If specified, the release configuration file will be placed in `.github/release-configs/{slug}.yml` where slug is derived from the working directory path.
    # The configuration will include `include-paths` to filter pull requests to only those that modified files in the specified directory.
    working-directory: ""

    # GitHub Token for creating the release.
    # Permissions:
    # - contents: write
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

| **Input**               | **Description**                                                                                                                                            | **Required** | **Default**             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------- |
| **`prerelease`**        | Whether the release is a prerelease                                                                                                                        | **false**    | `false`                 |
| **`working-directory`** | Working directory for monorepo support.                                                                                                                    | **false**    | -                       |
|                         | If specified, the release configuration file will be placed in `.github/release-configs/{slug}.yml` where slug is derived from the working directory path. |              |                         |
|                         | The configuration will include `include-paths` to filter pull requests to only those that modified files in the specified directory.                       |              |                         |
| **`github-token`**      | GitHub Token for creating the release.                                                                                                                     | **false**    | `$\{\{ github.token }}` |
|                         | Permissions:                                                                                                                                               |              |                         |
|                         | - contents: write                                                                                                                                          |              |                         |

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

Copyright © 2025 hoverkraft

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->

<!--
// jscpd:ignore-end
-->
