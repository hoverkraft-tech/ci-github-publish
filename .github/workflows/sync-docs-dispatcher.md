<!-- header:start -->

# GitHub Reusable Workflow: Sync Documentation Dispatcher

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Sync Documentation Dispatcher" />
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

Reusable workflow: Sync documentation to public-docs repository

Purpose:

- Download the uploaded documentation artifact
- Generate a GitHub App token with appropriate permissions
- Dispatch a repository event to hoverkraft-tech/public-docs
- Pass artifact information to the receiver workflow

Prerequisites:

- GitHub App with `repo` and artifact access permissions configured
- Documentation artifact uploaded by prepare-docs action

### Permissions

- **`contents`**: `read`

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
name: Sync Documentation Dispatcher
on:
  push:
    branches:
      - main
permissions:
  contents: read
jobs:
  sync-docs-dispatcher:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/sync-docs-dispatcher.yml@b2a6d08d60e0adff6736caf6fdaa5fd3bcdd473a # 0.13.0
    secrets:
      # GitHub App private key to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-key: ""
    with:
      # GitHub App ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-id: ""

      # ID of the uploaded documentation artifact.
      #
      # This input is required.
      artifact-id: ""
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**           | **Description**                                                  | **Required** | **Type**   | **Default** |
| ------------------- | ---------------------------------------------------------------- | ------------ | ---------- | ----------- |
| **`github-app-id`** | GitHub App ID to generate GitHub token in place of github-token. | **false**    | **string** | -           |
|                     | See <https://github.com/actions/create-github-app-token>.        |              |            |             |
| **`artifact-id`**   | ID of the uploaded documentation artifact.                       | **true**     | **string** | -           |

<!-- inputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**           | **Description**                                                           | **Required** |
| -------------------- | ------------------------------------------------------------------------- | ------------ |
| **`github-app-key`** | GitHub App private key to generate GitHub token in place of github-token. | **false**    |
|                      | See <https://github.com/actions/create-github-app-token>.                 |              |

<!-- secrets:end -->

<!-- outputs:start -->
<!-- outputs:end -->

<!-- examples:start -->

## Examples

### Complete Integration

```yaml
name: Main CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  ci:
    name: Run CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test

  prepare-docs:
    name: Prepare Documentation
    needs: ci
    if: github.event_name != 'schedule' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      artifact-id: ${{ steps.prepare-docs.outputs.artifact-id }}
    steps:
      - uses: actions/checkout@v4

      - name: Prepare documentation
        id: prepare-docs
        uses: hoverkraft-tech/public-docs/.github/actions/prepare-docs@18facec04f2945f4d66d510e8a06568497b73c54 # 0.1.0
        with:
          paths: |
            README.md
            docs/**/*.md
            .github/workflows/*.md

  sync-docs:
    name: Sync Documentation
    needs: prepare-docs
    permissions:
      contents: read
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/sync-docs-dispatcher.yml@b2a6d08d60e0adff6736caf6fdaa5fd3bcdd473a # 0.13.0
    with:
      github-app-id: ${{ vars.PUBLIC_DOCS_APP_ID }}
      artifact-id: ${{ needs.prepare-docs.outputs.artifact-id }}
    secrets:
      github-app-key: ${{ secrets.PUBLIC_DOCS_APP_PRIVATE_KEY }}
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
