<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:trash-2 color:blue>" /> GitHub Action: Clean deploy via a repository dispatch

<!-- end title -->
<!-- start description -->

Action to clean a deployment via GitHub repository dispatch event.
See <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-dispatch-event>.
See <https://github.com/peter-evans/repository-dispatch>.<br />The target repository should implement a workflow that handle this dispatch event.
See <https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#repository_dispatch>.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.6.1
  with:
    # Description: GitHub Token for dispatch an event to a remote repository.
    # Permissions:
    #
    # - contents: write See
    #   <https://github.com/peter-evans/repository-dispatch#usage>.
    #
    # Default: ${{ github.token }}
    github-token: ""

    # Description: Target repository where the deployment should be cleaned.
    #
    repository: ""

    # Description: Environment where to clean the deployment.
    #
    environment: ""
```

<!-- end usage -->
<!--
// jscpd:ignore-start
-->
<!-- start inputs -->

| **Input**                 | **Description**                                                                                                                                                            | **Default**                      | **Required** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------ |
| <code>github-token</code> | GitHub Token for dispatch an event to a remote repository.<br />Permissions: <br /> - contents: write<br />See <https://github.com/peter-evans/repository-dispatch#usage>. | <code>${{ github.token }}</code> | **false**    |
| <code>repository</code>   | Target repository where the deployment should be cleaned.                                                                                                                  |                                  | **true**     |
| <code>environment</code>  | Environment where to clean the deployment.                                                                                                                                 |                                  | **true**     |

<!-- end inputs -->
<!--
// jscpd:ignore-end
-->
<!-- start outputs -->

| **Output**       | **Description**                 |
| ---------------- | ------------------------------- |
| <code>URL</code> | URL of the deployed application |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
