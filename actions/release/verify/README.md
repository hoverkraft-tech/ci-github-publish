<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItc2hpZWxkIiBjb2xvcj0iYmx1ZSI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiI+PC9wYXRoPjwvc3ZnPg==) GitHub Action: Verify release sources

<!-- header:end -->
<!-- overview:start -->

## Overview

Verify that release artifacts belong to this run and commit, reject conflicting tags, and identify already published releases without changing repository state.

<!-- overview:end -->
<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/verify@<commit-sha>
  with:
    # JSON array of validated artifact IDs from this workflow run and source commit. Require successful producer jobs with needs; artifact metadata does not prove validation passed.
    # This input is required.
    artifact-ids: ""

    # JSON array of release tags. Existing lightweight or annotated tags must resolve to this workflow's source commit. Package-specific version validation belongs to the caller.
    # This input is required.
    tags: ""

    # Require every tag to exist already, for releases prepared before validation. Leave false when publication creates new source tags.
    # Default: `false`
    require-tags: "false"
```

<!-- usage:end -->
<!-- inputs:start -->

## Inputs

| **Input**          | **Description**                                                                                                                                                                 | **Required** | **Default** |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------- |
| **`artifact-ids`** | JSON array of validated artifact IDs from this workflow run and source commit. Require successful producer jobs with needs; artifact metadata does not prove validation passed. | **true**     | -           |
| **`tags`**         | JSON array of release tags. Existing lightweight or annotated tags must resolve to this workflow's source commit. Package-specific version validation belongs to the caller.    | **true**     | -           |
| **`require-tags`** | Require every tag to exist already, for releases prepared before validation. Leave false when publication creates new source tags.                                              | **false**    | `false`     |

<!-- inputs:end -->
<!-- secrets:start -->
<!-- secrets:end -->
<!-- outputs:start -->

## Outputs

| **Output**     | **Description**                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| **`releases`** | JSON array of objects containing tag and published. A matching draft or absent release has published=false. |

<!-- outputs:end -->
