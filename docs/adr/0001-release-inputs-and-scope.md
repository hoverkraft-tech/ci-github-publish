# Release inputs and path scope

Date: 2026-11-07

Status: Accepted

## Context

Release Drafter deprecated top-level `include-paths` and `include-labels` in
favor of `pre-include` categories. The generated configuration used the deprecated
path field. Moving that filter into `categories` also exposed it to whole-list
replacement: customizing changelog groups could silently include other monorepo
components in release notes and version calculation.

The release actions also used inconsistent names for shared inputs and outputs.
In particular, `target-sha` accepted refs, and `plan`'s `has-changes` included first
releases and forced releases without changes.

## Decision

Generate path filters as `type: pre-include` categories. When composing repository
settings and input overrides over generated defaults, carry the inherited
pre-include filters into replacement category lists unless those lists supply an
explicit pre-include category. Empty categories clear grouping and version rules
while retaining scope. Explicit filters replace the scope; an unconditional
pre-include category permits repository-wide changes.

Keep repository files with their own `_extends` chain under Release Drafter's
native inheritance rules. They own their defaults and scope. Resolving arbitrary
local or remote inheritance to merge category types would duplicate upstream
configuration loading. Repository files remain unchanged.

Use consistent public names without compatibility aliases:

| Action                                | Previous name    | Name               |
| ------------------------------------- | ---------------- | ------------------ |
| `get-configuration`, `plan`, `create` | `include-paths`  | `additional-paths` |
| `get-configuration`, `plan`, `create` | `release-config` | `config-overrides` |
| `plan`, `create`                      | `target-sha`     | `target-ref`       |
| `prepare`                             | `commitish`      | `target-ref`       |
| `prepare`                             | `token`          | `github-token`     |
| `prepare` output                      | `tag_name`       | `tag`              |
| `plan` output                         | `has-changes`    | `should-release`   |

## Alternatives

- Native whole-list replacement everywhere is simpler but allows a grouping
  change to broaden release scope silently.
- Always appending generated filters to explicit filters is incorrect because
  pre-include categories match alternatives, broadening the explicit scope.
- A separate scope configuration language would add another public interface
  over Release Drafter's supported categories.

## Consequences

This requires a breaking release. Callers must rename the affected inputs and
outputs and migrate deprecated fields in their own Release Drafter configuration
to pre-include categories. Callers relying on category replacement to remove
scope must now provide an explicit pre-include category.

`additional-paths` describes extension of the directory scope; `config-overrides`
describes a partial mapping; `target-ref` covers supported reference types;
`should-release` describes the planning decision. The separate creation modes
and their existing behavior remain outside this decision.

## References

- [Upstream pre-include migration](https://github.com/release-drafter/release-drafter/pull/1558)
- [Implementation PR](https://github.com/hoverkraft-tech/ci-github-publish/pull/502)
- [Current release usage](../usage/release.md)
