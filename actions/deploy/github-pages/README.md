<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXBsb2FkLWNsb3VkIiBjb2xvcj0iYmx1ZSI+PHBvbHlsaW5lIHBvaW50cz0iMTYgMTYgMTIgMTIgOCAxNiI+PC9wb2x5bGluZT48bGluZSB4MT0iMTIiIHkxPSIxMiIgeDI9IjEyIiB5Mj0iMjEiPjwvbGluZT48cGF0aCBkPSJNMjAuMzkgMTguMzlBNSA1IDAgMCAwIDE4IDloLTEuMjZBOCA4IDAgMSAwIDMgMTYuMyI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE2IDE2IDEyIDEyIDggMTYiPjwvcG9seWxpbmU+PC9zdmc+) GitHub Action: Deploy - GitHub Pages

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deploy - GitHub Pages" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deploy------github--pages-blue?logo=github-actions)](https://github.com/marketplace/actions/deploy---github-pages)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)

<!-- badges:end -->

<!--
// jscpd:ignore-start
-->

<!-- overview:start -->

## Overview

Action to deploy a static site to GitHub Pages.

<!-- overview:end -->

## Permissions

Set permissions to deploy to pages.

```yaml
permissions:
  pages: write
  id-token: write
```

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deploy/github-pages@5358acdb08b912114974ecc06a057cda8d391aa5 # 0.17.0
  with:
    # The path to the assets to deploy.
    # Can be absolute or relative $GITHUB_WORKSPACE.
    build-path: ""

    # The ID of the "build" artifact to download.
    # If not set, the action will use the local workspace files.
    build-artifact-id: ""

    # The path to the performance budget file. See action [Check - URL - Lighthouse](../../check/url-lighthouse/README.md).
    # Default: `./budget.json`
    budget-path: ./budget.json

    # The static site generator used to build the site. See https://github.com/actions/configure-pages.
    static-site-generator: ""

    # GitHub Token for deploying to GitHub Pages.
    # Permissions:
    # - pages: write
    # - id-token: write
    # See https://github.com/actions/deploy-pages.
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**                   | **Description**                                                                                                       | **Required** | **Default**             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------- |
| **`build-path`**            | The path to the assets to deploy.                                                                                     | **false**    | -                       |
|                             | Can be absolute or relative $GITHUB_WORKSPACE.                                                                        |              |                         |
| **`build-artifact-id`**     | The ID of the "build" artifact to download.                                                                           | **false**    | -                       |
|                             | If not set, the action will use the local workspace files.                                                            |              |                         |
| **`budget-path`**           | The path to the performance budget file. See action [Check - URL - Lighthouse](../../check/url-lighthouse/README.md). | **false**    | `./budget.json`         |
| **`static-site-generator`** | The static site generator used to build the site. See <https://github.com/actions/configure-pages>.                   | **false**    | -                       |
| **`github-token`**          | GitHub Token for deploying to GitHub Pages.                                                                           | **false**    | `$\{\{ github.token }}` |
|                             | Permissions:                                                                                                          |              |                         |
|                             | - pages: write                                                                                                        |              |                         |
|                             | - id-token: write                                                                                                     |              |                         |
|                             | See <https://github.com/actions/deploy-pages>.                                                                        |              |                         |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output** | **Description**               |
| ---------- | ----------------------------- |
| **`url`**  | The URL of the deployed site. |

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
