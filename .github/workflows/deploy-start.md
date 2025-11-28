<!-- header:start -->

# GitHub Reusable Workflow: Deploy - Start

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Deploy - Start" />
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

Reusable workflow: prepare and start a deployment.

Purpose:

- Decide whether a deployment should start (comment trigger or other events).
- Resolve the target environment; supports dynamic environment names when
  invoked from issue or pull-request events (e.g. `environment:issue_number`).
- Create a GitHub deployment and set its initial state to `in_progress`.

Trigger:

- Can be triggered by a specific comment.
- Any event that triggers the workflow that's not an "issue_comment".

Environment:

- Support dynamic env when comming from issue or pull-request event

### Permissions

- **`deployments`**: `write`
- **`id-token`**: `write`
- **`issues`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Deploy - Start
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  deploy-start:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-start.yml@5358acdb08b912114974ecc06a057cda8d391aa5 # 0.17.0
    permissions: {}
    with:
      # JSON array of runner(s) to use.
      # See https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job.
      #
      # Default: `["ubuntu-latest"]`
      runs-on: '["ubuntu-latest"]'

      # Environment where to deploy.
      # If trigger is from an issue event (or pull-request), environment will be set to `environment:issue_number`.
      # See https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/using-environments-for-deployment.
      environment: ""

      # Comment trigger to start the workflow.
      # See https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment.
      #
      # Default: `/deploy`
      trigger-on-comment: /deploy
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**                | **Description**                                                                                                         | **Required** | **Type**   | **Default**         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | ------------------- |
| **`runs-on`**            | JSON array of runner(s) to use.                                                                                         | **false**    | **string** | `["ubuntu-latest"]` |
|                          | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                      |              |            |                     |
| **`environment`**        | Environment where to deploy.                                                                                            | **false**    | **string** | -                   |
|                          | If trigger is from an issue event (or pull-request), environment will be set to `environment:issue_number`.             |              |            |                     |
|                          | See <https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/using-environments-for-deployment>. |              |            |                     |
| **`trigger-on-comment`** | Comment trigger to start the workflow.                                                                                  | **false**    | **string** | `/deploy`           |
|                          | See <https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment>.                   |              |            |                     |

<!-- inputs:end -->

<!-- secrets:start -->
<!-- secrets:end -->

<!-- outputs:start -->

## Outputs

| **Output**          | **Description**                          |
| ------------------- | ---------------------------------------- |
| **`trigger`**       | Trigger event that started the workflow. |
| **`environment`**   | Environment where to deploy.             |
| **`deployment-id`** | Deployment ID to use for the deployment. |

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
