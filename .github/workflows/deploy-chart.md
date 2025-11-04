<!-- header:start -->

# GitHub Reusable Workflow: Deploy chart

<div align="center">
  <img src="../logo.svg" width="60px" align="center" alt="Deploy chart" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)

<!-- badges:end -->

<!--
// jscpd:ignore-start
-->

<!-- overview:start -->

## Overview

Reusable workflow: Deploy Helm chart

Builds OCI images, releases a Helm chart and optionally triggers a
follow-up deployment action (for example a repository-dispatch). This
workflow supports multiple deployment types and is designed to be
called via `workflow_call` from other workflows or repositories.

Key features:

- Builds OCI images using a separate reusable workflow.
- Releases a Helm chart and injects image and placeholder values.
- Supports configurable deployment actions (via `deploy-type` and
  `deploy-parameters`).
- Posts status and uses local actions via a self-checkout when needed.

### Permissions

- **`actions`**: `read`
- **`contents`**: `write`
- **`deployments`**: `write`
- **`id-token`**: `write`
- **`issues`**: `write`
- **`packages`**: `write`
- **`pull-requests`**: `write`

<!-- overview:end -->

**ProTip:**

Trigger the workflow on `issue_comment` to deploy to a _review-app_ environment on demand with a comment (e.g. `/deploy`).
Trigger the workflow on `workflow_call` to deploy via other workflows.

```yml
on:
  issue_comment:
    types: [created]
  workflow_call:
    inputs:
      tag:
        required: true
        type: string
      environment:
        required: true
        type: string
```

<!-- usage:start -->

## Usage

````yaml
name: Deploy chart
on:
  push:
    branches:
      - main
permissions:
  actions: read
  contents: write
  deployments: write
  issues: write
  packages: write
  pull-requests: write
  id-token: write
jobs:
  deploy-chart:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-chart.yml@38963f37ef5be0b6ae84147f542d96d9eb02802b # 0.14.0
    secrets:
      # OCI registry password.
      # This input is required.
      oci-registry-password: ""

      # List of secrets to expose to the build.
      # See https://docs.docker.com/build/ci/github-actions/secrets/.
      build-secrets: ""

      # GitHub token for deploying.
      # Permissions:
      # - contents: write
      github-token: ""

      # GitHub App private key to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-key: ""
    with:
      # JSON array of runner(s) to use.
      # See https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job.
      #
      # Default: `["ubuntu-latest"]`
      runs-on: '["ubuntu-latest"]'

      # Destination where to deploy given chart.
      # Can be an environment name or an environment name with a dynamic identifier.
      # Example: `review-apps:pr-1234`.
      #
      # This input is required.
      environment: ""

      # Tag to use for the deployment.
      # If not provided, will be set to the current commit SHA.
      tag: ""

      # The URL which respond to deployed application.
      # If not provided, will be set to the environment URL.
      # URL can contains placeholders:
      # - `{{ identifier }}`: will be replaced by the environment identifier.
      # Example: `https://{{ identifier }}.my-application.com`.
      url: ""

      # Type of deployment to perform.
      # Supported values:
      # - [`helm-repository-dispatch`](../../actions/deploy/helm-repository-dispatch/README.md).
      #
      # Default: `helm-repository-dispatch`
      deploy-type: helm-repository-dispatch

      # Inputs to pass to the deployment action.
      # JSON object, depending on the deploy-type.
      # For example, for `helm-repository-dispatch`:
      # ```json
      # {
      # "repository": "my-org/my-repo"
      # }
      # ```
      deploy-parameters: ""

      # OCI registry where to pull and push images and chart.
      # Default: `ghcr.io`
      oci-registry: ghcr.io

      # Images to build parameters.
      # See https://github.com/hoverkraft-tech/ci-github-container/blob/main/.github/workflows/docker-build-images.md.
      #
      # This input is required.
      images: ""

      # Chart name to release.
      # See https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md.
      #
      # Default: `application`
      chart-name: application

      # Path to the chart to release.
      # See https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md.
      #
      # Default: `charts/application`
      chart-path: charts/application

      # Define chart values to be filled.
      # See https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md.
      # Accept placeholders:
      # - `{{ tag }}`: will be replaced by the tag.
      # - `{{ url }}`: will be replaced by the URL.
      # If "path" starts with "deploy", the chart value wil be passed to the deploy action.
      # Example:
      # ```json
      # [
      # { "path": ".image", "image": "application" },
      # { "path": ".application.version", "value": "{{ tag }}" },
      # { "path": "deploy.ingress.hosts[0].host", "value": "{{ url }}" }
      # ]
      # ```
      #
      # Default: `[]`
      chart-values: "[]"

      # GitHub App ID to generate GitHub token in place of github-token.
      # See https://github.com/actions/create-github-app-token.
      github-app-id: ""
````

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

### Workflow Call Inputs

| **Input**               | **Description**                                                                                                                                                                                                                                                         | **Required** | **Type**   | **Default**                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | -------------------------- |
| **`runs-on`**           | JSON array of runner(s) to use.                                                                                                                                                                                                                                         | **false**    | **string** | `["ubuntu-latest"]`        |
|                         | See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                                                                                                                                                                      |              |            |                            |
| **`environment`**       | Destination where to deploy given chart.                                                                                                                                                                                                                                | **true**     | **string** | -                          |
|                         | Can be an environment name or an environment name with a dynamic identifier.                                                                                                                                                                                            |              |            |                            |
|                         | Example: `review-apps:pr-1234`.                                                                                                                                                                                                                                         |              |            |                            |
| **`tag`**               | Tag to use for the deployment.                                                                                                                                                                                                                                          | **false**    | **string** | -                          |
|                         | If not provided, will be set to the current commit SHA.                                                                                                                                                                                                                 |              |            |                            |
| **`url`**               | The URL which respond to deployed application.                                                                                                                                                                                                                          | **false**    | **string** | -                          |
|                         | If not provided, will be set to the environment URL.                                                                                                                                                                                                                    |              |            |                            |
|                         | URL can contains placeholders:                                                                                                                                                                                                                                          |              |            |                            |
|                         | - `{{ identifier }}`: will be replaced by the environment identifier.                                                                                                                                                                                                   |              |            |                            |
|                         | Example: `https://{{ identifier }}.my-application.com`.                                                                                                                                                                                                                 |              |            |                            |
| **`deploy-type`**       | Type of deployment to perform.                                                                                                                                                                                                                                          | **false**    | **string** | `helm-repository-dispatch` |
|                         | Supported values:                                                                                                                                                                                                                                                       |              |            |                            |
|                         | - [`helm-repository-dispatch`](../../actions/deploy/helm-repository-dispatch/README.md).                                                                                                                                                                                |              |            |                            |
| **`deploy-parameters`** | Inputs to pass to the deployment action.                                                                                                                                                                                                                                | **false**    | **string** | -                          |
|                         | JSON object, depending on the deploy-type.                                                                                                                                                                                                                              |              |            |                            |
|                         | For example, for `helm-repository-dispatch`:                                                                                                                                                                                                                            |              |            |                            |
|                         | <!-- textlint-disable --><pre lang="json">{&#13; "repository": "my-org/my-repo"&#13;}</pre><!-- textlint-enable -->                                                                                                                                                     |              |            |                            |
| **`oci-registry`**      | OCI registry where to pull and push images and chart.                                                                                                                                                                                                                   | **false**    | **string** | `ghcr.io`                  |
| **`images`**            | Images to build parameters.                                                                                                                                                                                                                                             | **true**     | **string** | -                          |
|                         | See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/.github/workflows/docker-build-images.md>.                                                                                                                                                        |              |            |                            |
| **`chart-name`**        | Chart name to release.                                                                                                                                                                                                                                                  | **false**    | **string** | `application`              |
|                         | See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.                                                                                                                                                            |              |            |                            |
| **`chart-path`**        | Path to the chart to release.                                                                                                                                                                                                                                           | **false**    | **string** | `charts/application`       |
|                         | See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.                                                                                                                                                            |              |            |                            |
| **`chart-values`**      | Define chart values to be filled.                                                                                                                                                                                                                                       | **false**    | **string** | `[]`                       |
|                         | See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.                                                                                                                                                            |              |            |                            |
|                         | Accept placeholders:                                                                                                                                                                                                                                                    |              |            |                            |
|                         | - `{{ tag }}`: will be replaced by the tag.                                                                                                                                                                                                                             |              |            |                            |
|                         | - `{{ url }}`: will be replaced by the URL.                                                                                                                                                                                                                             |              |            |                            |
|                         | If "path" starts with "deploy", the chart value wil be passed to the deploy action.                                                                                                                                                                                     |              |            |                            |
|                         | Example:                                                                                                                                                                                                                                                                |              |            |                            |
|                         | <!-- textlint-disable --><pre lang="json">[&#13; { "path": ".image", "image": "application" },&#13; { "path": ".application.version", "value": "{{ tag }}" },&#13; { "path": "deploy.ingress.hosts[0].host", "value": "{{ url }}" }&#13;]</pre><!-- textlint-enable --> |              |            |                            |
| **`github-app-id`**     | GitHub App ID to generate GitHub token in place of github-token.                                                                                                                                                                                                        | **false**    | **string** | -                          |
|                         | See <https://github.com/actions/create-github-app-token>.                                                                                                                                                                                                               |              |            |                            |

<!-- inputs:end -->

<!-- secrets:start -->

## Secrets

| **Secret**                  | **Description**                                                           | **Required** |
| --------------------------- | ------------------------------------------------------------------------- | ------------ |
| **`oci-registry-password`** | OCI registry password.                                                    | **true**     |
| **`build-secrets`**         | List of secrets to expose to the build.                                   | **false**    |
|                             | See <https://docs.docker.com/build/ci/github-actions/secrets/>.           |              |
| **`github-token`**          | GitHub token for deploying.                                               | **false**    |
|                             | Permissions:                                                              |              |
|                             | - contents: write                                                         |              |
| **`github-app-key`**        | GitHub App private key to generate GitHub token in place of github-token. | **false**    |
|                             | See <https://github.com/actions/create-github-app-token>.                 |              |

<!-- secrets:end -->

<!-- outputs:start -->
<!-- outputs:end -->

<!-- examples:start -->

## Examples

### Deploy to environment on demand to ArgoCD using GitHub App token

- Using comment trigger (e.g. `/deploy`) on an issue or pull-request.

- Using `workflow_call` to deploy via other workflows.

```yml
---
name: Deploy

on:
  issue_comment:
    types: [created]
  workflow_call:
    inputs:
      tag:
        required: true
        type: string
      environment:
        required: true
        type: string

permissions:
  contents: write
  issues: write
  packages: write
  pull-requests: write
  deployments: write
  actions: read
  id-token: write

jobs:
  deploy:
    name: Deploy
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-chart.yml@38963f37ef5be0b6ae84147f542d96d9eb02802b # 0.14.0
    secrets:
      oci-registry-password: ${{ secrets.GITHUB_TOKEN }}
      github-app-key: ${{ secrets.CI_BOT_APP_PRIVATE_KEY }}
    with:
      url: ${{ (inputs.environment == 'uat' && vars.UAT_URL) || (inputs.environment == 'production' && vars.PRODUCTION_URL) || vars.REVIEW_APPS_URL }}
      tag: ${{ inputs.tag }}
      environment: ${{ inputs.environment }}
      github-app-id: ${{ vars.CI_BOT_APP_ID }}
      deploy-parameters: |
        { "repository": "${{ github.repository_owner }}/argocd-app-of-apps" }
      images: |
        [
           {
            "name": "application",
            "context": ".",
            "dockerfile": "./docker/application/Dockerfile",
            "build-args": { "APP_PATH": "./application/" },
            "target": "prod",
            "platforms": ["linux/amd64"]
          }
        ]
      chart-values: |
        [
          { "path": ".image", "image": "application" },
          { "path": ".application.version", "value": "{{ tag }}" },
          { "path": "deploy.ingress.hosts[0].host", "value": "{{ url }}" }
        ]
```

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

Copyright © 2025 hoverkraft-tech

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->

<!--
// jscpd:ignore-end
-->
