<!-- header:start -->

# GitHub Reusable Workflow: Deploy ArgoCD App of Apps

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Deploy ArgoCD App of Apps" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

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

This reusable workflow automates the deployment of a Helm chart using the ArgoCD App Of Apps pattern.
It is designed for environments where applications are managed via ArgoCD and Helm, supporting templated manifests.

Usage:

- Triggered by a `repository_dispatch` event (see: <https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch>).
- Intended for CI/CD pipelines that need to deploy or update applications in Kubernetes via ArgoCD.
- Supports templated Application manifests for flexible deployment scenarios.

References:

- ArgoCD App Of Apps Pattern: <https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern>

Dispatch Payload Example:

```json
{
  "event_type": "deploy",
  "client_payload": {
    "deployment-id": "unique deployment id (e.g. 1234)",
    "environment": "target environment (e.g. reviews-app, staging, production)",
    "repository": "source repository name (e.g. my-repository)",
    "chart": "Helm chart URI with tag (e.g. ghcr.io/my-org/my-repository/charts/application:0.1.14-pr-82-xxx)",
    "chart-values": "Array of values to inject in the chart (e.g. [{\"path\":\"application.appUri\",\"value\":\"https://my-app-review-app-1234.my-org.com\"}])",
    "url": "URL of the deployed application (e.g. https://my-app-review-app-1234.my-org.com)"
  }
}
```

Key Features:

- Validates and extracts deployment parameters from the dispatch payload.
- Parses Helm chart URI for chart name, repository, and version.
- Supports templated manifest files for both Application and extra manifest resources.
- Updates manifest files with deployment-specific values and chart configuration.
- Creates and merges a pull request for the deployment manifest changes.

### Permissions

- **`contents`**: `read`
- **`pull-requests`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Deploy ArgoCD App of Apps
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  deploy-argocd-app-of-apps:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-argocd-app-of-apps.yml@84d583ba7b357f9476707f54cf5419d630ae0145 # 0.26.2
    permissions:
      contents: read
      pull-requests: write
    secrets:
      # GitHub token for creating and merging pull request (permissions contents: write and pull-requests: write, workflows: write).
      # See https://github.com/hoverkraft-tech/ci-github-common/blob/main/actions/create-and-merge-pull-request/README.md.
      github-token: ""

      # GitHub App private key to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-key: ""
    with:
      # JSON array of runner(s) to use.
      # See https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job.
      #
      # Default: `["ubuntu-latest"]`
      runs-on: '["ubuntu-latest"]'

      # Filename of the template to use.
      # Default: `template.yml.tpl`
      template-filename: template.yml.tpl

      # GitHub App Client ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-client-id: ""
```

<!-- usage:end -->

**ProTip:** Recommended trigger event is `repository_dispatch`.

```yaml
name: "Deploy ArgoCD App of Apps"

on:
  repository_dispatch:
    types: [deploy]
```

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**                  | **Description**                                                                    | **Required** | **Type**   | **Default**         |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------ | ---------- | ------------------- |
| **`runs-on`**              | JSON array of runner(s) to use.                                                    | **false**    | **string** | `["ubuntu-latest"]` |
|                            | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>. |              |            |                     |
| **`template-filename`**    | Filename of the template to use.                                                   | **false**    | **string** | `template.yml.tpl`  |
| **`github-app-client-id`** | GitHub App Client ID to generate GitHub token in place of github-token.            | **false**    | **string** | -                   |
|                            | See <https://github.com/actions/create-github-app-token>.                          |              |            |                     |

<!-- inputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**           | **Description**                                                                                                              | **Required** |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **`github-token`**   | GitHub token for creating and merging pull request (permissions contents: write and pull-requests: write, workflows: write). | **false**    |
|                      | See <https://github.com/hoverkraft-tech/ci-github-common/blob/main/actions/create-and-merge-pull-request/README.md>.         |              |
| **`github-app-key`** | GitHub App private key to generate GitHub token in place of github-token.                                                    | **false**    |
|                      | See <https://github.com/actions/create-github-app-token>.                                                                    |              |

<!-- secrets:end -->

<!-- outputs:start -->

## Outputs

| **Output**          | **Description**        |
| ------------------- | ---------------------- |
| **`deployment-id`** | Deployment ID          |
| **`repository`**    | Source repository name |
| **`url`**           | Deployment URL         |

<!-- outputs:end -->

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

Copyright © 2026 hoverkraft-tech

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->

<!--
// jscpd:ignore-end
-->
