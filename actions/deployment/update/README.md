<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:refresh-cw color:blue>" /> GitHub Action: Update deployment

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:refresh-cw color:blue>" />

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

Action to update a deployment. Create a new status.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

## Usage

Set permissions to write deployments.

```yaml
permissions:
  actions: read
  deployments: write
```

<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.6.1
  with:
    # Description: The id of the deployment to update
    #
    deployment-id: ""

    # Description: The repository where the deployment was made
    #
    # Default: ${{ github.event.repository.name }}
    repository: ""

    # Description: The state of the deployment
    #
    state: ""

    # Description: The description of the deployment
    #
    description: ""

    # Description: The url of the deployment
    #
    url: ""

    # Description: Update the log URL of the deployment
    #
    # Default: true
    update-log-url: ""

    # Description: GitHub Token to update the deployment. Permissions:
    #
    # - deployments: write See
    #   <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>.
    #
    # Default: ${{ github.token }}
    github-token: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                   | **Description**                                                                                                                                                                                       | **Default**                                      | **Required** |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------ |
| <code>deployment-id</code>  | The id of the deployment to update                                                                                                                                                                    |                                                  | **true**     |
| <code>repository</code>     | The repository where the deployment was made                                                                                                                                                          | <code>${{ github.event.repository.name }}</code> | **false**    |
| <code>state</code>          | The state of the deployment                                                                                                                                                                           |                                                  | **true**     |
| <code>description</code>    | The description of the deployment                                                                                                                                                                     |                                                  | **false**    |
| <code>url</code>            | The url of the deployment                                                                                                                                                                             |                                                  | **false**    |
| <code>update-log-url</code> | Update the log URL of the deployment                                                                                                                                                                  | <code>true</code>                                | **false**    |
| <code>github-token</code>   | GitHub Token to update the deployment.<br />Permissions:<br /> - deployments: write<br />See <https://docs.github.com/en/rest/deployments/statuses?apiVersion=2022-11-28#create-a-deployment-status>. | <code>${{ github.token }}</code>                 | **false**    |

<!-- end inputs -->
<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
