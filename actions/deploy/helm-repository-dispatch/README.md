<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXBsb2FkLWNsb3VkIiBjb2xvcj0iYmx1ZSI+PHBvbHlsaW5lIHBvaW50cz0iMTYgMTYgMTIgMTIgOCAxNiI+PC9wb2x5bGluZT48bGluZSB4MT0iMTIiIHkxPSIxMiIgeDI9IjEyIiB5Mj0iMjEiPjwvbGluZT48cGF0aCBkPSJNMjAuMzkgMTguMzlBNSA1IDAgMCAwIDE4IDloLTEuMjZBOCA4IDAgMSAwIDMgMTYuMyI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE2IDE2IDEyIDEyIDggMTYiPjwvcG9seWxpbmU+PC9zdmc+) GitHub Action: Deploy Helm chart via a repository dispatch

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deploy Helm chart via a repository dispatch" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deploy--helm--chart--via--a--repository--dispatch-blue?logo=github-actions)](https://github.com/marketplace/actions/deploy-helm-chart-via-a-repository-dispatch)
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

Action to deploy an Helm chart via GitHub repository dispatch event.
See <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-dispatch-event>.
See <https://github.com/peter-evans/repository-dispatch>.

The target repository should implement a workflow that handle this dispatch event.
See <https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#repository_dispatch>.

<!-- overview:end -->

<!-- usage:start -->

## Usage

````yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deploy/helm-repository-dispatch@5358acdb08b912114974ecc06a057cda8d391aa5 # 0.17.0
  with:
    # Deployment ID to be used in the ArgoCD application manifest
    # This input is required.
    deployment-id: ""

    # Chart to deploy. Example: `ghcr.io/my-org/my-repo/charts/application/my-repo:0.1.0-rc.0`.
    #
    # This input is required.
    chart: ""

    # Chart values to be sent to deployment. JSON array. Example:
    # ```json
    # [
    # { "path": ".application.test", "value": "ok" }
    # ]
    # ```
    chart-values: ""

    # Target repository where to deploy given chart.
    # This input is required.
    repository: ""

    # Environment where to deploy given chart.
    # This input is required.
    environment: ""

    # The URL which respond to deployed application.
    # This input is required.
    url: ""

    # GitHub Token for dispatch an event to a remote repository.
    # Permissions:
    # - contents: write
    # See https://github.com/peter-evans/repository-dispatch#usage.
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}

    # Username to record as having initiated the sync operation
    # This input is required.
    initiated-by: ""
````

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**           | **Description**                                                                                                                     | **Required** | **Default**             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------- |
| **`deployment-id`** | Deployment ID to be used in the ArgoCD application manifest                                                                         | **true**     | -                       |
| **`chart`**         | Chart to deploy. Example: `ghcr.io/my-org/my-repo/charts/application/my-repo:0.1.0-rc.0`.                                           | **true**     | -                       |
| **`chart-values`**  | Chart values to be sent to deployment. JSON array. Example:                                                                         | **false**    | -                       |
|                     | <!-- textlint-disable --><pre lang="json">[&#13; { "path": ".application.test", "value": "ok" }&#13;]</pre><!-- textlint-enable --> |              |                         |
| **`repository`**    | Target repository where to deploy given chart.                                                                                      | **true**     | -                       |
| **`environment`**   | Environment where to deploy given chart.                                                                                            | **true**     | -                       |
| **`url`**           | The URL which respond to deployed application.                                                                                      | **true**     | -                       |
| **`github-token`**  | GitHub Token for dispatch an event to a remote repository.                                                                          | **false**    | `$\{\{ github.token }}` |
|                     | Permissions:                                                                                                                        |              |                         |
|                     | - contents: write                                                                                                                   |              |                         |
|                     | See <https://github.com/peter-evans/repository-dispatch#usage>.                                                                     |              |                         |
| **`initiated-by`**  | Username to record as having initiated the sync operation                                                                           | **true**     | -                       |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output** | **Description**                 |
| ---------- | ------------------------------- |
| **`url`**  | URL of the deployed application |

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
