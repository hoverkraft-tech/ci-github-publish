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
![GitHub Verified Creator](https://img.shields.io/badge/GitHub-Verified%20Creator-4493F8?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJyZ2IoNjgsIDE0NywgMjQ4KSI+CiAgPHBhdGggZD0ibTkuNTg1LjUyLjkyOS42OGMuMTUzLjExMi4zMzEuMTg2LjUxOC4yMTVsMS4xMzguMTc1YTIuNjc4IDIuNjc4IDAgMCAxIDIuMjQgMi4yNGwuMTc0IDEuMTM5Yy4wMjkuMTg3LjEwMy4zNjUuMjE1LjUxOGwuNjguOTI4YTIuNjc3IDIuNjc3IDAgMCAxIDAgMy4xN2wtLjY4LjkyOGExLjE3NCAxLjE3NCAwIDAgMC0uMjE1LjUxOGwtLjE3NSAxLjEzOGEyLjY3OCAyLjY3OCAwIDAgMS0yLjI0MSAyLjI0MWwtMS4xMzguMTc1YTEuMTcgMS4xNyAwIDAgMC0uNTE4LjIxNWwtLjkyOC42OGEyLjY3NyAyLjY3NyAwIDAgMS0zLjE3IDBsLS45MjgtLjY4YTEuMTc0IDEuMTc0IDAgMCAwLS41MTgtLjIxNUwzLjgzIDE0LjQxYTIuNjc4IDIuNjc4IDAgMCAxLTIuMjQtMi4yNGwtLjE3NS0xLjEzOGExLjE3IDEuMTcgMCAwIDAtLjIxNS0uNTE4bC0uNjgtLjkyOGEyLjY3NyAyLjY3NyAwIDAgMSAwLTMuMTdsLjY4LS45MjhjLjExMi0uMTUzLjE4Ni0uMzMxLjIxNS0uNTE4bC4xNzUtMS4xNGEyLjY3OCAyLjY3OCAwIDAgMSAyLjI0LTIuMjRsMS4xMzktLjE3NWMuMTg3LS4wMjkuMzY1LS4xMDMuNTE4LS4yMTVsLjkyOC0uNjhhMi42NzcgMi42NzcgMCAwIDEgMy4xNyAwWk03LjMwMyAxLjcyOGwtLjkyNy42OGEyLjY3IDIuNjcgMCAwIDEtMS4xOC40ODlsLTEuMTM3LjE3NGExLjE3OSAxLjE3OSAwIDAgMC0uOTg3Ljk4N2wtLjE3NCAxLjEzNmEyLjY3NyAyLjY3NyAwIDAgMS0uNDg5IDEuMThsLS42OC45MjhhMS4xOCAxLjE4IDAgMCAwIDAgMS4zOTRsLjY4LjkyN2MuMjU2LjM0OC40MjQuNzUzLjQ4OSAxLjE4bC4xNzQgMS4xMzdjLjA3OC41MDkuNDc4LjkwOS45ODcuOTg3bDEuMTM2LjE3NGEyLjY3IDIuNjcgMCAwIDEgMS4xOC40ODlsLjkyOC42OGMuNDE0LjMwNS45NzkuMzA1IDEuMzk0IDBsLjkyNy0uNjhhMi42NyAyLjY3IDAgMCAxIDEuMTgtLjQ4OWwxLjEzNy0uMTc0YTEuMTggMS4xOCAwIDAgMCAuOTg3LS45ODdsLjE3NC0xLjEzNmEyLjY3IDIuNjcgMCAwIDEgLjQ4OS0xLjE4bC42OC0uOTI4YTEuMTc2IDEuMTc2IDAgMCAwIDAtMS4zOTRsLS42OC0uOTI3YTIuNjg2IDIuNjg2IDAgMCAxLS40ODktMS4xOGwtLjE3NC0xLjEzN2ExLjE3OSAxLjE3OSAwIDAgMC0uOTg3LS45ODdsLTEuMTM2LS4xNzRhMi42NzcgMi42NzcgMCAwIDEtMS4xOC0uNDg5bC0uOTI4LS42OGExLjE3NiAxLjE3NiAwIDAgMC0xLjM5NCAwWk0xMS4yOCA2Ljc4bC0zLjc1IDMuNzVhLjc1Ljc1IDAgMCAxLTEuMDYgMEw0LjcyIDguNzhhLjc1MS43NTEgMCAwIDEgLjAxOC0xLjA0Mi43NTEuNzUxIDAgMCAxIDEuMDQyLS4wMThMNyA4Ljk0bDMuMjItMy4yMmEuNzUxLjc1MSAwIDAgMSAxLjA0Mi4wMTguNzUxLjc1MSAwIDAgMSAuMDE4IDEuMDQyWiI+PC9wYXRoPgo8L3N2Zz4K)

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
- uses: hoverkraft-tech/ci-github-publish/actions/deploy/helm-repository-dispatch@84d583ba7b357f9476707f54cf5419d630ae0145 # 0.26.2
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

| **Input**           | **Description**                                                                                                                     | **Required** | **Default**           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`deployment-id`** | Deployment ID to be used in the ArgoCD application manifest                                                                         | **true**     | -                     |
| **`chart`**         | Chart to deploy. Example: `ghcr.io/my-org/my-repo/charts/application/my-repo:0.1.0-rc.0`.                                           | **true**     | -                     |
| **`chart-values`**  | Chart values to be sent to deployment. JSON array. Example:                                                                         | **false**    | -                     |
|                     | <!-- textlint-disable --><pre lang="json">[&#13; { "path": ".application.test", "value": "ok" }&#13;]</pre><!-- textlint-enable --> |              |                       |
| **`repository`**    | Target repository where to deploy given chart.                                                                                      | **true**     | -                     |
| **`environment`**   | Environment where to deploy given chart.                                                                                            | **true**     | -                     |
| **`url`**           | The URL which respond to deployed application.                                                                                      | **true**     | -                     |
| **`github-token`**  | GitHub Token for dispatch an event to a remote repository.                                                                          | **false**    | `${{ github.token }}` |
|                     | Permissions:                                                                                                                        |              |                       |
|                     | - contents: write                                                                                                                   |              |                       |
|                     | See <https://github.com/peter-evans/repository-dispatch#usage>.                                                                     |              |                       |
| **`initiated-by`**  | Username to record as having initiated the sync operation                                                                           | **true**     | -                     |

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
