<!-- header:start -->

# GitHub Reusable Workflow: Prepare release

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Prepare release" />
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

Reusable workflow that performs release preparation tasks:

- Add proper labels to pull requests
- Ensure release configuration is up to date

### Permissions

- **`contents`**: `read`
- **`id-token`**: `write`
- **`pull-requests`**: `write`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Prepare release
on:
  push:
    branches:
      - main
permissions: {}
jobs:
  prepare-release:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/prepare-release.yml@ed864a88ec8610dc2a1b9aab1dbde2864bf75df4 # 0.16.0
    permissions: {}
    secrets:
      # GitHub token with permissions `contents: write`, `pull-requests: write`.
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

      # Working directory for monorepo support.
      # If specified, the release configuration file will be placed in `.github/release-configs/{slug}.yml` where slug is derived from the working directory path.
      # The configuration will include `include-paths` to filter pull requests to only those that modified files in the specified directory.
      working-directory: ""

      # Additional paths to include in the release notes filtering (JSON array).
      # These paths are added to the `include-paths` configuration of release-drafter.
      #
      # Default: `[]`
      include-paths: "[]"

      # GitHub App ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-id: ""
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**               | **Description**                                                                                                                                            | **Required** | **Type**   | **Default**         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | ------------------- |
| **`runs-on`**           | JSON array of runner(s) to use.                                                                                                                            | **false**    | **string** | `["ubuntu-latest"]` |
|                         | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                                                         |              |            |                     |
| **`working-directory`** | Working directory for monorepo support.                                                                                                                    | **false**    | **string** | -                   |
|                         | If specified, the release configuration file will be placed in `.github/release-configs/{slug}.yml` where slug is derived from the working directory path. |              |            |                     |
|                         | The configuration will include `include-paths` to filter pull requests to only those that modified files in the specified directory.                       |              |            |                     |
| **`include-paths`**     | Additional paths to include in the release notes filtering (JSON array).                                                                                   | **false**    | **string** | `[]`                |
|                         | These paths are added to the `include-paths` configuration of release-drafter.                                                                             |              |            |                     |
| **`github-app-id`**     | GitHub App ID to generate GitHub token in place of github-token.                                                                                           | **false**    | **string** | -                   |
|                         | See <https://github.com/actions/create-github-app-token>.                                                                                                  |              |            |                     |

<!-- inputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**           | **Description**                                                           | **Required** |
| -------------------- | ------------------------------------------------------------------------- | ------------ |
| **`github-token`**   | GitHub token with permissions `contents: write`, `pull-requests: write`.  | **false**    |
| **`github-app-key`** | GitHub App private key to generate GitHub token in place of github-token. | **false**    |
|                      | See <https://github.com/actions/create-github-app-token>.                 |              |

<!-- secrets:end -->

<!-- outputs:start -->
<!-- outputs:end -->

<!-- examples:start -->

## Examples

### Basic usage

```yaml
name: Prepare Release

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, reopened, synchronize]

permissions: {}

jobs:
  prepare-release:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/prepare-release.yml@ed864a88ec8610dc2a1b9aab1dbde2864bf75df4 # 0.16.0
    permissions:
      contents: read
      pull-requests: write
    with:
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
