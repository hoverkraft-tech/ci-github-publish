<!-- start branding -->
<!-- end branding -->
<!-- start title -->

# GitHub Reusable Workflow: Deploy ArgoCD App of Apps

<!-- end title -->
<!-- start badges -->
<!-- end badges -->
<!-- start description -->

Deploy workflow to deploy a Helm chart in a ArgoCD App Of Apps Pattern context.
See <https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern>.

This workflow is triggered by a repository dispatch event.
See <https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch>.
Payload:

```json
{
  "event_type": "deploy",
  "client_payload": {
    "environment": "where to deploy application (e.g. reviews-app, staging, production)",
    "repository": "repository name (e.g. my-repository)",
    "chart": "full chart name image tag (e.g. ghcr.io/my-org/my-repository/charts/application:0.1.14-pr-82-xxx)",
    "chart-values": "Values to be replaced in the chart (e.g. [{\"path\":\"application.appUri\",\"value\":\"https://my-app-review-app-1234.my-org.com\"}])"
  }
}
```

It supports templated Application.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

# Usage

<!-- start usage -->

```yaml
name: "Deploy ArgoCD App of Apps"

on:
  repository_dispatch:
    types: [deploy]

permissions:
  contents: read
  pull-requests: write
  # FIXME: This is a workaround for having workflow actions. See https://github.com/orgs/community/discussions/38659
  id-token: write

concurrency:
  group: ci-commit-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-argocd-app-of-apps.yml@0.7.1
    with:
      # Json array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      runs-on: '["ubuntu-latest"]'

      # Filename of the template to use.
      template-filename: "template.yml.tpl"

      # GitHub App ID to generate GitHub token in place of github-token.
      # See <https://github.com/actions/create-github-app-token>.
      github-app-id: ""
    secrets:
      # GitHub token for creating and merging pull request (permissions contents: write and pull-requests: write, workflows: write).
      # See <https://github.com/hoverkraft-tech/ci-github-common/blob/main/actions/create-and-merge-pull-request/README.md>.
      github-token: ""

      # GitHub App private key to generate GitHub token in place of github-token.
      # See <https://github.com/actions/create-github-app-token>.
      github-app-key: ""
```

<!-- end usage -->

## Permissions

<!-- start permissions -->

This workflow requires the following permissions:

- `contents: read`: To read the contents of the repository
- `pull-requests: write`: To create and merge pull requests

<!-- end permissions -->
<!--
// jscpd:ignore-start
-->

## Secrets

<!-- start secrets -->

| **Secret**                      | **Description**                                                                                                                                                                                                                                   | **Default**               | **Required** |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------ |
| **<code>github-token</code>**   | GitHub token for creating and merging pull request (permissions contents: write and pull-requests: write, workflows: write). See <https://github.com/hoverkraft-tech/ci-github-common/blob/main/actions/create-and-merge-pull-request/README.md>. | <code>GITHUB_TOKEN</code> | **false**    |
| **<code>github-app-key</code>** | GitHub App private key to generate GitHub token in place of github-token. See <https://github.com/actions/create-github-app-token>.                                                                                                               | <code></code>             | **false**    |

<!-- end secrets -->
<!--
// jscpd:ignore-end
-->

## Inputs

<!-- start inputs -->

| **Input**                          | **Description**                                                                                                            | **Default**                    | **Required** |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------ |
| **<code>runs-on</code>**           | Json array of runner(s) to use. See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.         | <code>["ubuntu-latest"]</code> | **false**    |
| **<code>template-filename</code>** | Filename of the template to use.                                                                                           | <code>template.yml.tpl</code>  | **false**    |
| **<code>github-app-id</code>**     | GitHub App ID to generate GitHub token in place of github-token. See <https://github.com/actions/create-github-app-token>. | <code></code>                  | **false**    |

<!-- end inputs -->

<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
