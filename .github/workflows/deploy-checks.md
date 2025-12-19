<!-- header:start -->

# GitHub Reusable Workflow: Deploy - Checks

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Deploy - Checks" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)

<!-- badges:end -->

<!-- overview:start -->

## Overview

Reusable workflow that performs deployment checks.
It runs quick health and performance checks.

What this workflow does:

- URL ping check. See [Ping check](../../actions/check/url-ping/README.md).
- Lighthouse audit. See [Lighthouse check](../../actions/check/url-lighthouse/README.md).

### Permissions

- **`contents`**: `read`
- **`id-token`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Deploy - Checks
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  deploy-checks:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-checks.yml@1a70990f2168a7b322632383edf9ca29d8d8b173 # 0.19.0
    permissions: {}
    with:
      # JSON array of runner(s) to use.
      # See https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job.
      #
      # Default: `["ubuntu-latest"]`
      runs-on: '["ubuntu-latest"]'

      # The URL to check.
      # This input is required.
      url: ""

      # Path to the budget file to use for the Lighthouse check.
      # See [`url-lighthouse`](../../actions/check/url-lighthouse/README.md).
      #
      # Default: `./budget.json`
      budget-path: ./budget.json

      # Whether to print a summary of the checks.
      # Default: `true`
      print-summary: true
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**           | **Description**                                                                    | **Required** | **Type**    | **Default**         |
| ------------------- | ---------------------------------------------------------------------------------- | ------------ | ----------- | ------------------- |
| **`runs-on`**       | JSON array of runner(s) to use.                                                    | **false**    | **string**  | `["ubuntu-latest"]` |
|                     | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>. |              |             |                     |
| **`url`**           | The URL to check.                                                                  | **true**     | **string**  | -                   |
| **`budget-path`**   | Path to the budget file to use for the Lighthouse check.                           | **false**    | **string**  | `./budget.json`     |
|                     | See [`url-lighthouse`](../../actions/check/url-lighthouse/README.md).              |              |             |                     |
| **`print-summary`** | Whether to print a summary of the checks.                                          | **false**    | **boolean** | `true`              |

<!-- inputs:end -->

<!-- secrets:start -->
<!-- secrets:end -->

<!-- outputs:start -->

## Outputs

| **Output**    | **Description**                                                                                                                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`summary`** | Summary of the checks.                                                                                                                                                                                                                                                                                                               |
|               | This will include the results of the URL ping and Lighthouse checks.                                                                                                                                                                                                                                                                 |
|               | Example:                                                                                                                                                                                                                                                                                                                             |
|               |                                                                                                                                                                                                                                                                                                                                      |
|               | <!-- textlint-disable --><pre lang="json">{&#13; "ping": {&#13; "statusCode": 200,&#13; "attemptCount": 3&#13; },&#13; "lighthouse": {&#13; "reportUrl": "https://example.com/lighthouse-report.html",&#13; "reportSummary": {&#13; "performance": 0.9,&#13; "accessibility": 0.95&#13; }&#13; }&#13;}</pre><!-- textlint-enable --> |

<!-- outputs:end -->

<!-- examples:start -->
<!-- examples:end -->

<!--
// jscpd:ignore-start
-->

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
