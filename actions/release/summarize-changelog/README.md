<!-- header:start -->

# ![Icon](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZmlsZS10ZXh0IiBjb2xvcj0iYmx1ZSI+PHBhdGggZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE0IDIgMTQgOCAyMCA4Ij48L3BvbHlsaW5lPjxsaW5lIHgxPSIxNiIgeTE9IjEzIiB4Mj0iOCIgeTI9IjEzIj48L2xpbmU+PGxpbmUgeDE9IjE2IiB5MT0iMTciIHgyPSI4IiB5Mj0iMTciPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPSIxMCA5IDkgOSA4IDkiPjwvcG9seWxpbmU+PC9zdmc+) GitHub Action: Release - Summarize changelog

<div align="center">
  <img src="../../../.github/logo.svg" width="60px" align="center" alt="Release - Summarize changelog" />
</div>

---

<!-- header:end -->

<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-release------summarize--changelog-blue?logo=github-actions)](https://github.com/marketplace/actions/release---summarize-changelog)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/ci-github-publish)](https://github.com/hoverkraft-tech/ci-github-publish/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/ci-github-publish)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/ci-github-publish?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md)

<!-- badges:end -->

<!-- overview:start -->

## Overview

Generate a concise end user release summary from an existing changelog with optional code and link verification.

<!-- overview:end -->

<!-- usage:start -->

## Usage

```yaml
- uses: hoverkraft-tech/ci-github-publish/actions/release/summarize-changelog@6a2562a3f4409f39c7fab100636a90430ee0a8cf # 0.24.0
  with:
    # Markdown changelog body used as the source material for the release summary.
    # This input is required.
    changelog-body: ""

    # Optional repository-relative directory used to narrow GitHub evidence collection.
    # Default: `.`
    working-directory: .

    # Provider model name used to generate the release summary. The action resolves it as `${llm-provider}:${llm-model}` for LangChain `initChatModel`.
    # Default: `gpt-5.4`
    llm-model: gpt-5.4

    # LangChain provider name used to resolve the final model identifier `${llm-provider}:${llm-model}` (`openai`, `anthropic`, `google-genai`).
    # Default: `openai`
    llm-provider: openai

    # Authentication token or API key for the selected LLM provider.
    # This input is required.
    llm-auth: ""

    # Optional JSON-serialized object of additional LangChain `initChatModel` config (for example `{"baseUrl":"https://api.openai.com/v1"}`).
    # Default: `{}`
    llm-config: "{}"

    # Optional Markdown template used by the LLM for the final output.
    # It must contain exactly one `{{release_summary}}` placeholder and exactly one `{{breaking_changes}}` placeholder.
    #
    # Default: `## Release Summary
    #
    # {{release_summary}}
    #
    # ## Breaking changes
    #
    # {{breaking_changes}}
    # `
    summary-template: |
      ## Release Summary

      {{release_summary}}

      ## Breaking changes

      {{breaking_changes}}
```

<!-- usage:end -->

<!-- inputs:start -->

## Inputs

| **Input**               | **Description**                                                                                                                                   | **Required** | **Default**                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`changelog-body`**    | Markdown changelog body used as the source material for the release summary.                                                                      | **true**     | -                                                                                                                                                                                  |
| **`working-directory`** | Optional repository-relative directory used to narrow GitHub evidence collection.                                                                 | **false**    | `.`                                                                                                                                                                                |
| **`llm-model`**         | Provider model name used to generate the release summary. The action resolves it as `${llm-provider}:${llm-model}` for LangChain `initChatModel`. | **false**    | `gpt-5.4`                                                                                                                                                                          |
| **`llm-provider`**      | LangChain provider name used to resolve the final model identifier `${llm-provider}:${llm-model}` (`openai`, `anthropic`, `google-genai`).        | **false**    | `openai`                                                                                                                                                                           |
| **`llm-auth`**          | Authentication token or API key for the selected LLM provider.                                                                                    | **true**     | -                                                                                                                                                                                  |
| **`llm-config`**        | Optional JSON-serialized object of additional LangChain `initChatModel` config (for example `{"baseUrl":"https://api.openai.com/v1"}`).           | **false**    | `{}`                                                                                                                                                                               |
| **`summary-template`**  | Optional Markdown template used by the LLM for the final output.                                                                                  | **false**    | <!-- textlint-disable --><pre lang="text">## Release Summary&#13;&#13;{{release_summary}}&#13;&#13;## Breaking changes&#13;&#13;{{breaking_changes}}</pre><!-- textlint-enable --> |
|                         | It must contain exactly one `{{release_summary}}` placeholder and exactly one `{{breaking_changes}}` placeholder.                                 |              |                                                                                                                                                                                    |

<!-- inputs:end -->

<!-- outputs:start -->

## Outputs

| **Output**       | **Description**                                  |
| ---------------- | ------------------------------------------------ |
| **`summary`**    | Rendered Markdown release summary.               |
| **`llm-prompt`** | Prompt text sent to the configured LLM provider. |

<!-- outputs:end -->

The action uses the GitHub API to inspect referenced commits and pull requests, so it does not require a full repository history checkout to build evidence.

<!-- secrets:start -->
<!-- secrets:end -->

<!-- examples:start -->
<!-- examples:end -->

<!-- contributing:start -->

## Contributing

Contributions are welcome! Please see the [contributing guidelines](https://github.com/hoverkraft-tech/ci-github-publish/blob/main/CONTRIBUTING.md) for more details.

<!-- contributing:end -->

<!-- security:start -->
<!-- security:end -->

<!-- license:start -->

## License

This project is licensed under the MIT License.

SPDX-License-Identifier: MIT

Copyright © 2026 hoverkraft

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->

<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->
