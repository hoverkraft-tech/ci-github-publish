<!-- start branding -->
<!-- end branding -->
<!-- start title -->

# GitHub Reusable Workflow: Deploy chart

<!-- end title -->
<!-- start badges -->
<!-- end badges -->
<!-- start description -->

Reusable workflow that performs a deployment of an Helm chart.

- Builds OCI images.
- Releases the chart.
- Supports multiple deployment types.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

## Usage

<!-- start usage -->

````yaml
name: Deploy chart

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
  # FIXME: This is a workaround for having workflow actions. See https://github.com/orgs/community/discussions/38659
  id-token: write

jobs:
  deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-chart.yml@0.8.0
    with:
      # JSON array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      runs-on: '["ubuntu-latest"]'

      # Destination where to deploy given chart.
      # Can be an environment name or an environment name with a dynamic identifier.
      # Example: `review-apps:pr-1234`.
      environment: ""

      # Tag to use for the deployment.
      # If not provided, will be set to the current commit SHA.
      tag: ""

      # The URL which respond to deployed application.
      # If not provided, will be set to the environment URL.
      # Url can contains placeholders:
      # - `{{ identifier }}`: will be replaced by the environment identifier.
      #   Example: `https://{{ identifier }}.my-application.com`.
      url: ""

      # Type of deployment to perform.
      # Supported values:
      #   - [`helm-repository-dispatch`](../../actions/deploy/helm-repository-dispatch/README.md).
      deploy-type: "helm-repository-dispatch"

      # Inputs to pass to the deployment action.
      # JSON object, depending on the deploy-type.
      # For example, for `helm-repository-dispatch`:
      # ```json
      # {
      #    "repository": "my-org/my-repo"
      # }
      # ```
      deploy-parameters: ""

      # OCI registry where to pull and push images and chart.
      oci-registry: "ghcr.io"

      # Images to build parameters.
      # See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/.github/workflows/docker-build-images.md>.
      images: ""

      # Chart name to release.
      # See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.
      chart-name: "application"

      # Path to the chart to release.
      # See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.
      chart-path: "charts/application"

      # Define chart values to be filled.
      # See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.
      # Accept placeholders:
      #   - `{{ tag }}`: will be replaced by the tag.
      #   - `{{ url }}`: will be replaced by the URL.
      # If "path" starts with "deploy", the chart value wil be passed to the deploy action.
      # Example:
      # ```json
      #   [
      #     { "path": ".image", "image": "application" },
      #     { "path": ".application.version", "value": "{{ tag }}" },
      #     { "path": "deploy.ingress.hosts[0].host", "value": "{{ url }}" }
      #   ]
      # ```
      chart-values: "[]"

      # GitHub App ID to generate GitHub token in place of github-token.
      # See <https://github.com/actions/create-github-app-token>.
      github-app-id: ""
    secrets:
      # OCI registry password.
      oci-registry-password: ""

      # GitHub token for deploying.
      # Permissions:
      #   - contents: write
      github-token: ""

      # GitHub App private key to generate GitHub token in place of github-token.
      # See <https://github.com/actions/create-github-app-token>.
      github-app-key: ""
````

<!-- end usage -->

## Permissions

<!-- start permissions -->

This workflow requires the following permissions:

- `actions: read`: to create deployment
- `contents: write`: to dispatch an event to a remote repository
- `deployments: write`: to create deployment
- `issues: write`: to write the comment on the PR
- `packages: write`: to push packages
- `pull-requests: write`: to write the comment on the PR

<!-- end permissions -->
<!--
// jscpd:ignore-start
-->

## Secrets

<!-- start secrets -->

| **Secret**                             | **Description**                                                                                                                     | **Default**               | **Required** |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------ |
| **<code>oci-registry-password</code>** | OCI registry password.                                                                                                              | <code></code>             | **true**     |
| **<code>github-token</code>**          | GitHub token for deploying. Permissions: - contents: write.                                                                         | <code>GITHUB_TOKEN</code> | **false**    |
| **<code>github-app-key</code>**        | GitHub App private key to generate GitHub token in place of github-token. See <https://github.com/actions/create-github-app-token>. | <code></code>             | **false**    |

<!-- end secrets -->
<!--
// jscpd:ignore-end
-->

## Inputs

<!-- markdownlint-disable MD013 -->
<!-- start inputs -->

| **Input**                          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Default**                           | **Type** | **Required** |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------- | ------------ |
| **<code>runs-on</code>**           | JSON array of runner(s) to use. See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                                                                                                                                                                                                                                                                                                                                                                                                                   | <code>["ubuntu-latest"]</code>        | `string` | **false**    |
| **<code>environment</code>**       | Destination where to deploy given chart. Can be an environment name or an environment name with a dynamic identifier. Example: `review-apps:pr-1234`.                                                                                                                                                                                                                                                                                                                                                                                                | <code></code>                         | `string` | **true**     |
| **<code>tag</code>**               | Tag to use for the deployment. If not provided, will be set to the current commit SHA.                                                                                                                                                                                                                                                                                                                                                                                                                                                               | <code></code>                         | `string` | **false**    |
| **<code>`url`</code>**             | The URL which respond to deployed application. If not provided, will be set to the environment URL. URL can contains placeholders: - `{{ identifier }}`: will be replaced by the environment identifier. Example: `https://{{ identifier }}.my-application.com`.                                                                                                                                                                                                                                                                                     | <code></code>                         | `string` | **false**    |
| **<code>deploy-type</code>**       | Type of deployment to perform. Supported values: - [`helm-repository-dispatch`](../../actions/deploy/helm-repository-dispatch/README.md).                                                                                                                                                                                                                                                                                                                                                                                                            | <code>helm-repository-dispatch</code> | `string` | **false**    |
| **<code>deploy-parameters</code>** | Inputs to pass to the deployment action. JSON object, depending on the deploy-type. For example, for `helm-repository-dispatch`: <code>{"repository": "my-org/my-repo" }</code>                                                                                                                                                                                                                                                                                                                                                                      | <code></code>                         | `string` | **false**    |
| **<code>oci-registry</code>**      | OCI registry where to pull and push images and chart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | <code>ghcr.io</code>                  | `string` | **false**    |
| **<code>images</code>**            | Images to build parameters. See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/.github/workflows/docker-build-images.md>.                                                                                                                                                                                                                                                                                                                                                                                                         | <code></code>                         | `string` | **true**     |
| **<code>chart-name</code>**        | Chart name to release. See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.                                                                                                                                                                                                                                                                                                                                                                                                                  | <code>application</code>              | `string` | **false**    |
| **<code>chart-path</code>**        | Path to the chart to release. See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>.                                                                                                                                                                                                                                                                                                                                                                                                           | <code>charts/application</code>       | `string` | **false**    |
| **<code>chart-values</code>**      | Define chart values to be filled. See <https://github.com/hoverkraft-tech/ci-github-container/blob/main/actions/helm/release-chart/README.md>. Accept placeholders: - `{{ tag }}`: will be replaced by the tag. - `{{ url }}`: will be replaced by the URL. If "path" starts with "deploy", the chart value wil be passed to the deploy action. Example: <code>`[ { "path": ".image", "image": "application" }, { "path": ".application.version", "value": "{{ tag }}" }, { "path": "deploy.ingress.hosts[0].host", "value": "{{ url }}" } ]`</code> | <code></code>                         | `string` | **false**    |
| **<code>[]</code>**                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | <code></code>                         | `string` | **false**    |
| **<code>github-app-id</code>**     | GitHub App ID to generate GitHub token in place of github-token. See <https://github.com/actions/create-github-app-token>.                                                                                                                                                                                                                                                                                                                                                                                                                           | <code></code>                         | `string` | **false**    |

<!-- end inputs -->
<!-- markdownlint-enable MD013 -->
<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
