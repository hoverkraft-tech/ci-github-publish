<!-- header:start -->

# GitHub Reusable Workflow: Clean deploy

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Clean deploy" />
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

Reusable workflow to clean some deployment.

Deletes one or more deployments and runs a follow-up "clean" action
(for example a repository-dispatch) to perform any repository-specific cleanup required after deployment removal.
The workflow can be triggered on-demand via a given comment trigger (e.g. `/undeploy`).

Behavior / outputs:

- Deletes matching deployment(s) via the local action at `./actions/deployment/delete`.
- Exposes deleted environments in step output `environments`.
- If environments were deleted the workflow will optionally trigger the configured clean action
  (e.g. repository-dispatch) against the target repository and post a summary comment.

### Permissions

- **`actions`**: `read`
- **`deployments`**: `write`
- **`issues`**: `write`
- **`pull-requests`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

````yaml
name: Clean deploy
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  clean-deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/clean-deploy.yml@b2562b46714e535a0113f90f554b55e1248212c1 # 0.26.3
    permissions:
      actions: read
      deployments: write
      issues: write
      pull-requests: write
    secrets:
      # GitHub token for deploying.
      # Permissions:
      # - contents: write
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

      # GitHub App Client ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-client-id: ""

      # Type of clean-deploy action.
      # Supported values:
      # - [`repository-dispatch`](../../actions/clean-deploy/repository-dispatch/README.md).
      #
      # Default: `repository-dispatch`
      clean-deploy-type: repository-dispatch

      # Inputs to pass to the clean action.
      # JSON object, depending on the clean-deploy-type.
      # For example, for `repository-dispatch`:
      # ```json
      # {
      # "repository": "my-org/my-repo"
      # }
      # ```
      clean-deploy-parameters: ""

      # Comment trigger to start the workflow.
      # See https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment.
      #
      # Default: `/undeploy`
      trigger-on-comment: /undeploy
````

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**                     | **Description**                                                                                                     | **Required** | **Type**   | **Default**           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | --------------------- |
| **`runs-on`**                 | JSON array of runner(s) to use.                                                                                     | **false**    | **string** | `["ubuntu-latest"]`   |
|                               | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                  |              |            |                       |
| **`github-app-client-id`**    | GitHub App Client ID to generate GitHub token in place of github-token.                                             | **false**    | **string** | -                     |
|                               | See <https://github.com/actions/create-github-app-token>.                                                           |              |            |                       |
| **`clean-deploy-type`**       | Type of clean-deploy action.                                                                                        | **false**    | **string** | `repository-dispatch` |
|                               | Supported values:                                                                                                   |              |            |                       |
|                               | - [`repository-dispatch`](../../actions/clean-deploy/repository-dispatch/README.md).                                |              |            |                       |
| **`clean-deploy-parameters`** | Inputs to pass to the clean action.                                                                                 | **false**    | **string** | -                     |
|                               | JSON object, depending on the clean-deploy-type.                                                                    |              |            |                       |
|                               | For example, for `repository-dispatch`:                                                                             |              |            |                       |
|                               | <!-- textlint-disable --><pre lang="json">{&#13; "repository": "my-org/my-repo"&#13;}</pre><!-- textlint-enable --> |              |            |                       |
| **`trigger-on-comment`**      | Comment trigger to start the workflow.                                                                              | **false**    | **string** | `/undeploy`           |
|                               | See <https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment>.               |              |            |                       |

<!-- inputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**           | **Description**                                                           | **Required** |
| -------------------- | ------------------------------------------------------------------------- | ------------ |
| **`github-token`**   | GitHub token for deploying.                                               | **false**    |
|                      | Permissions:                                                              |              |
|                      | - contents: write                                                         |              |
| **`github-app-key`** | GitHub App private key to generate GitHub token in place of github-token. | **false**    |
|                      | See <https://github.com/actions/create-github-app-token>.                 |              |

<!-- secrets:end -->

<!-- outputs:start -->
<!-- outputs:end -->

<!-- examples:start -->

## Examples

### Clean ArgoCD review-app deployment on closed pull-request (or on demand with `/undeploy` comment) using GitHub App token

```yaml
---
name: "Clean deploy"
on:
  pull_request_target:
    types: [closed]
  issue_comment:
    types: [created]

permissions:
  contents: write
  issues: write
  packages: write
  pull-requests: write
  actions: read
  deployments: write
  id-token: write

jobs:
  clean-deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/clean-deploy.yml@b2562b46714e535a0113f90f554b55e1248212c1 # 0.26.3
    with:
      clean-deploy-parameters: |
        { "repository": "${{ github.repository_owner }}/argocd-app-of-apps" }
      github-app-id: ${{ vars.CI_BOT_APP_ID }}
    secrets:
      github-app-key: ${{ secrets.CI_BOT_APP_PRIVATE_KEY }}
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
