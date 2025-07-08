<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:list color:blue>" /> GitHub Action: Deploy - Report

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:list color:blue>" />

<!-- end branding -->
<!-- markdownlint-disable MD013 -->
<!-- start badges -->

<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20tag" /></a><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/release-date/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20date" /></a><img src="https://img.shields.io/github/last-commit/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Commit" /><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Fissues"><img src="https://img.shields.io/github/issues/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Open%20Issues" /></a><img src="https://img.shields.io/github/downloads/hoverkraft-tech/ci-github-publish/total?logo=github&style=flat-square" alt="Downloads" />

<!-- end badges -->
<!--
// jscpd:ignore-end
-->
<!-- start description -->

Action to report deploy result

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

## Usage

Set permissions to read deployments.

```yaml
permissions:
  actions: read
  deployments: write
```

<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.5.1
  with:
    # Description: Environment where the deployment was made.
    #
    environment: ""

    # Description: Deployment ID to report.
    #
    deployment-id: ""

    # Description: URL where the deployment is available.
    #
    url: ""

    # Description: Extra outputs to be included in the summary.
    #
    extra: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                  | **Description**                              | **Default** | **Required** |
| -------------------------- | -------------------------------------------- | ----------- | ------------ |
| <code>environment</code>   | Environment where the deployment was made.   |             | **true**     |
| <code>deployment-id</code> | Deployment ID to report.                     |             | **false**    |
| <code>`url`</code>         | URL where the deployment is available.       |             | **false**    |
| <code>extra</code>         | Extra outputs to be included in the summary. |             | **false**    |

<!-- end inputs -->
<!-- start outputs -->

| **Output**         | **Description**                 |
| ------------------ | ------------------------------- |
| <code>`url`</code> | URL of the deployed application |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
