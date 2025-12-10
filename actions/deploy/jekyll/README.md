<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItbGF5ZXJzIiBjb2xvcj0iYmx1ZSI+PHBvbHlnb24gcG9pbnRzPSIxMiAyIDIgNyAxMiAxMiAyMiA3IDEyIDIiPjwvcG9seWdvbj48cG9seWxpbmUgcG9pbnRzPSIyIDE3IDEyIDIyIDIyIDE3Ij48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9IjIgMTIgMTIgMTcgMjIgMTIiPjwvcG9seWxpbmU+PC9zdmc+) GitHub Action: Build a Jekyll site

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Build a Jekyll site" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-build--a--jekyll--site-blue?logo=github-actions)](https://github.com/marketplace/actions/build-a-jekyll-site)
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

Builds a Jekyll site from source files with automatic asset management and link rewriting.

Main steps performed by this action:

1. **Site Preparation**: Creates the site directory (default `_site`, configurable via `site-path`) and generates `_config.yml` with the specified theme
2. **Index Page Creation**: Converts README.md to index.md with Jekyll front matter if index doesn't exist
3. **Additional Pages Processing**: Processes pages (Markdown or HTML) matching the `pages` input pattern, creating Jekyll pages with proper structure
4. **Asset Management**: Copies images and media files referenced by pages plus any files matched by `assets` input into `assets/`, rewriting references in Markdown and HTML formats
5. **Link Rewriting**: Updates internal page links to maintain correct navigation after Jekyll structure transformation
6. **Jekyll Build**: Executes official Jekyll build process to generate the final static site

<!-- overview:end -->

<!-- usage:start -->

## Usage

````yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deploy/jekyll@5358acdb08b912114974ecc06a057cda8d391aa5 # 0.17.0
  with:
    # The Jekyll theme to use for the site.
    # Default: `jekyll-theme-cayman`
    theme: jekyll-theme-cayman

    # The working directory where the prepared Jekyll site is written. Relative to the workspace.
    # Default: `_site`
    site-path: _site

    # The destination directory for the built site assets. Relative to the workspace.
    # Default: `build`
    build-path: build

    # Additional files to copy into the generated `assets/` directory. Supports glob patterns and multiple paths (one per line).
    assets: ""

    # The Jekyll pages path to build. Supports glob patterns and multiple paths (one per line). Accepts Markdown (`.md`, `.markdown`) and HTML (`.html`, `.htm`) files.
    #
    # ```yml
    # pages: |
    # docs/**/*.md
    # .github/workflows/*.md
    # actions/*/README.md
    # ```
    pages: ""
````

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**        | **Description**                                                                                                                                                   | **Required** | **Default**           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| **`theme`**      | The Jekyll theme to use for the site.                                                                                                                             | **false**    | `jekyll-theme-cayman` |
| **`site-path`**  | The working directory where the prepared Jekyll site is written. Relative to the workspace.                                                                       | **false**    | `_site`               |
| **`build-path`** | The destination directory for the built site assets. Relative to the workspace. Defaults to `build` when not set.                                                 | **false**    | `build`               |
| **`assets`**     | Additional files to copy into the generated `assets/` directory. Supports glob patterns and multiple paths (one per line).                                        | **false**    | -                     |
| **`pages`**      | The Jekyll pages path to build. Supports glob patterns and multiple paths (one per line). Accepts Markdown (`.md`, `.markdown`) and HTML (`.html`, `.htm`) files. | **false**    | -                     |
|                  |                                                                                                                                                                   |              |                       |
|                  | <!-- textlint-disable --><pre lang="yml"> pages: \|&#13; docs/\*_/_.md&#13; .github/workflows/_.md&#13; actions/_/README.md</pre><!-- textlint-enable -->         |              |                       |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output**       | **Description**                    |
| ---------------- | ---------------------------------- |
| **`build-path`** | The path to the built site assets. |

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
