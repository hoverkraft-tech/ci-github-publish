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

<!-- badges:end -->

<!--
// jscpd:ignore-start
-->

<!-- overview:start -->

## Overview

Reusable workflow to clean some deployment.

Deletes one or more deployments and runs a follow-up "clean" action
(for example a repository-dispatch) to perform any repository-specific cleanup required after deployment removal.

Behavior / outputs:

- Deletes matching deployment(s) via the local action at `./actions/deployment/delete`.
- Exposes deleted environments in step output `environments`.
- If environments were deleted the workflow will optionally trigger the configured clean action
  (e.g. repository-dispatch) against the target repository and post a summary comment.

### Permissions

- **`contents`**: `write`
- **`issues`**: `write`
- **`packages`**: `write`
- **`pull-requests`**: `write`
- **`actions`**: `read`
- **`deployments`**: `write`
- **`id-token`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

````yaml
name: Clean deploy
on:
  push:
    branches:
      - main
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
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/clean-deploy.yml@00adc3757296add499b60fd72a124b06974a100e # 0.10.1
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

      # GitHub App ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-id: ""

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
````

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**                     | **Description**                                                                                                     | **Required** | **Type**   | **Default**           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | --------------------- |
| **`runs-on`**                 | JSON array of runner(s) to use.                                                                                     | **false**    | **string** | `["ubuntu-latest"]`   |
|                               | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                  |              |            |                       |
| **`github-app-id`**           | GitHub App ID to generate GitHub token in place of github-token.                                                    | **false**    | **string** | -                     |
|                               | See <https://github.com/actions/create-github-app-token>.                                                           |              |            |                       |
| **`clean-deploy-type`**       | Type of clean-deploy action.                                                                                        | **false**    | **string** | `repository-dispatch` |
|                               | Supported values:                                                                                                   |              |            |                       |
|                               | - [`repository-dispatch`](../../actions/clean-deploy/repository-dispatch/README.md).                                |              |            |                       |
| **`clean-deploy-parameters`** | Inputs to pass to the clean action.                                                                                 | **false**    | **string** | -                     |
|                               | JSON object, depending on the clean-deploy-type.                                                                    |              |            |                       |
|                               | For example, for `repository-dispatch`:                                                                             |              |            |                       |
|                               | <!-- textlint-disable --><pre lang="json">{&#13; "repository": "my-org/my-repo"&#13;}</pre><!-- textlint-enable --> |              |            |                       |

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
