<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:arrow-right-circle color:blue>" /> GitHub Action: Create deployment

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:arrow-right-circle color:blue>" />

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

Action to create a new deployment

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

## Usage

Set permissions to write deployments.

```yaml
permissions:
  deployments: write
```

<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.6.1
  with:
    # Description: The environment to deploy to
    #
    environment: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                | **Description**              | **Default** | **Required** |
| ------------------------ | ---------------------------- | ----------- | ------------ |
| <code>environment</code> | The environment to deploy to |             | **true**     |

<!-- end inputs -->
<!-- start outputs -->

| **Output**                 | **Description**                  |
| -------------------------- | -------------------------------- |
| <code>deployment-id</code> | The ID of the created deployment |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
