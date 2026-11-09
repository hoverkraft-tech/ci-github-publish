# Bundle action-owned dependencies

Date: 2026-11-08

Status: Proposed

## Context

Release configuration and preparation install their own locked Node.js dependencies on every call. These helpers can execute checked-in distributions without npm or registry access. Changelog summarization also installs dependencies but uses dynamic provider imports. Jampack includes platform-specific binaries.

## Decision

Bundle eligible action-owned JavaScript with the locked version of `@vercel/ncc`.
Commit the generated distribution and dependency licenses. Execute it through
`actions/github-script`, removing the action's Node.js setup and npm installation.
Keep caller-project dependency installation and public action contracts unchanged.

CI must rebuild and compare the distribution, run source tests, and exercise the
distribution outside the source tree without `node_modules`. Keep dependency
review and source security analysis enabled. Mark generated files explicitly so
formatters and source analyzers do not rewrite or duplicate bundled dependencies.

Do not distribute host-specific binaries or silently narrow supported plugin
loading to make a bundle compile. Record compatibility findings before deciding
whether a toolchain should use a separate prebuilt distribution.

## Scope and compatibility

Bundle `release/get-configuration` and `release/prepare`. Preserve Release
Drafter's upstream third-party notices alongside the notices from every locked
runtime package; ncc cannot reconstruct licenses of prebundled code.

Keep `release/summarize-changelog` and `deploy/jampack` unchanged. An isolated ncc
probe failed to load `@langchain/openai` through the dynamic LangChain loader.
Jampack requires platform-selected Sharp and esbuild binaries. The
[cross-repository audit](https://github.com/hoverkraft-tech/ci-github-common/blob/perf/475-p2-report-parser-bundle/docs/adr/0002-audit-action-dependency-distributions.md)
records the acceptance criteria for those follow-ups.

## Automated dependency updates

Adopt the single public distribution workflow and dedicated action from ci-github-common.
Keep only the pull_request and workflow_run event wrappers, App credential wiring,
and explicit workflow inputs in this repository. Both event callers configure package
directories and author rules; no separate configuration file is required. GitHub
rejects a caller listening to its own completion, so the event files stay separate.
The shared builder regenerates affected bundles and licenses without write
credentials; the trusted writer commits them into the same allowed dependency PR after
validating the origin, allowed paths and current head. Existing distribution and
source tests remain required. Generated commits use a Dependabot-specific marker or Renovate
`gitIgnoredAuthors`, and a fixed trailer prevents loops when the updater and writer
share an App. They trigger normal CI through the CI bot App. Existing Renovate
manager coverage is unchanged.

[Common ADR 0002](https://github.com/hoverkraft-tech/ci-github-common/blob/efb976f9ffe34ec5f8b630833dfd7654e408b693/docs/adr/0002-audit-action-dependency-distributions.md)
owns the security contract and alternatives. Automatic publication starts only
once the callers and their policy inputs reach the default branch. Post-rollout
Dependabot and Renovate updates must verify App permissions, CI retrigger and rebasing.

## Alternatives

- Caching npm packages still needs Node.js setup and an install for every call.
- Shipping `node_modules` adds platform and lifecycle-script assumptions.
- A container would change runner requirements and introduce image pull costs.

## Consequences

Dependency updates must include rebuilt distributions. Repository downloads grow,
so measure bundle size and startup before claiming end-to-end CI savings.

## Dated local validation

On 2026-11-08, Node.js 24.22.2 passed 123 checks: 66 source checks and 57 isolated-distribution checks.
The distribution rebuild checks passed after moving the repository to a different
container path. Source behavior and action inputs remain covered by the existing
integration workflows; hosted CI is required before review completion.

Five local pairs after priming used `npm ci --omit=dev --offline --ignore-scripts
--no-audit --no-fund` and the existing warm npm cache, then imported the source
entrypoint in a fresh Node.js process. A separate process imported the committed
distribution. Omitting development dependencies excludes the new bundler from
the source installation measurement. The following values are medians:

| Helper              | Runtime installation | Source import | Distribution import | Distribution bytes | Gzip bytes |
| ------------------- | -------------------: | ------------: | ------------------: | -----------------: | ---------: |
| `get-configuration` |               358 ms |         52 ms |               36 ms |            299,065 |     61,681 |
| `prepare`           |               588 ms |        163 ms |              116 ms |          1,835,970 |    360,344 |

Import measurements include Node.js startup, not an action workload. Byte counts
include all generated chunks and license notices; gzip describes concatenated
files, not GitHub transfer latency. These measurements exclude runner scheduling,
Node.js setup, remote registry/cache transfer, and action downloads. They do not
establish end-to-end workflow gains. Raw exports remain outside the repository.

## References

- [CI optimization issue](https://github.com/cloud-native-aixmarseille/pleey/issues/475)
- [ncc dynamic asset limitations](https://github.com/vercel/ncc#caveats)
