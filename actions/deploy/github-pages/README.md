<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:upload-cloud color:blue>" /> GitHub Action: Deploy - GitHub Pages

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:upload-cloud color:blue>" />

<!-- end branding -->
<!-- markdownlint-disable MD013 -->
<!-- start badges -->

<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20tag" /></a><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/release-date/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20date" /></a><img src="https://img.shields.io/github/last-commit/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Commit" /><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Fissues"><img src="https://img.shields.io/github/issues/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Open%20Issues" /></a><img src="https://img.shields.io/github/downloads/hoverkraft-tech/ci-github-publish/total?logo=github&style=flat-square" alt="Downloads" />

<!-- end badges -->
<!-- markdownlint-enable MD013 -->
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
- uses: hoverkraft-tech/ci-github-publish@0.5.1
  with:
    # Description: The path to the assets to deploy. Can be absolute or relative
    # $GITHUB_WORKSPACE.
    #
    build-path: ""

    # Description: The name of the "build" artifact to download.
    #
    # Default:
    build-artifact-name: ""

    # Description: The path to the performance budget file. See
    # <../lighthouse/README.md>.
    #
    # Default: ./budget.json
    budget-path: ""

    # Description: The static site generator used to build the site. See
    # <https://github.com/actions/configure-pages>.
    #
    static-site-generator: ""

    # Description: GitHub Token for deploying to GitHub Pages. Permissions:
    #
    # - pages: write
    # - id-token: write See <https://github.com/actions/configure-pages>.
    #
    # Default: ${{ github.token }}
    github-token: ""
```

<!-- end usage -->
<!-- start inputs -->
<!-- end inputs -->
<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
