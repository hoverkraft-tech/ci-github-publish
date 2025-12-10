<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItY2xvY2siIGNvbG9yPSJibHVlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMTIgNiAxMiAxMiAxNiAxNCI+PC9wb2x5bGluZT48L3N2Zz4=) GitHub Action: Deployment - Get finished deployment

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deployment - Get finished deployment" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deployment------get--finished--deployment-blue?logo=github-actions)](https://github.com/marketplace/actions/deployment---get-finished-deployment)
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

Waits for a GitHub deployment to reach a terminal state and returns its latest status and metadata.

This action polls the GitHub Deployment Status API for the
provided deployment ID until it observes a terminal state (`success`, `failure` or `error`),
or until the specified timeout (in seconds) elapses.

It uses exponential backoff between checks to reduce API pressure.
The action sets outputs with the final deployment state, the environment name and the environment URL (if present).

<!-- overview:end -->

## Permissions

Set permissions to read deployments.

```yaml
permissions:
  actions: read
  deployments: read
```

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deployment/get-finished@44e0f1bacebf3711bf90895fc45d815e9fe582e8 # 0.18.0
  with:
    # The ID of the GitHub deployment to wait for (numeric ID)
    # This input is required.
    deployment-id: ""

    # Maximum time to wait for a terminal deployment status, in seconds
    # Default: `240`
    timeout: "240"

    # If "true", the action will not mark the step as failed when the deployment finishes with a non-success terminal state
    # (for example `failure` or `error`).
    # When `false` (default), the step fails if the final deployment status is not `success`.
    #
    # Default: `false`
    allow-failure: "false"
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**           | **Description**                                                                                                       | **Required** | **Default** |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ | ----------- |
| **`deployment-id`** | The ID of the GitHub deployment to wait for (numeric ID)                                                              | **true**     | -           |
| **`timeout`**       | Maximum time to wait for a terminal deployment status, in seconds                                                     | **false**    | `240`       |
| **`allow-failure`** | If "true", the action will not mark the step as failed when the deployment finishes with a non-success terminal state | **false**    | `false`     |
|                     | (for example `failure` or `error`).                                                                                   |              |             |
|                     | When `false` (default), the step fails if the final deployment status is not `success`.                               |              |             |

<!-- inputs:end -->
<!-- outputs:start -->

## Outputs

| **Output**        | **Description**                                                                 |
| ----------------- | ------------------------------------------------------------------------------- |
| **`status`**      | The final terminal state of the deployment (e.g. `success`, `failure`, `error`) |
| **`url`**         | The environment URL associated with the deployment (if provided by the status)  |
| **`environment`** | The target environment name for the deployment (e.g. `production`, `staging`)   |

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
