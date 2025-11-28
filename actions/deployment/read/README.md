<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItbGlzdCIgY29sb3I9ImJsdWUiPjxsaW5lIHgxPSI4IiB5MT0iNiIgeDI9IjIxIiB5Mj0iNiI+PC9saW5lPjxsaW5lIHgxPSI4IiB5MT0iMTIiIHgyPSIyMSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjgiIHkxPSIxOCIgeDI9IjIxIiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMyIgeTE9IjYiIHgyPSIzLjAxIiB5Mj0iNiI+PC9saW5lPjxsaW5lIHgxPSIzIiB5MT0iMTIiIHgyPSIzLjAxIiB5Mj0iMTIiPjwvbGluZT48bGluZSB4MT0iMyIgeTE9IjE4IiB4Mj0iMy4wMSIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+) GitHub Action: Deployment - Read deployment

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deployment - Read deployment" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deployment------read--deployment-blue?logo=github-actions)](https://github.com/marketplace/actions/deployment---read-deployment)
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

Action to retrieve some deployment information.

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deployment/read@5358acdb08b912114974ecc06a057cda8d391aa5 # 0.17.0
  with:
    # The ID of the deployment to update
    # This input is required.
    deployment-id: ""

    # The repository where the deployment was made
    # Default: `${{ github.event.repository.name }}`
    repository: ${{ github.event.repository.name }}

    # GitHub Token to get the deployment information.
    # Permissions:
    # - deployments: read
    # See https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#get-a-deployment.
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**           | **Description**                                                                                       | **Required** | **Default**                             |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------- |
| **`deployment-id`** | The ID of the deployment to update                                                                    | **true**     | -                                       |
| **`repository`**    | The repository where the deployment was made                                                          | **false**    | `$\{\{ github.event.repository.name }}` |
| **`github-token`**  | GitHub Token to get the deployment information.                                                       | **false**    | `$\{\{ github.token }}`                 |
|                     | Permissions:                                                                                          |              |                                         |
|                     | - deployments: read                                                                                   |              |                                         |
|                     | See <https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#get-a-deployment>. |              |                                         |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output**        | **Description**                   |
| ----------------- | --------------------------------- |
| **`environment`** | The environment of the deployment |
| **`url`**         | The URL of the deployment         |

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
