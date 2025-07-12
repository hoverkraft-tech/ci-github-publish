<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:list color:blue>" /> GitHub Action: Read deployment

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:list color:blue>" />
><!-- end branding -->
<!-- markdownlint-disable MD013 -->
<!-- start badges -->

<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20tag" /></a><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/release-date/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20date" /></a><img src="https://img.shields.io/github/last-commit/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Commit" /><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Fissues"><img src="https://img.shields.io/github/issues/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Open%20Issues" /></a><img src="https://img.shields.io/github/downloads/hoverkraft-tech/ci-github-publish/total?logo=github&style=flat-square" alt="Downloads" />

<!-- end badges -->
<!-- markdownlint-enable MD013 -->
<!--
// jscpd:ignore-end
-->
<!-- start description -->

Action to retrieve some deployment information.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.6.1
  with:
    # Description: The ID of the deployment to update
    #
    deployment-id: ""

    # Description: The repository where the deployment was made
    #
    # Default: ${{ github.event.repository.name }}
    repository: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                  | **Description**                              | **Default**                                      | **Required** |
| -------------------------- | -------------------------------------------- | ------------------------------------------------ | ------------ |
| <code>deployment-id</code> | The ID of the deployment to update           |                                                  | **true**     |
| <code>repository</code>    | The repository where the deployment was made | <code>${{ github.event.repository.name }}</code> | **false**    |

<!-- end inputs -->
<!-- start outputs -->

| **Output**               | **Description**                   |
| ------------------------ | --------------------------------- |
| <code>environment</code> | The environment of the deployment |
| <code>URL</code>         | The URL of the deployment         |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
