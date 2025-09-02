<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:file-text color:blue>" /> GitHub Action: Deploy - ArgoCD Manifest Files

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:file-text color:blue>" />

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

Prepares the ArgoCD manifest files for deployment. Fills in the required fields and updates the Helm chart values. This action is used to deploy an application using ArgoCD. It updates the application manifest with the provided values and deploys it to the specified namespace.
Updated Helm chart values:

1. Common updates:

- All values provided in the `chart-values` input are injected into the Helm chart at their specified YAML paths. Each entry must include a `path` (YAML key) and a `value`.
- The deployment ID is automatically added to the chart values as `.deploymentId`, allowing the chart to reference the current deployment instance.
- The step validates that each chart value entry contains both `path` and `value` properties, ensuring correct input structure.<br />2. Vendor-specific updates for the chart version and other properties: - Updates the `tags.datadoghq.com/version` key to the chart version in Helm values.
  Files/paths updated by this action:

1. The ArgoCD application manifest file (input `application-file`) is updated with:

- Metadata:
- Name: set to the target namespace
- Annotations:
- "argocd.argoproj.io/application-repository": set to the application repository
- "argocd.argoproj.io/deployment-id": set to the deployment ID
- Spec:
- Destination:
- Namespace: set to the target namespace
- Sources (first source):
- Chart: set to the Helm chart name
- RepoURL: set to the Helm chart repository URL
- TargetRevision: set to the Helm chart version
- Helm Values:
- Chart values: custom values provided via the `chart-values` input, allowing dynamic configuration of the Helm chart (e.g., application URIs, feature flags).
- Deployment ID: injected as a value to identify the deployment instance within the chart values.
- Vendor-specific values: additional values set for integrations, such as updating `tags.datadoghq.com/version` for Datadog monitoring/versioning.<br /> Example:

````yaml
metadata:
name: my-namespace
annotations:
argocd.argoproj.io/application-repository: https://github.com/my-org/my-app
argocd.argoproj.io/deployment-id: deploy-1234
spec:
destination:
namespace: my-namespace
sources:
- chart: my-chart
repoURL: https://charts.example.com
targetRevision: 1.2.3
helm:
values:
application:
appUri: https://my-app-review-app-1234.my-org.com
deploymentId: deploy-1234
tags:
datadoghq.com:
version: 1.2.3
```<br />2. The namespace manifest file (input `namespace-file`) is updated with:
- Metadata:
- Name: set to the target namespace
- Annotations:
- "app.kubernetes.io/instance": set to the target namespace<br /> Example:
```yaml
metadata:
name: my-namespace
annotations:
app.kubernetes.io/instance: my-namespace
````

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.8.0
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

    # Description: Repository of the application
    #
    application-repository: ""

    # Description: Path to the application manifest file
    #
    application-file: ""

    # Description: Path to the namespace manifest file
    #
    namespace-file: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                           | **Description**                                                                                                                                           | **Default** | **Required** |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| <code>deployment-id</code>          | Deployment ID to be used in the ArgoCD application manifest                                                                                               |             | **true**     |
| <code>namespace</code>              | Namespace to deploy the application                                                                                                                       |             | **true**     |
| <code>chart-name</code>             | Name of the Helm chart                                                                                                                                    |             | **true**     |
| <code>chart-repository</code>       | Repository URL of the Helm chart                                                                                                                          |             | **true**     |
| <code>chart-version</code>          | Version of the Helm chart                                                                                                                                 |             | **true**     |
| <code>chart-values</code>           | Values to be replaced in the chart. Example:<br /> [<br /> { "path": "application.appUri", "value": "https://my-app-review-app-1234.my-org.com" }<br /> ] |             | **false**    |
| <code>application-repository</code> | Repository of the application                                                                                                                             |             | **true**     |
| <code>application-file</code>       | Path to the application manifest file                                                                                                                     |             | **true**     |
| <code>namespace-file</code>         | Path to the namespace manifest file                                                                                                                       |             | **true**     |

<!-- end inputs -->
<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
