<!-- start branding -->
<!-- end branding -->
<!-- start title -->

# GitHub Reusable Workflow: Prepare release

<!-- end title -->
<!-- start badges -->
<!-- end badges -->
<!-- start description -->

Reusable workflow that performs release preparation tasks:

- Add proper labels to pull requests
- Ensure release configuration is up to date

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

# Usage

<!-- start usage -->

```yaml
name: "Prepare release"

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, reopened, synchronize]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/prepare-release.yml@0.14.0
    with:
      # Json array of runner(s) to use.
      # See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>.
      runs-on: '["ubuntu-latest"]'
    secrets:
      # GitHub token with permissions `contents: write`, `pull-requests: write`.
      # See <https://github.com/hoverkraft-tech/ci-github-common/blob/main/actions/create-and-merge-pull-request/README.md>.
      github-token: ""
```

<!-- end usage -->

## Permissions

<!-- start permissions -->

This workflow requires the following permissions:

- `contents: write`: To read the contents of the repository and write configuration file.
- `pull-requests: write`: To create and merge pull requests, and to add labels to pull requests.

<!-- end permissions -->

## Secrets

<!-- start secrets -->

| **Secret**                    | **Description**                                                          | **Default**               | **Required** |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------------- | ------------ |
| **<code>github-token</code>** | GitHub token with permissions `contents: write`, `pull-requests: write`. | <code>GITHUB_TOKEN</code> | **false**    |

<!-- end secrets -->

## Inputs

<!-- start inputs -->

| **Input**                | **Description**                                                                                                    | **Default**                    | **Required** |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------ | ------------ |
| **<code>runs-on</code>** | Json array of runner(s) to use. See <https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job>. | <code>["ubuntu-latest"]</code> | **false**    |

<!-- end inputs -->

<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
