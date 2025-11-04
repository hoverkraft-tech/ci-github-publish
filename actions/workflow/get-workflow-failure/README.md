<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItemFwLW9mZiIgY29sb3I9ImJsdWUiPjxwb2x5bGluZSBwb2ludHM9IjEyLjQxIDYuNzUgMTMgMiAxMC41NyA0LjkyIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9IjE4LjU3IDEyLjkxIDIxIDEwIDE1LjY2IDEwIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9IjggOCAzIDE0IDEyIDE0IDExIDIyIDE2IDE2Ij48L3BvbHlsaW5lPjxsaW5lIHgxPSIxIiB5MT0iMSIgeDI9IjIzIiB5Mj0iMjMiPjwvbGluZT48L3N2Zz4=) GitHub Action: Deployment - Get workflow failure

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deployment - Get workflow failure" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deployment------get--workflow--failure-blue?logo=github-actions)](https://github.com/marketplace/actions/deployment---get-workflow-failure)
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

Inspect the current workflow run and return any failed jobs.

This action calls the GitHub Actions API to list all jobs for the workflow run that triggered the current workflow (using `context.runId`).
It filters jobs with terminal failure conclusions (for example `failure` and `timed_out`)
and exposes a JSON list of the failed jobs together with a boolean flag indicating whether any job failed.
Each failed job entry contains the job name, its conclusion, and the job web URL for quick access.

Note: this action reads jobs for the current run and therefore relies on the workflow run context;
the default `GITHUB_TOKEN` already has read access to Actions in typical workflows.

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/workflow/get-workflow-failure@38963f37ef5be0b6ae84147f542d96d9eb02802b # 0.14.0
  with:
    # GitHub Token to get workflow information.
    # Permissions:
    # - actions: read
    # See https://docs.github.com/en/rest/actions/workflows#list-jobs-for-a-workflow-run.
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**          | **Description**                                                                       | **Required** | **Default**             |
| ------------------ | ------------------------------------------------------------------------------------- | ------------ | ----------------------- |
| **`github-token`** | GitHub Token to get workflow information.                                             | **false**    | `$\{\{ github.token }}` |
|                    | Permissions:                                                                          |              |                         |
|                    | - actions: read                                                                       |              |                         |
|                    | See <https://docs.github.com/en/rest/actions/workflows#list-jobs-for-a-workflow-run>. |              |                         |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output**        | **Description**                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`failed-jobs`** | JSON array (string) of failed job objects. Each object contains:                                                                                             |
|                   | - `name`: job name                                                                                                                                           |
|                   | - `conclusion`: job conclusion (e.g. `failure`, `timed_out`)                                                                                                 |
|                   | - `html_url`: link to the job run in GitHub UI                                                                                                               |
|                   | Example:                                                                                                                                                     |
|                   | <!-- textlint-disable --><pre lang="json">[&#13; { "name": "build", "conclusion": "failure", "html_url": "https://..." }&#13;]</pre><!-- textlint-enable --> |
| **`has-failed`**  | Boolean (string) value: `true` if at least one job failed, otherwise `false`.                                                                                |

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
