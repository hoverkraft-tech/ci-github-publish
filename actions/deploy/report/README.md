<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItbGlzdCIgY29sb3I9ImJsdWUiPjxsaW5lIHgxPSI4IiB5MT0iNiIgeDI9IjIxIiB5Mj0iNiI+PC9saW5lPjxsaW5lIHgxPSI4IiB5MT0iMTIiIHgyPSIyMSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjgiIHkxPSIxOCIgeDI9IjIxIiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMyIgeTE9IjYiIHgyPSIzLjAxIiB5Mj0iNiI+PC9saW5lPjxsaW5lIHgxPSIzIiB5MT0iMTIiIHgyPSIzLjAxIiB5Mj0iMTIiPjwvbGluZT48bGluZSB4MT0iMyIgeTE9IjE4IiB4Mj0iMy4wMSIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+) GitHub Action: Deploy - Report

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deploy - Report" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deploy------report-blue?logo=github-actions)](https://github.com/marketplace/actions/deploy---report)
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

Generate a post-deployment report and update GitHub with the deployment result.

This action collects the workflow run result and builds a human-friendly deployment
summary that is written to the GitHub Actions summary (visible in the workflow run UI).
The report can include:

- the deployment environment,
- a link to the workflow logs,
- the deployed application URL (if provided),
- an optional list of failed jobs (when the run failed),
- additional key-value pairs passed through the `extra` input.

When `deployment-id` and `repository` are supplied, the action will also update the
corresponding GitHub Deployment status (state, description and URL). If triggered by
an `issue_comment` event the action can post (or update) an issue/PR comment and add
a reaction to the original comment to provide inline feedback about the deployment.

<!-- overview:end -->

## Permissions

Set permissions to read deployments.

```yaml
permissions:
  actions: read
  deployments: write
```

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deploy/report@dbdcce2870b33525ac1fa26069bf95b2dd586fda # 0.15.2
  with:
    # The repository where the deployment was made
    # Default: `${{ github.event.repository.name }}`
    repository: ${{ github.event.repository.name }}

    # Deployment ID to report.
    deployment-id: ""

    # Environment where the deployment was made.
    environment: ""

    # URL where the deployment is available.
    url: ""

    # Extra outputs to be included in the summary. JSON object with key-value pairs.
    extra: ""

    # GitHub Token to update the deployment.
    # Permissions:
    # - deployments: write
    # See https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status.
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**           | **Description**                                                                                              | **Required** | **Default**                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------ | ------------ | --------------------------------------- |
| **`repository`**    | The repository where the deployment was made                                                                 | **false**    | `$\{\{ github.event.repository.name }}` |
| **`deployment-id`** | Deployment ID to report.                                                                                     | **false**    | -                                       |
| **`environment`**   | Environment where the deployment was made.                                                                   | **false**    | -                                       |
| **`url`**           | URL where the deployment is available.                                                                       | **false**    | -                                       |
| **`extra`**         | Extra outputs to be included in the summary. JSON object with key-value pairs.                               | **false**    | -                                       |
| **`github-token`**  | GitHub Token to update the deployment.                                                                       | **false**    | `$\{\{ github.token }}`                 |
|                     | Permissions:                                                                                                 |              |                                         |
|                     | - deployments: write                                                                                         |              |                                         |
|                     | See <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>. |              |                                         |

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
