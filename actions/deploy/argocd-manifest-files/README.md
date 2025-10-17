<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZmlsZS10ZXh0IiBjb2xvcj0iYmx1ZSI+PHBhdGggZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE0IDIgMTQgOCAyMCA4Ij48L3BvbHlsaW5lPjxsaW5lIHgxPSIxNiIgeTE9IjEzIiB4Mj0iOCIgeTI9IjEzIj48L2xpbmU+PGxpbmUgeDE9IjE2IiB5MT0iMTciIHgyPSI4IiB5Mj0iMTciPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPSIxMCA5IDkgOSA4IDkiPjwvcG9seWxpbmU+PC9zdmc+) GitHub Action: Deploy - ArgoCD Manifest Files

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Deploy - ArgoCD Manifest Files" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-deploy------argocd--manifest--files-blue?logo=github-actions)](https://github.com/marketplace/actions/deploy---argocd-manifest-files)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)

<!-- badges:end -->

<!-- overview:start -->

## Overview

Prepares the ArgoCD manifest files for deployment.
Fills in the required fields and updates the Helm chart values.
This action is used to deploy an application using ArgoCD.
It updates the application manifest with the provided values and deploys it to the specified namespace.

### Updated Helm chart values

1. Common updates:

- All values provided in the `chart-values` input are injected into the Helm chart at their specified YAML paths. Each entry must include a `path` (YAML key) and a `value`.
- The deployment ID is automatically added to the chart values as `.deploymentId`, allowing the chart to reference the current deployment instance.
- The step validates that each chart value entry contains both `path` and `value` properties, ensuring correct input structure.

2. Vendor-specific updates for the chart version and other properties:

- Updates the `tags.datadoghq.com/version` key to the chart version in Helm values.

### Files/paths updated by this action

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
      - Vendor-specific values: additional values set for integrations, such as updating `tags.datadoghq.com/version` for Datadog monitoring/versioning.

Example:

```yaml
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
```

2. The extra manifest file (input `manifest-file`) is updated with:

- Metadata:
  - Name: set to the target namespace (if the `metadata.name` field exists)
  - Annotations:
    - "app.kubernetes.io/instance": set to the target namespace (if the annotation exists)
  - Namespace: set to the target namespace (if the `metadata.namespace` field exists)

Example:

```yaml
metadata:
  name: my-namespace
  annotations:
    app.kubernetes.io/instance: my-namespace
```

<!-- overview:end -->

<!-- usage:start -->

## Usage

````yaml
- uses: hoverkraft-tech/ci-github-publish/actions/deploy/argocd-manifest-files@42d50a3461a177557ca3f83b1d927d7c0783c894 # 0.11.2
  with:
    # Deployment ID to be used in the ArgoCD application manifest
    # This input is required.
    deployment-id: ""

    # Namespace to deploy the application
    # This input is required.
    namespace: ""

    # Name of the Helm chart
    # This input is required.
    chart-name: ""

    # Repository URL of the Helm chart
    # This input is required.
    chart-repository: ""

    # Version of the Helm chart
    # This input is required.
    chart-version: ""

    # Values to be replaced in the chart.
    # Example:
    # ```json
    # [
    # { "path": "application.appUri", "value": "https://my-app-review-app-1234.my-org.com" }
    # ]
    # ```
    chart-values: ""

    # Repository of the application
    # This input is required.
    application-repository: ""

    # Path to the application manifest file
    # This input is required.
    application-file: ""

    # Path to the extra manifest file
    # This input is required.
    manifest-file: ""
````

<!-- usage:end -->

<!--
// jscpd:ignore-start
-->

<!-- inputs:start -->

## Inputs

| **Input**                    | **Description**                                                                                                                                                             | **Required** | **Default** |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------- |
| **`deployment-id`**          | Deployment ID to be used in the ArgoCD application manifest                                                                                                                 | **true**     | -           |
| **`namespace`**              | Namespace to deploy the application                                                                                                                                         | **true**     | -           |
| **`chart-name`**             | Name of the Helm chart                                                                                                                                                      | **true**     | -           |
| **`chart-repository`**       | Repository URL of the Helm chart                                                                                                                                            | **true**     | -           |
| **`chart-version`**          | Version of the Helm chart                                                                                                                                                   | **true**     | -           |
| **`chart-values`**           | Values to be replaced in the chart.                                                                                                                                         | **false**    | -           |
|                              | Example:                                                                                                                                                                    |              |             |
|                              | <!-- textlint-disable --><pre lang="json">[&#13; { "path": "application.appUri", "value": "https://my-app-review-app-1234.my-org.com" }&#13;]</pre><!-- textlint-enable --> |              |             |
| **`application-repository`** | Repository of the application                                                                                                                                               | **true**     | -           |
| **`application-file`**       | Path to the application manifest file                                                                                                                                       | **true**     | -           |
| **`manifest-file`**          | Path to the extra manifest file                                                                                                                                             | **true**     | -           |

<!-- inputs:end -->

<!-- outputs:start -->
<!-- outputs:end -->

<!-- secrets:start -->
<!-- secrets:end -->

<!-- examples:start -->
<!-- examples:end -->

<!-- contributing:start -->

## Contributing

Contributions are welcome! Please see the [contributing guidelines](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md) for more details.

<!-- contributing:end -->

<!-- security:start -->
<!-- security:end -->

<!-- license:start -->

## License

This project is licensed under the MIT License.

SPDX-License-Identifier: MIT

Copyright © 2025 Hoverkraft

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->

<!--
// jscpd:ignore-end
-->
