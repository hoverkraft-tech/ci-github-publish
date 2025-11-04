<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItcmVmcmVzaC1jdyIgY29sb3I9ImJsdWUiPjxwb2x5bGluZSBwb2ludHM9IjIzIDQgMjMgMTAgMTcgMTAiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz0iMSAyMCAxIDE0IDcgMTQiPjwvcG9seWxpbmU+PHBhdGggZD0iTTMuNTEgOWE5IDkgMCAwIDEgMTQuODUtMy4zNkwyMyAxME0xIDE0bDQuNjQgNC4zNkE5IDkgMCAwIDAgMjAuNDkgMTUiPjwvcGF0aD48L3N2Zz4=) GitHub Action: Deployment - Update deployment

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deployment - Update deployment" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deployment------update--deployment-blue?logo=github-actions)](https://github.com/marketplace/actions/deployment---update-deployment)
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

Action to update a deployment. Create a new status.

<!-- overview:end -->

## Permissions

Set permissions to write deployments.

```yaml
permissions:
  actions: read
  deployments: write
```

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deployment/update@38963f37ef5be0b6ae84147f542d96d9eb02802b # 0.14.0
  with:
    # The ID of the deployment to update
    # This input is required.
    deployment-id: ""

    # The repository where the deployment was made
    # Default: `${{ github.event.repository.name }}`
    repository: ${{ github.event.repository.name }}

    # The state of the deployment
    # This input is required.
    state: ""

    # The description of the deployment
    description: ""

    # The URL of the deployment
    url: ""

    # Update the log URL of the deployment
    # Default: `true`
    update-log-url: "true"

    # GitHub Token to update the deployment.
    # Permissions:
    # - deployments: write
    # See https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status.
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**            | **Description**                                                                                              | **Required** | **Default**                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ------------ | --------------------------------------- |
| **`deployment-id`**  | The ID of the deployment to update                                                                           | **true**     | -                                       |
| **`repository`**     | The repository where the deployment was made                                                                 | **false**    | `$\{\{ github.event.repository.name }}` |
| **`state`**          | The state of the deployment                                                                                  | **true**     | -                                       |
| **`description`**    | The description of the deployment                                                                            | **false**    | -                                       |
| **`url`**            | The URL of the deployment                                                                                    | **false**    | -                                       |
| **`update-log-url`** | Update the log URL of the deployment                                                                         | **false**    | `true`                                  |
| **`github-token`**   | GitHub Token to update the deployment.                                                                       | **false**    | `$\{\{ github.token }}`                 |
|                      | Permissions:                                                                                                 |              |                                         |
|                      | - deployments: write                                                                                         |              |                                         |
|                      | See <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>. |              |                                         |

<!-- inputs:end -->

<!-- outputs:start -->
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
