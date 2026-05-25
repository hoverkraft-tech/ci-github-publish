<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItcmVmcmVzaC1jdyIgY29sb3I9ImJsdWUiPjxwb2x5bGluZSBwb2ludHM9IjIzIDQgMjMgMTAgMTcgMTAiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz0iMSAyMCAxIDE0IDcgMTQiPjwvcG9seWxpbmU+PHBhdGggZD0iTTMuNTEgOWE5IDkgMCAwIDEgMTQuODUtMy4zNkwyMyAxME0xIDE0bDQuNjQgNC4zNkE5IDkgMCAwIDAgMjAuNDkgMTUiPjwvcGF0aD48L3N2Zz4=) GitHub Action: Release - Update

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Release - Update" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-release------update-blue?logo=github-actions)](https://github.com/marketplace/actions/release---update)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)

<!-- badges:end -->

<!-- overview:start -->

## Overview

Update an existing GitHub release body, upload release assets, and optionally publish the release for a tag.

<!-- overview:end -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/update@<sha> # x.y.z
  with:
    # Existing tag name of the GitHub release to update
    # This input is required.
    tag: ""

    # Optional new release body content.
    # When provided, the action replaces the current release body.
    # Leave it empty to keep the current release body unchanged.
    body: ""

    # Optional workflow artifact id containing files to upload as GitHub release assets.
    # The artifact is downloaded automatically before upload.
    release-artifact-id: ""

    # Whether to publish the release after body and asset updates succeed.
    # When enabled, the action marks the release as non-draft at the end.
    # Default: `false`
    publish: "false"

    # GitHub Token for updating the release.
    # Permissions:
    # - contents: write
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

## Inputs

| **Input**                 | **Description**                                                                    | **Required** | **Default**           |
| ------------------------- | ---------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`tag`**                 | Existing tag name of the GitHub release to update                                  | **true**     | -                     |
| **`body`**                | Optional new release body content.                                                 | **false**    | -                     |
|                           | When provided, the action replaces the current release body.                       |              |                       |
|                           | Leave it empty to keep the current release body unchanged.                         |              |                       |
| **`release-artifact-id`** | Optional workflow artifact ID containing files to upload as GitHub release assets. | **false**    | -                     |
|                           | The artifact is downloaded automatically before upload.                            |              |                       |
| **`publish`**             | Whether to publish the release after body and asset updates succeed.               | **false**    | `false`               |
|                           | When enabled, the action marks the release as non-draft at the end.                |              |                       |
| **`github-token`**        | GitHub Token for updating the release.                                             | **false**    | `${{ github.token }}` |
|                           | Permissions:                                                                       |              |                       |
|                           | - contents: write                                                                  |              |                       |

Prefer [release/create](../create/README.md) when you are creating the release for the first time and already have the final assets ready. Use this action for later body, asset, or publish changes on an existing release.

## Contributing

Contributions are welcome! Please see the [contributing guidelines](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License.

SPDX-License-Identifier: MIT

Copyright © 2026 hoverkraft

For more details, see the [license](http://choosealicense.com/licenses/mit/).
<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/update@b27c38015a8265780329d229c841d057a18b8fae # 0.25.0
  with:
    # Existing tag name of the GitHub release to update
    # This input is required.
    tag: ""

    # Optional new release body content.
    # When provided, the action replaces the current release body.
    # Leave it empty to keep the current release body unchanged.
    body: ""

    # Optional workflow artifact ID containing files to upload as GitHub release assets.
    # The artifact is downloaded automatically before upload.
    release-artifact-id: ""

    # Whether to publish the release after body and asset updates succeed.
    # When enabled, the action marks the release as non-draft at the end.
    #
    # Default: `false`
    publish: "false"

    # GitHub Token for updating the release.
    # Permissions:
    # - contents: write
    #
    # Default: `${{ github.token }}`
    github-token: ${{ github.token }}
```

<!-- usage:end -->
<!-- inputs:start -->

## Inputs

| **Input**                 | **Description**                                                                    | **Required** | **Default**           |
| ------------------------- | ---------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`tag`**                 | Existing tag name of the GitHub release to update                                  | **true**     | -                     |
| **`body`**                | Optional new release body content.                                                 | **false**    | -                     |
|                           | When provided, the action replaces the current release body.                       |              |                       |
|                           | Leave it empty to keep the current release body unchanged.                         |              |                       |
| **`release-artifact-id`** | Optional workflow artifact ID containing files to upload as GitHub release assets. | **false**    | -                     |
|                           | The artifact is downloaded automatically before upload.                            |              |                       |
| **`publish`**             | Whether to publish the release after body and asset updates succeed.               | **false**    | `false`               |
|                           | When enabled, the action marks the release as non-draft at the end.                |              |                       |
| **`github-token`**        | GitHub Token for updating the release.                                             | **false**    | `${{ github.token }}` |
|                           | Permissions:                                                                       |              |                       |
|                           | - contents: write                                                                  |              |                       |

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

Copyright © 2026 hoverkraft

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->
<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->
