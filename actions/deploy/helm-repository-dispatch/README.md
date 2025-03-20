<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:activity color:blue>" /> GitHub Action: Deploy Helm chart via a repository dispatch

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:activity color:blue>" />

<!-- end branding -->
<!-- markdownlint-disable MD013 -->
<!-- start badges -->

<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20tag" /></a><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/release-date/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20date" /></a><img src="https://img.shields.io/github/last-commit/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Commit" /><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Fissues"><img src="https://img.shields.io/github/issues/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Open%20Issues" /></a><img src="https://img.shields.io/github/downloads/hoverkraft-tech/ci-github-publish/total?logo=github&style=flat-square" alt="Downloads" />

<!-- end badges -->
<!-- markdownlint-enable MD013 -->
<!--
// jscpd:ignore-end
-->
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
- uses: hoverkraft-tech/ci-github-publish@0.3.2
  with:
    # Description: Deployment ID to be used in the ArgoCD application manifest
    #
    deployment-id: ""

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

    # Description: Environment where to deploy given chart.
    #
    environment: ""

    # Description: The URL which respond to deployed application.
    #
    url: ""

    # Description: GitHub Token for dispatch an event to a remote repository.
    # Permissions:
    #
    # - contents: write See
    #   <https://github.com/peter-evans/repository-dispatch#usage>.
    #
    # Default: ${{ github.token }}
    github-token: ""
```

<!-- end usage -->
<!-- start inputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
