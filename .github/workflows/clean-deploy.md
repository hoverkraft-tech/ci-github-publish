<!-- start branding -->
<!-- end branding -->
<!-- start title -->

# GitHub Reusable Workflow: Clean deploy

<!-- end title -->
<!-- start badges -->
<!-- end badges -->
<!-- start description -->

Reusable workflow to clean a deployment.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

# Usage

<!-- start usage -->

````yaml
name: "Clean deploy"

on:
  pull_request_target:
    types: [closed]

permissions:
  contents: write
  issues: write
  packages: write
  pull-requests: write
  actions: read
  deployments: write
  # FIXME: This is a workaround for having workflow ref. See https://github.com/orgs/community/discussions/38659
  id-token: write

concurrency:
  group: ci-commit-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/clean-deploy.yml@0.6.0
    with:
      # Json array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      runs-on: '["ubuntu-latest"]'

      # Type of clean-deploy action
      # Supported values:
      #   - [`repository-dispatch`](../../actions/clean-deploy/repository-dispatch/README.md).
      clean-deploy-type: "repository-dispatch"

      # Inputs to pass to the clean action.
      # JSON object, depending on the clean-deploy-type.
      # For example, for `repository-dispatch`:
      # ```json
      # {
      #   "repository": "my-org/my-repo"
      # }
      # ```
      clean-deploy-parameters: ""

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
````

<!-- end usage -->

## Permissions

<!-- start permissions -->

This workflow requires the following permissions:

- `actions: read`: to delete deployment
- `contents: write`: to dispatch an event to a remote repository
- `deployments: write`: to delete deployment
- `issues: write`: to write the comment on the PR
- `packages: write`: to delete packages
- `pull-requests: write`: to write the comment on the PR

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

| **Input**                                | **Description**                                                                                                                                                 | **Default**                      | **Type** | **Required** |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------- | ------------ |
| **<code>runs-on</code>**                 | Json array of runner(s) to use. See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                              | <code>["ubuntu-latest"]</code>   | `string` | **false**    |
| **<code>clean-deploy-type</code>**       | Type of clean-deploy action. Supported values: - [`repository-dispatch`](../../actions/clean-deploy/repository-dispatch/README.md).                             | <code>repository-dispatch</code> | `string` | **false**    |
| **<code>clean-deploy-parameters</code>** | Inputs to pass to the clean action. JSON object, depending on the clean-deploy-type. For example, for `repository-dispatch`: { "repository": "my-org/my-repo" } | <code></code>                    | `string` | **false**    |
| **<code>github-app-id</code>**           | GitHub App ID to generate GitHub token in place of github-token. See <https://github.com/actions/create-github-app-token>.                                      | <code></code>                    | `string` | **false**    |

<!-- end inputs -->

<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
