<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:activity color:blue>" /> GitHub Action: Deploy

<!-- end title -->
<!-- start description -->

Action to deploy a given image to a given target

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: aircorsica/continuous-integration@3.0.0
  with:
    # Description: GitHub Token for dispatch an event to a remote repository. See
    # <https://github.com/peter-evans/repository-dispatch#usage>
    #
    dispatch-token: ""

    # Description: Chart to deploy. Example:
    # ghcr.io/my-org/my-repo/charts/application/my-repo:0.1.0-rc.0
    #
    chart: ""

    # Description: Destination where to deploy given chart
    #
    target: ""

    # Description: The URL which respond to deployed application
    #
    url: ""

    # Description: Chart values to be sent to deployment
    #
    deploy-chart-values: ""
```

<!-- end usage -->
<!--
// jscpd:ignore-start
-->
<!-- start inputs -->

| **Input**                        | **Description**                                                                                                           | **Default** | **Required** |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| <code>dispatch-token</code>      | GitHub Token for dispatch an event to a remote repository. See <https://github.com/peter-evans/repository-dispatch#usage> |             | **true**     |
| <code>chart</code>               | Chart to deploy. Example: ghcr.io/my-org/my-repo/charts/application/my-repo:0.1.0-rc.0                                    |             | **true**     |
| <code>target</code>              | Destination where to deploy given chart                                                                                   |             | **true**     |
| <code>URL</code>                 | The URL which respond to deployed application                                                                             |             | **true**     |
| <code>deploy-chart-values</code> | Chart values to be sent to deployment                                                                                     |             | **true**     |

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
