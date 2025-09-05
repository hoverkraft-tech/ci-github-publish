<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:activity color:blue>" /> GitHub Action: Check - URL - Ping

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

Action to run ping check on given URL.

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/ci-github-publish@0.8.0
  with:
    # Description: The URL to check.
    #
    url: ""

    # Description: Whether to follow redirects.
    #
    # Default: false
    follow-redirect: ""

    # Description: Timeout in seconds for the URL check.
    #
    # Default: 10
    timeout: ""

    # Description: Number of retries if the URL check fails.
    #
    # Default: 3
    retries: ""

    # Description: Expected HTTP status codes. Comma separated list.
    #
    # Default: 200
    expected-statuses: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                      | **Description**                                   | **Default**        | **Required** |
| ------------------------------ | ------------------------------------------------- | ------------------ | ------------ |
| <code>url</code>               | The URL to check.                                 |                    | **true**     |
| <code>follow-redirect</code>   | Whether to follow redirects.                      | <code>false</code> | **false**    |
| <code>timeout</code>           | Timeout in seconds for the URL check.             | <code>10</code>    | **false**    |
| <code>retries</code>           | Number of retries if the URL check fails.         | <code>3</code>     | **false**    |
| <code>expected-statuses</code> | Expected HTTP status codes. Comma separated list. | <code>200</code>   | **false**    |

<!-- end inputs -->
<!-- start outputs -->

| **Output**               | **Description**                                 |
| ------------------------ | ----------------------------------------------- |
| <code>status-code</code> | The HTTP status code returned by the URL check. |

<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
