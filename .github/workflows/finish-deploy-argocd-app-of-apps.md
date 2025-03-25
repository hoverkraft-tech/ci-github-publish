<!-- start branding -->
<!-- end branding -->
<!-- start title -->

# GitHub Reusable Workflow: Finish deploy - ArgoCD App Of Apps

<!-- end title -->
<!-- start badges -->
<!-- end badges -->
<!-- start description -->

Reusable workflow to finish a deploy process in an ArgoCD App Of Apps Pattern context.
See <https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern>.
This workflow is triggered by a repository dispatch event.
See <https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch>.
Payload:

```json
{
  "event_type": "finish-deploy",
  "client_payload": {
    "deployment-id": "unique deployment id (e.g. 1234)",
    "repository": "repository name (e.g. my-repository)",
    "url": "url of the deployed application (e.g. https://my-application.com)",
    "state": "status of the deployment (e.g. success, failure)",
    "description": "description of the deployment (e.g. deployment successful)"
  }
}
```

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

# Usage

<!-- start usage -->

```yaml
name: "Clean deploy for ArgoCD App of Apps"

on:
  repository_dispatch:
    types: [finish-deploy]

permissions:
  contents: read
  # FIXME: This is a workaround for having workflow actions. See https://github.com/orgs/community/discussions/38659
  id-token: write

concurrency:
  group: ci-commit-${{ github.ref }}
  cancel-in-progress: true

jobs:
  finish-deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/finish-deploy.yml@0.14.0
    with:
      # Json array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      runs-on: '["ubuntu-latest"]'

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

## Inputs

<!-- start inputs -->

| **Input**                      | **Description**                                                                                                            | **Default**                    | **Required** |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------ |
| **<code>runs-on</code>**       | Json array of runner(s) to use. See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.         | <code>["ubuntu-latest"]</code> | **false**    |
| **<code>github-app-id</code>** | GitHub App ID to generate GitHub token in place of github-token. See <https://github.com/actions/create-github-app-token>. | <code></code>                  | **false**    |

<!-- end inputs -->
<!--
// jscpd:ignore-end
-->

<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
