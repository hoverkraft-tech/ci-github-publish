<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9va21hcmsiIGNvbG9yPSJibHVlIj48cGF0aCBkPSJNMTkgMjFsLTctNS03IDVWNWEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ6Ij48L3BhdGg+PC9zdmc+) GitHub Action: Release - Plan

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Release - Plan" />
</div>

---

<!-- header:end -->

<!-- jscpd:ignore-start -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-release------plan-blue?logo=github-actions)](https://github.com/marketplace/actions/release---plan)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)
![GitHub Verified Creator](https://img.shields.io/badge/GitHub-Verified%20Creator-4493F8?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJyZ2IoNjgsIDE0NywgMjQ4KSI+CiAgPHBhdGggZD0ibTkuNTg1LjUyLjkyOS42OGMuMTUzLjExMi4zMzEuMTg2LjUxOC4yMTVsMS4xMzguMTc1YTIuNjc4IDIuNjc4IDAgMCAxIDIuMjQgMi4yNGwuMTc0IDEuMTM5Yy4wMjkuMTg3LjEwMy4zNjUuMjE1LjUxOGwuNjguOTI4YTIuNjc3IDIuNjc3IDAgMCAxIDAgMy4xN2wtLjY4LjkyOGExLjE3NCAxLjE3NCAwIDAgMC0uMjE1LjUxOGwtLjE3NSAxLjEzOGEyLjY3OCAyLjY3OCAwIDAgMS0yLjI0MSAyLjI0MWwtMS4xMzguMTc1YTEuMTcgMS4xNyAwIDAgMC0uNTE4LjIxNWwtLjkyOC42OGEyLjY3NyAyLjY3NyAwIDAgMS0zLjE3IDBsLS45MjgtLjY4YTEuMTc0IDEuMTc0IDAgMCAwLS41MTgtLjIxNUwzLjgzIDE0LjQxYTIuNjc4IDIuNjc4IDAgMCAxLTIuMjQtMi4yNGwtLjE3NS0xLjEzOGExLjE3IDEuMTcgMCAwIDAtLjIxNS0uNTE4bC0uNjgtLjkyOGEyLjY3NyAyLjY3NyAwIDAgMSAwLTMuMTdsLjY4LS45MjhjLjExMi0uMTUzLjE4Ni0uMzMxLjIxNS0uNTE4bC4xNzUtMS4xNGEyLjY3OCAyLjY3OCAwIDAgMSAyLjI0LTIuMjRsMS4xMzktLjE3NWMuMTg3LS4wMjkuMzY1LS4xMDMuNTE4LS4yMTVsLjkyOC0uNjhhMi42NzcgMi42NzcgMCAwIDEgMy4xNyAwWk03LjMwMyAxLjcyOGwtLjkyNy42OGEyLjY3IDIuNjcgMCAwIDEtMS4xOC40ODlsLTEuMTM3LjE3NGExLjE3OSAxLjE3OSAwIDAgMC0uOTg3Ljk4N2wtLjE3NCAxLjEzNmEyLjY3NyAyLjY3NyAwIDAgMS0uNDg5IDEuMThsLS42OC45MjhhMS4xOCAxLjE4IDAgMCAwIDAgMS4zOTRsLjY4LjkyN2MuMjU2LjM0OC40MjQuNzUzLjQ4OSAxLjE4bC4xNzQgMS4xMzdjLjA3OC41MDkuNDc4LjkwOS45ODcuOTg3bDEuMTM2LjE3NGEyLjY3IDIuNjcgMCAwIDEgMS4xOC40ODlsLjkyOC42OGMuNDE0LjMwNS45NzkuMzA1IDEuMzk0IDBsLjkyNy0uNjhhMi42NyAyLjY3IDAgMCAxIDEuMTgtLjQ4OWwxLjEzNy0uMTc0YTEuMTggMS4xOCAwIDAgMCAuOTg3LS45ODdsLjE3NC0xLjEzNmEyLjY3IDIuNjcgMCAwIDEgLjQ4OS0xLjE4bC42OC0uOTI4YTEuMTc2IDEuMTc2IDAgMCAwIDAtMS4zOTRsLS42OC0uOTI3YTIuNjg2IDIuNjg2IDAgMCAxLS40ODktMS4xOGwtLjE3NC0xLjEzN2ExLjE3OSAxLjE3OSAwIDAgMC0uOTg3LS45ODdsLTEuMTM2LS4xNzRhMi42NzcgMi42NzcgMCAwIDEtMS4xOC0uNDg5bC0uOTI4LS42OGExLjE3NiAxLjE3NiAwIDAgMC0xLjM5NCAwWk0xMS4yOCA2Ljc4bC0zLjc1IDMuNzVhLjc1Ljc1IDAgMCAxLTEuMDYgMEw0LjcyIDguNzhhLjc1MS43NTEgMCAwIDEgLjAxOC0xLjA0Mi43NTEuNzUxIDAgMCAxIDEuMDQyLS4wMThMNyA4Ljk0bDMuMjItMy4yMmEuNzUxLjc1MSAwIDAgMSAxLjA0Mi4wMTguNzUxLjc1MSAwIDAgMSAuMDE4IDEuMDQyWiI+PC9wYXRoPgo8L3N2Zz4K)

<!-- badges:end -->

<!-- jscpd:ignore-end -->

<!-- overview:start -->

## Overview

Detect release changes and plan a release identity without creating a Git tag or GitHub release.

<!-- overview:end -->

<!-- jscpd:ignore-start -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/plan@647b53a3e08fb4ea2c477fc6f79dcba94b1395e1 # fix/release-drafter-path-categories
  with:
    # Optional partial Release Drafter configuration as a YAML or JSON mapping.
    # Precedence: generated defaults, repository configuration, then these overrides.
    # Supplied mappings and lists replace inherited values. Categories preserve inherited pre-include filters unless they contain an explicit pre-include category; an empty categories list clears changelog and version rules but keeps the scope.
    # Repository files with their own _extends chain use native Release Drafter inheritance instead of generated defaults and scope preservation.
    # The _extends key is reserved in this input. Pass identical overrides to release/plan and release/create.
    # See [release configuration](../../../docs/usage/release.md#override-release-configuration) for scope examples.
    config-overrides: ""

    # Plan a release even without relevant changes, using the version, tag and name calculated by Release Drafter.
    # Configured version rules and identity templates remain authoritative. Existing tag collisions still fail; tags are never created or moved.
    # Callers decide when forcing is allowed, for example only on manual default-branch runs.
    #
    # Default: `false`
    force: "false"

    # Whether to plan the release as a prerelease
    # Default: `false`
    prerelease: "false"

    # Working directory used to scope release automation in a monorepo.
    # If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.
    # Repository configuration files override generated defaults unless they explicitly declare their own _extends chain. Generated defaults scope changes to the working directory with a `pre-include` category.
    # The generated defaults follow Conventional Commits and Semantic Versioning: breaking changes increment major, `feat` increments minor, and all other changes increment patch.
    # They also define Conventional Commit labels.
    # They credit co-authors and highlight new contributors, with an explicit empty state when there are none.
    working-directory: ""

    # Additional paths to include in generated release notes and version calculation (JSON array).
    # These paths are added to the working-directory scope when one is specified.
    # Add the calling workflow path explicitly to include workflow-only changes.
    # To replace this scope, supply categories in the repository configuration or config-overrides input with a `type: pre-include` entry using `when.paths`, plus the desired changelog and version rules.
    #
    # Default: `[]`
    additional-paths: "[]"

    # Optional branch, commit SHA, fully qualified tag ref, or pull request ref to plan from.
    # Tag and pull request refs are resolved to commit SHAs.
    target-ref: ""

    # GitHub Token for planning the release.
    # Permissions:
    # - contents: read
    # - pull-requests: read
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**               | **Description**                                                                                                                                                                                                                                | **Required** | **Default**           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`config-overrides`**  | Optional partial Release Drafter configuration as a YAML or JSON mapping.                                                                                                                                                                      | **false**    | -                     |
|                         | Precedence: generated defaults, repository configuration, then these overrides.                                                                                                                                                                |              |                       |
|                         | Supplied mappings and lists replace inherited values. Categories preserve inherited pre-include filters unless they contain an explicit pre-include category; an empty categories list clears changelog and version rules but keeps the scope. |              |                       |
|                         | Repository files with their own _extends chain use native Release Drafter inheritance instead of generated defaults and scope preservation.                                                                                                    |              |                       |
|                         | The _extends key is reserved in this input. Pass identical overrides to release/plan and release/create.                                                                                                                                       |              |                       |
|                         | See [release configuration](../../../docs/usage/release.md#override-release-configuration) for scope examples.                                                                                                                                 |              |                       |
| **`force`**             | Plan a release even without relevant changes, using the version, tag and name calculated by Release Drafter.                                                                                                                                   | **false**    | `false`               |
|                         | Configured version rules and identity templates remain authoritative. Existing tag collisions still fail; tags are never created or moved.                                                                                                     |              |                       |
|                         | Callers decide when forcing is allowed, for example only on manual default-branch runs.                                                                                                                                                        |              |                       |
| **`prerelease`**        | Whether to plan the release as a prerelease                                                                                                                                                                                                    | **false**    | `false`               |
| **`working-directory`** | Working directory used to scope release automation in a monorepo.                                                                                                                                                                              | **false**    | -                     |
|                         | If specified, the action looks for `.github/release-configs/{slug}.yml`, where `slug` is derived from the working directory basename.                                                                                                          |              |                       |
|                         | Repository configuration files override generated defaults unless they explicitly declare their own _extends chain. Generated defaults scope changes to the working directory with a `pre-include` category.                                   |              |                       |
|                         | The generated defaults follow Conventional Commits and Semantic Versioning: breaking changes increment major, `feat` increments minor, and all other changes increment patch.                                                                  |              |                       |
|                         | They also define Conventional Commit labels.                                                                                                                                                                                                   |              |                       |
|                         | They credit co-authors and highlight new contributors, with an explicit empty state when there are none.                                                                                                                                       |              |                       |
| **`additional-paths`**  | Additional paths to include in generated release notes and version calculation (JSON array).                                                                                                                                                   | **false**    | `[]`                  |
|                         | These paths are added to the working-directory scope when one is specified.                                                                                                                                                                    |              |                       |
|                         | Add the calling workflow path explicitly to include workflow-only changes.                                                                                                                                                                     |              |                       |
|                         | To replace this scope, supply categories in the repository configuration or config-overrides input with a `type: pre-include` entry using `when.paths`, plus the desired changelog and version rules.                                          |              |                       |
| **`target-ref`**        | Optional branch, commit SHA, fully qualified tag ref, or pull request ref to plan from.                                                                                                                                                        | **false**    | -                     |
|                         | Tag and pull request refs are resolved to commit SHAs.                                                                                                                                                                                         |              |                       |
| **`github-token`**      | GitHub Token for planning the release.                                                                                                                                                                                                         | **false**    | `${{ github.token }}` |
|                         | Permissions:                                                                                                                                                                                                                                   |              |                       |
|                         | - contents: read                                                                                                                                                                                                                               |              |                       |
|                         | - pull-requests: read                                                                                                                                                                                                                          |              |                       |

<!-- inputs:end -->

<!-- jscpd:ignore-end -->

<!-- outputs:start -->

## Outputs

| **Output**           | **Description**                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| **`should-release`** | Whether there are relevant changes, no previous matching release, or an explicit force request (true or false) |
| **`tag`**            | The planned release tag, including when there are no relevant changes                                          |
| **`name`**           | The planned release name, including when there are no relevant changes                                         |

<!-- outputs:end -->

<!-- secrets:start -->
<!-- secrets:end -->

<!-- examples:start -->

## Examples

See the [release workflow examples](../../../docs/usage/release.md#workflow-examples) for planning, forcing, and publishing releases.

<!-- examples:end -->

<!-- jscpd:ignore-start -->

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

Copyright © 2026 hoverkraft

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->

<!-- jscpd:ignore-end -->
