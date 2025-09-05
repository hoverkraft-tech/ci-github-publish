<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:grid color:blue>" /> GitHub Action: ArgoCD - Get Manifest Files

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:grid color:blue>" />

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

Determine all the manifest files needed to deploy the application using ArgoCD for the given context.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.8.0
  with:
    # Description: Environment name (e.g. production, review-apps:pr-1234). This is
    # used to determine the application directory and manifest directory. The
    # environment name can be suffixed with a colon and a suffix (e.g.
    # review-apps:pr-1234).
    #
    environment: ""

    # Description: repository name (e.g. my-repository)
    #
    repository: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                | **Description**                                                                                                                                                                                                                           | **Default** | **Required** |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| <code>environment</code> | Environment name (e.g. production, review-apps:pr-1234).<br />This is used to determine the application directory and manifest directory.<br />The environment name can be suffixed with a colon and a suffix (e.g. review-apps:pr-1234). |             | **true**     |
| <code>repository</code>  | repository name (e.g. my-repository)                                                                                                                                                                                                      |             | **true**     |

<!-- end inputs -->
<!-- start outputs -->

| **Output**                    | **Description**                    |
| ----------------------------- | ---------------------------------- |
| <code>application-file</code> | The file to be used for deployment |
| <code>namespace-file</code>   | The file to be used for namespace  |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
