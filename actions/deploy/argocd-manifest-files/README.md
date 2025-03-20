<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:file-text color:gray-dark>" /> GitHub Action: Deploy - ArgoCD Manifest Files

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:file-text color:gray-dark>" />

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

Prepares the ArgoCD manifest files for deployment.
Fills in the required fields and updates the Helm chart values.
This action is used to deploy an application using ArgoCD.
It updates the application manifest with the provided values and deploys it to the specified namespace.
It supports vendor-specific updates for the chart version and other properties:

- Updates the `tags.datadoghq.com/version` key to the chart version.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.3.2
  with:
    # Description: Deployment ID to be used in the ArgoCD application manifest
    #
    deployment-id: ""

    # Description: Namespace to deploy the application
    #
    namespace: ""

    # Description: Name of the Helm chart
    #
    chart-name: ""

    # Description: Repository URL of the Helm chart
    #
    chart-repository: ""

    # Description: Version of the Helm chart
    #
    chart-version: ""

    # Description: Values to be replaced in the chart. Example: [ { "path":
    # "application.appUri", "value": "https://my-app-review-app-1234.my-org.com" } ]
    #
    chart-values: ""

    # Description: Path to the application manifest file
    #
    application-file: ""

    # Description: Path to the namespace manifest file
    #
    namespace-file: ""
```

<!-- end usage -->
<!-- start inputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
