<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:activity color:blue>" /> GitHub Action: Deploy Helm chart via a repository dispatch

<!-- end title -->
<!-- start description -->

Action to deploy an Helm chart via GitHub repository dispatch event.
See <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-dispatch-event>.
See <https://github.com/peter-evans/repository-dispatch>.<br />The target repository should implement a workflow that handle this dispatch event.
See <https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#repository_dispatch>.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.2.0
  with:
    # Description: GitHub Token for dispatch an event to a remote repository.
    # Permissions:
    #
    # - contents: write See
    #   <https://github.com/peter-evans/repository-dispatch#usage>.
    #
    # Default: ${{ github.token }}
    github-token: ""

    # Description: Chart to deploy. Example:
    # "ghcr.io/my-org/my-repo/charts/application/my-repo:0.1.0-rc.0".
    #
    chart: ""

    # Description: Chart values to be sent to deployment. JSON array. Example:
    # '[{"path":".application.test","value":"ok"}]'.
    #
    chart-values: ""

    # Description: Target repository where to deploy given chart.
    #
    repository: ""

    # Description: Destination where to deploy given chart.
    #
    environment: ""

    # Description: The URL which respond to deployed application.
    #
    url: ""
```

<!-- end usage -->
<!--
// jscpd:ignore-start
-->
<!-- start inputs -->

| **Input**                 | **Description**                                                                                                                                                            | **Default**                      | **Required** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------ |
| <code>github-token</code> | GitHub Token for dispatch an event to a remote repository.<br />Permissions: <br /> - contents: write<br />See <https://github.com/peter-evans/repository-dispatch#usage>. | <code>${{ github.token }}</code> | **false**    |
| <code>chart</code>        | Chart to deploy. Example: "ghcr.io/my-org/my-repo/charts/application/my-repo:0.1.0-rc.0".                                                                                  |                                  | **true**     |
| <code>chart-values</code> | Chart values to be sent to deployment. JSON array.<br />Example: '[{"path":".application.test","value":"ok"}]'.                                                            |                                  | **false**    |
| <code>repository</code>   | Target repository where to deploy given chart.                                                                                                                             |                                  | **true**     |
| <code>environment</code>  | Destination where to deploy given chart.                                                                                                                                   |                                  | **true**     |
| <code>url</code>          | The URL which respond to deployed application.                                                                                                                             |                                  | **true**     |

<!-- end inputs -->
<!--
// jscpd:ignore-end
-->
<!-- start outputs -->

| **Output**       | **Description**                 |
| ---------------- | ------------------------------- |
| <code>url</code> | URL of the deployed application |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
