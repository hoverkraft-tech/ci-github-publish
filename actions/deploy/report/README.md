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
- uses: hoverkraft-tech/ci-github-publish@0.8.0
  with:
    # Description: The repository where the deployment was made
    #
    # Default: ${{ github.event.repository.name }}
    repository: ""

    # Description: Deployment ID to report.
    #
    deployment-id: ""

    # Description: Environment where the deployment was made.
    #
    environment: ""

    # Description: URL where the deployment is available.
    #
    url: ""

    # Description: Extra outputs to be included in the summary. JSON object with
    # key-value pairs.
    #
    extra: ""

    # Description: GitHub Token to update the deployment. Permissions:
    #
    # - deployments: write See
    #   <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>.
    #
    # Default: ${{ github.token }}
    github-token: ""
```

<!-- end usage -->
<!--
// jscpd:ignore-start
-->
<!-- start inputs -->

| **Input**                  | **Description**                                                                                                                                                                                       | **Default**                                      | **Required** |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------ |
| <code>repository</code>    | The repository where the deployment was made                                                                                                                                                          | <code>${{ github.event.repository.name }}</code> | **false**    |
| <code>deployment-id</code> | Deployment ID to report.                                                                                                                                                                              |                                                  | **false**    |
| <code>environment</code>   | Environment where the deployment was made.                                                                                                                                                            |                                                  | **false**    |
| <code>url</code>           | URL where the deployment is available.                                                                                                                                                                |                                                  | **false**    |
| <code>extra</code>         | Extra outputs to be included in the summary. JSON object with key-value pairs.                                                                                                                        |                                                  | **false**    |
| <code>github-token</code>  | GitHub Token to update the deployment.<br />Permissions:<br /> - deployments: write<br />See <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>. | <code>${{ github.token }}</code>                 | **false**    |

<!-- end inputs -->
<!--
// jscpd:ignore-end
-->
<!-- start outputs -->

| **Output**       | **Description**                 |
| ---------------- | ------------------------------- |
| <code>url</code> | URL of the deployed application |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
