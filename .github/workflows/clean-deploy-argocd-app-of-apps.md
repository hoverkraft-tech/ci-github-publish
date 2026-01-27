<!-- header:start -->

# GitHub Reusable Workflow: Clean Deploy - ArgoCD App Of Apps

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Clean Deploy - ArgoCD App Of Apps" />
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

Reusable workflow that clean a deployment in an ArgoCD App Of Apps Pattern context.
See <https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern>.
This workflow is triggered by a repository dispatch event.
See <https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch>.
Payload:

```json
{
  "event_type": "clean-deploy",
  "client_payload": {
    "repository": "repository name (e.g. my-repository)",
    "environment": "environment name (e.g. production, review-apps:pr-1234)"
  }
}
```

### Permissions

- **`contents`**: `read`
- **`id-token`**: `write`
- **`pull-requests`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Clean Deploy - ArgoCD App Of Apps
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  clean-deploy-argocd-app-of-apps:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/clean-deploy-argocd-app-of-apps.yml@84e8ace407055e7a40ba6670a8c697e1ce2dfafa # 0.20.1
    permissions: {}
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

      # GitHub App ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
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

<!-- outputs:start -->
<!-- outputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**           | **Description**                                                                                                              | **Required** |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **`github-token`**   | GitHub token for creating and merging pull request (permissions contents: write and pull-requests: write, workflows: write). | **false**    |
|                      | See <https://github.com/hoverkraft-tech/ci-github-common/blob/main/actions/create-and-merge-pull-request/README.md>.         |              |
| **`github-app-key`** | GitHub App private key to generate GitHub token in place of github-token.                                                    | **false**    |
|                      | See <https://github.com/actions/create-github-app-token>.                                                                    |              |

<!-- secrets:end -->

<!-- examples:start -->

## Examples

### Clean deploy from a repository dispatch event

```yml
name: "Clean deploy for ArgoCD App of Apps"

on:
  repository_dispatch:
    types: [clean-deploy]

permissions:
  contents: read
  pull-requests: write
  # FIXME: This is a workaround for having workflow actions. See https://github.com/orgs/community/discussions/38659
  id-token: write

concurrency:
  group: ci-commit-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/clean-deploy-argocd-app-of-apps.yml@84e8ace407055e7a40ba6670a8c697e1ce2dfafa # 0.20.1
    secrets:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      github-app-key: ${{ secrets.GITHUB_APP_KEY }}
```

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
