<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:send color:gray-dark>" /> GitHub Action: Deploy - GitHub Pages

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:send color:gray-dark>" />

<!-- end branding -->
<!-- start badges -->

<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20tag" /></a>
<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/release-date/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20date" /></a>
<img src="https://img.shields.io/github/last-commit/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Commit" />
<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Fissues"><img src="https://img.shields.io/github/issues/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Open%20Issues" /></a>
<img src="https://img.shields.io/github/downloads/hoverkraft-tech/ci-github-publish/total?logo=github&style=flat-square" alt="Downloads" />

<!-- end badges -->
<!--
// jscpd:ignore-end
-->
<!-- start description -->

Action to deploy a static site to GitHub Pages.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

## Usage

Set permissions to deploy to pages.

```yaml
permissions:
  pages: write
  id-token: write
```

<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.1.1
  with:
    # Description: The name of the "build" artifact to download.
    #
    # Default: build
    build-artifact-name: ""

    # Description: The path to the build assets to deploy.
    #
    # Default: .
    build-assets-path: ""

    # Description: The path to the performance budget file. See
    # <../lighthouse/README.md>.
    #
    # Default: ./budget.json
    budget-path: ""
```

<!-- end usage -->
<!-- start inputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
