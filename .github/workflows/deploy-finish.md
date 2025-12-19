<!-- header:start -->

# GitHub Reusable Workflow: Deploy - Finish

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Deploy - Finish" />
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

Reusable workflow that performs the end of a deployment.

What this workflow does:

- If the deployment exposes a URL, run [deploy checks](./deploy-checks.md):
- Update the GitHub deployment status (success or failure).
- Publish a human-readable deployment summary using the deploy/report action.
  See [report](../../actions/deploy/report/README.md).
  - Lighthouse report URL if available.
  - Extra information if provided.

### Permissions

- **`actions`**: `read`
- **`contents`**: `read`
- **`deployments`**: `write`
- **`id-token`**: `write`
- **`issues`**: `write`
- **`pull-requests`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Deploy - Finish
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  deploy-finish:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-finish.yml@3de7f6a470af924f6e6dbdead5c495fcc99ec6b6 # 0.20.0
    permissions: {}
    with:
      # JSON array of runner(s) to use.
      # See https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job.
      #
      # Default: `["ubuntu-latest"]`
      runs-on: '["ubuntu-latest"]'

      # Deployment ID to use for the deployment.
      # See https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#list-deployments.
      #
      # This input is required.
      deployment-id: ""

      # Path to the budget file to use for the Lighthouse check.
      # See [`url-lighthouse`](../../actions/check/url-lighthouse/README.md).
      #
      # Default: `./budget.json`
      budget-path: ./budget.json

      # Extra information to send to the deployment summary.
      # Should be a JSON object.
      extra: ""
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**           | **Description**                                                                                       | **Required** | **Type**   | **Default**         |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ------------ | ---------- | ------------------- |
| **`runs-on`**       | JSON array of runner(s) to use.                                                                       | **false**    | **string** | `["ubuntu-latest"]` |
|                     | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                    |              |            |                     |
| **`deployment-id`** | Deployment ID to use for the deployment.                                                              | **true**     | **string** | -                   |
|                     | See <https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#list-deployments>. |              |            |                     |
| **`budget-path`**   | Path to the budget file to use for the Lighthouse check.                                              | **false**    | **string** | `./budget.json`     |
|                     | See [`url-lighthouse`](../../actions/check/url-lighthouse/README.md).                                 |              |            |                     |
| **`extra`**         | Extra information to send to the deployment summary.                                                  | **false**    | **string** | -                   |
|                     | Should be a JSON object.                                                                              |              |            |                     |

<!-- inputs:end -->

<!-- secrets:start -->
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
