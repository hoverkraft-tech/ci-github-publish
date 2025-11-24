<!-- header:start -->

# GitHub Reusable Workflow: Release Actions

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Release Actions" />
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

Reusable workflow that detects changed GitHub Actions and workflow files,
generates or updates their readme documentation (including version updates),
and publishes the resulting documentation changes back to the repository.

Key behaviors:

- Detect changed actions and workflows (or optionally update all).
- Generate documentation files for each changed Action/workflow
- Commit and push documentation updates (via a pull request.
- Publish documentation to GitHub Pages on push to default branch.

### Permissions

- **`contents`**: `read`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Release Actions
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  release-actions:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-actions.yml@dbdcce2870b33525ac1fa26069bf95b2dd586fda # 0.15.2
    permissions:
      contents: read
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

      # Update all actions and workflows, regardless of changes.
      update-all: false

      # GitHub App ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-id: ""
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**           | **Description**                                                                    | **Required** | **Type**    | **Default**         |
| ------------------- | ---------------------------------------------------------------------------------- | ------------ | ----------- | ------------------- |
| **`runs-on`**       | JSON array of runner(s) to use.                                                    | **false**    | **string**  | `["ubuntu-latest"]` |
|                     | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>. |              |             |                     |
| **`update-all`**    | Update all actions and workflows, regardless of changes.                           | **false**    | **boolean** | `false`             |
| **`github-app-id`** | GitHub App ID to generate GitHub token in place of github-token.                   | **false**    | **string**  | -                   |
|                     | See <https://github.com/actions/create-github-app-token>.                          |              |             |                     |

<!-- inputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**           | **Description**                                                                                                              | **Required** |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **`github-token`**   | GitHub token for creating and merging pull request (permissions contents: write and pull-requests: write, workflows: write). | **false**    |
|                      | See <https://github.com/hoverkraft-tech/ci-github-common/blob/main/actions/create-and-merge-pull-request/README.md>.         |              |
| **`github-app-key`** | GitHub App private key to generate GitHub token in place of github-token.                                                    | **false**    |
|                      | See <https://github.com/actions/create-github-app-token>.                                                                    |              |

<!-- secrets:end -->

<!-- outputs:start -->

## Outputs

| **Output**        | **Description**                                                 |
| ----------------- | --------------------------------------------------------------- |
| **`artifact-id`** | ID of the uploaded artifact containing generated documentation. |

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
