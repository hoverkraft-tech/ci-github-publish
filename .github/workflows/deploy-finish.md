<!-- start branding -->
<!-- end branding -->
<!-- start title -->

# GitHub Reusable Workflow: Deploy - Finish

<!-- end title -->
<!-- start badges -->
<!-- end badges -->
<!-- start description -->

Reusable workflow that performs the end of a deployment.

- Perform checks on the deployment if a URL is provided:
  - [Ping check](../../actions/check/url-ping/README.md).
  - [Lighthouse check](../../actions/check/url-lighthouse/README.md).
- Update the deployment status to success or failure.
- Report the deployment summary and status. See [report](../../actions/deploy/report/README.md).

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

# Usage

<!-- start usage -->

```yaml
name: "Deploy - Finish"

on:
  workflow_call:

permissions:
  actions: read
  deployments: write
  issues: read
  pull-requests: write
  # FIXME: This is a workaround for having workflow ref. See https://github.com/orgs/community/discussions/38659
  id-token: write

jobs:
  deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-finish.yml@0.7.1
    with:
      # Json array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      runs-on: '["ubuntu-latest"]'

      # Environment where to deployment has been made.
      environment: ""

      # Deployment ID to use for the deployment.
      # See <https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#list-deployments>.
      deployment-id: ""

      # Path to the budget file to use for the Lighthouse check.
      # See [`url-lighthouse`](../../actions/check/url-lighthouse/action.yml/README.md).
      budget-path: "./budget.json"

      # Extra information to send to the deployment summary.
      # Should be a JSON object.
      extra: ""
```

<!-- end usage -->

## Permissions

<!-- start permissions -->

This workflow requires the following permissions:

- `actions: read`: to update deployment status
- `deployments: write`: to update deployment status
- `issues: write`: to write the comment on the PR
- `pull-requests: write`: to write the comment on the PR

<!-- end permissions -->
<!--
// jscpd:ignore-start
-->

## Secrets

<!-- start secrets -->

| **Secret** | **Description** | **Default** | **Required** |
| ---------- | --------------- | ----------- | ------------ |

<!-- end secrets -->
<!--
// jscpd:ignore-end
-->

## Inputs

<!-- start inputs -->

| **Input**                      | **Description**                                                                                                                                | **Default**                    | **Type** | **Required** |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------- | ------------ |
| **<code>runs-on</code>**       | Json array of runner(s) to use. See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                             | <code>["ubuntu-latest"]</code> | `string` | **false**    |
| **<code>environment</code>**   | Environment where to deployment has been made.                                                                                                 | <code></code>                  | `string` | **true**     |
| **<code>deployment-id</code>** | Deployment ID to use for the deployment. See <https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#list-deployments>. | <code></code>                  | `string` | **true**     |
| **<code>budget-path</code>**   | Path to the budget file to use for the Lighthouse check. See [`url-lighthouse`](../../actions/check/url-lighthouse/action.yml/README.md).      | <code>./budget.json</code>     | `string` | **false**    |
| **<code>extra</code>**         | Extra information to send to the deployment summary. Should be a JSON object.                                                                  | <code></code>                  | `string` | **false**    |

<!-- end inputs -->

<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
