<!-- header:start -->

# GitHub Reusable Workflow: Finish deploy - ArgoCD App of Apps

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Finish deploy - ArgoCD App of Apps" />
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

Reusable workflow to finish a deploy process in an ArgoCD App Of Apps Pattern context.
See <https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern>.

This workflow is triggered by a repository dispatch event.
See <https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch>.
Payload:

```json
{
  "event_type": "finish-deploy",
  "client_payload": {
    "deployment-id": "unique deployment id (e.g. 1234)",
    "application-repository": "repository name (e.g. my-repository)",
    "urls": "URL(s) of the deployed application. (e.g. ['https://my-application.com'])",
    "status": "status of the deployment (e.g. "Synced", "failure")",
    "description": "description of the deployment (e.g. "deployment successful")",
  }
}
```

### Permissions

- **`contents`**: `read`
- **`id-token`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Finish deploy - ArgoCD App of Apps
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  finish-deploy-argocd-app-of-apps:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/finish-deploy-argocd-app-of-apps.yml@ed864a88ec8610dc2a1b9aab1dbde2864bf75df4 # 0.16.0
    permissions: {}
    secrets:
      # GitHub Token to update the deployment.
      # Permissions:
      # - deployments: write
      # See <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>.
      github-token: ""

      # GitHub App private key to generate GitHub token in place of github-token.
      # See <https://github.com/actions/create-github-app-token>.
      github-app-key: ""
    with:
      # JSON array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      #
      # Default: `["ubuntu-latest"]`
      runs-on: '["ubuntu-latest"]'

      # GitHub App ID to generate GitHub token in place of github-token.
      # See <https://github.com/actions/create-github-app-token>.
      github-app-id: ""
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**           | **Description**                                                                    | **Required** | **Type**   | **Default**         |
| ------------------- | ---------------------------------------------------------------------------------- | ------------ | ---------- | ------------------- |
| **`runs-on`**       | JSON array of runner(s) to use.                                                    | **false**    | **string** | `["ubuntu-latest"]` |
|                     | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>. |              |            |                     |
| **`github-app-id`** | GitHub App ID to generate GitHub token in place of github-token.                   | **false**    | **string** | -                   |
|                     | See <https://github.com/actions/create-github-app-token>.                          |              |            |                     |

<!-- inputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**           | **Description**                                                                                              | **Required** |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ------------ |
| **`github-token`**   | GitHub Token to update the deployment.                                                                       | **false**    |
|                      | Permissions:                                                                                                 |              |
|                      | - deployments: write                                                                                         |              |
|                      | See <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>. |              |
| **`github-app-key`** | GitHub App private key to generate GitHub token in place of github-token.                                    | **false**    |
|                      | See <https://github.com/actions/create-github-app-token>.                                                    |              |

<!-- secrets:end -->

<!-- outputs:start -->
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
