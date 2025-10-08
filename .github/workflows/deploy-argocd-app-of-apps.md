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
- **`id-token`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Deploy ArgoCD App of Apps
on:
  push:
    branches:
      - main
permissions:
  contents: read
  pull-requests: write
  id-token: write
jobs:
  deploy-argocd-app-of-apps:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-argocd-app-of-apps.yml@00adc3757296add499b60fd72a124b06974a100e # 0.10.1
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

      # GitHub App ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-id: ""
```

<!-- usage:end -->

**Tips:** Recommanded trigger event is `repository_dispatch`.

```yaml
name: "Deploy ArgoCD App of Apps"

on:
  repository_dispatch:
    types: [deploy]
```

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**               | **Description**                                                                    | **Required** | **Type**   | **Default**         |
| ----------------------- | ---------------------------------------------------------------------------------- | ------------ | ---------- | ------------------- |
| **`runs-on`**           | JSON array of runner(s) to use.                                                    | **false**    | **string** | `["ubuntu-latest"]` |
|                         | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>. |              |            |                     |
| **`template-filename`** | Filename of the template to use.                                                   | **false**    | **string** | `template.yml.tpl`  |
| **`github-app-id`**     | GitHub App ID to generate GitHub token in place of github-token.                   | **false**    | **string** | -                   |
|                         | See <https://github.com/actions/create-github-app-token>.                          |              |            |                     |

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

Copyright © 2025 hoverkraft-tech

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->

<!--
// jscpd:ignore-end
-->
