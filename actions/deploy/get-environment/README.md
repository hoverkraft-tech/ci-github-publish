<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:flag color:blue>" /> GitHub Action: Deploy - Get Environment

<!-- end title -->
<!--
// jscpd:ignore-start
-->
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:flag color:blue>" />

<!-- end branding -->
<!-- markdownlint-disable MD013 -->
<!-- start badges -->

<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20tag" /></a><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Freleases%2Flatest"><img src="https://img.shields.io/github/release-date/hoverkraft-tech/ci-github-publish?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20date" /></a><img src="https://img.shields.io/github/last-commit/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Commit" /><a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fci-github-publish%2Fissues"><img src="https://img.shields.io/github/issues/hoverkraft-tech/ci-github-publish?logo=github&style=flat-square" alt="Open%20Issues" /></a><img src="https://img.shields.io/github/downloads/hoverkraft-tech/ci-github-publish/total?logo=github&style=flat-square" alt="Downloads" />

<!-- end badges -->
<!--
// jscpd:ignore-end
-->
<!-- start description -->

Action to get the environment to deploy regarding the workflow context.

- If the workflow is triggered by an issue event (or pull-request):
  If an environement is given, the environment will be set to `environment:issue_number`.
  If no environment is given, the environment will be set to `review-apps:issue_number`.
- Else if no environment is given, the action will fail.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

## Usage

<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.6.1
  with:
    # Description: Environment where to deploy.
    #
    environment: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                | **Description**              | **Default** | **Required** |
| ------------------------ | ---------------------------- | ----------- | ------------ |
| <code>environment</code> | Environment where to deploy. |             | **false**    |

<!-- end inputs -->
<!-- start outputs -->

| **Output**               | **Description**                      |
| ------------------------ | ------------------------------------ |
| <code>environment</code> | The proper environment to deploy to. |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
