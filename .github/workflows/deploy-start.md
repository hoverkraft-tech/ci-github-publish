<!-- start branding -->
<!-- end branding -->
<!-- start title -->

# GitHub Reusable Workflow: Deploy - Start

<!-- end title -->
<!-- start badges -->
<!-- end badges -->
<!-- start description -->

Reusable workflow that performs the beginning of a deployment.
Trigger:

- Can be triggered by a specific comment.
- Any event that triggers the workflow that's not an "issue_comment".

Environment:

- Support dynamic env when comming from issue or pull-request event

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

## Usage

<!-- start usage -->

```yaml
name: "Deploy - Start"

on:
  workflow_call:

permissions:
  contents: write
  issues: read
  pull-requests: write
  actions: read
  deployments: write
  # FIXME: This is a workaround for having workflow ref. See https://github.com/orgs/community/discussions/38659
  id-token: write

jobs:
  deploy:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/deploy-finish.yml@0.14.0
    with:
      # JSON array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      runs-on: '["ubuntu-latest"]'

      # Environment where to deploy.
      # If trigger is from an issue event (or pull-request), environment will be set to `environment:issue_number`.
      # See <https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/using-environments-for-deployment>.
      environment: ""

      # Comment trigger to start the workflow.
      # See <https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment>.
      trigger-on-comment: "/deploy"
```

<!-- end usage -->

## Permissions

<!-- start permissions -->

This workflow requires the following permissions:

- `actions: read`: to create deployment
- `deployments: write`: to create deployment
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

| **Input**                           | **Description**                                                                                                                                                                                                                                                  | **Default**                    | **Type** | **Required** |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------- | ------------ |
| **<code>runs-on</code>**            | JSON array of runner(s) to use. See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.                                                                                                                                               | <code>["ubuntu-latest"]</code> | `string` | **false**    |
| **<code>environment</code>**        | Environment where to deploy. If trigger is from an issue event (or pull-request), environment will be set to `environment:issue_number`. See <https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/using-environments-for-deployment>. | <code></code>                  | `string` | **false**    |
| **<code>trigger-on-comment</code>** | Comment trigger to start the workflow. See <https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment>.                                                                                                                     | <code>/deploy</code>           | `string` | **false**    |

<!-- end inputs -->

## Outputs

<!-- start outputs -->

| **Output**                     | **Description**                          |
| ------------------------------ | ---------------------------------------- |
| **<code>trigger</code>**       | Trigger event that started the workflow. |
| **<code>environment</code>**   | Environment where to deploy.             |
| **<code>deployment-id</code>** | Deployment ID to use for the deployment. |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
