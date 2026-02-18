# Release — combining `release-start` and `release-finish`

The release process is split into two composable reusable workflows:

| Workflow                                  | Purpose                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| [`release-start.yml`](release-start.md)   | Creates a **draft** release via Release Drafter and outputs the `tag`.                  |
| [`release-finish.yml`](release-finish.md) | **Publishes** the draft (or **deletes** it). Controlled by the `publish` boolean input. |

Between them, you own the **gate**: any job(s) you want to run before deciding whether to publish. GitHub Actions `needs` wires it all together — no polling, no scripting.

```txt
release-start  →  [your gate job(s)]  →  release-finish
     ↓                                         ↑
  outputs tag                         publish: gate succeeded?
```

---

## Use case 1 — no gate (publish immediately)

The simplest setup: draft is published right away.

```yaml
jobs:
  start:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-start.yml@main
    permissions:
      contents: write
      pull-requests: read
      id-token: write

  finish:
    needs: start
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-finish.yml@main
    permissions:
      contents: write
    with:
      tag: ${{ needs.start.outputs.tag }}
      publish: true
```

---

## Use case 2 — gate: automated test suite

Run your test suite before committing to publish. If tests fail, the draft is deleted.

```yaml
jobs:
  start:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-start.yml@main
    permissions:
      contents: write
      pull-requests: read
      id-token: write

  tests:
    needs: start
    uses: ./.github/workflows/tests.yml # your own workflow

  finish:
    needs: [start, tests]
    if: always() && needs.start.result == 'success'
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-finish.yml@main
    permissions:
      contents: write
    with:
      tag: ${{ needs.start.outputs.tag }}
      publish: ${{ needs.tests.result == 'success' }}
```

---

## Use case 3 — gate: deploy to staging and run smoke tests

Draft a release, deploy it to staging with the candidate tag, run smoke tests, then decide.

```yaml
jobs:
  start:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-start.yml@main
    permissions:
      contents: write
      pull-requests: read
      id-token: write

  deploy-staging:
    needs: start
    uses: ./.github/workflows/deploy.yml
    with:
      environment: staging
      tag: ${{ needs.start.outputs.tag }}

  smoke-tests:
    needs: deploy-staging
    uses: ./.github/workflows/smoke-tests.yml

  finish:
    needs: [start, smoke-tests]
    if: always() && needs.start.result == 'success'
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-finish.yml@main
    permissions:
      contents: write
    with:
      tag: ${{ needs.start.outputs.tag }}
      publish: ${{ needs.smoke-tests.result == 'success' }}
```

---

## Use case 4 — gate: manual approval via environment protection

Use a GitHub [environment with required reviewers](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment#required-reviewers) to gate the publish step.

```yaml
jobs:
  start:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-start.yml@main
    permissions:
      contents: write
      pull-requests: read
      id-token: write

  approve:
    needs: start
    runs-on: ubuntu-latest
    environment: production # ← reviewers must approve before this job runs
    steps:
      - run: echo "Approved for ${{ needs.start.outputs.tag }}"

  finish:
    needs: [start, approve]
    if: always() && needs.start.result == 'success'
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-finish.yml@main
    permissions:
      contents: write
    with:
      tag: ${{ needs.start.outputs.tag }}
      publish: ${{ needs.approve.result == 'success' }}
```

---

## Use case 5 — gate: multiple parallel gates

Run several independent checks in parallel; publish only if all pass.

```yaml
jobs:
  start:
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-start.yml@main
    permissions:
      contents: write
      pull-requests: read
      id-token: write

  unit-tests:
    needs: start
    uses: ./.github/workflows/unit-tests.yml

  integration-tests:
    needs: start
    uses: ./.github/workflows/integration-tests.yml

  security-scan:
    needs: start
    uses: ./.github/workflows/security-scan.yml

  finish:
    needs: [start, unit-tests, integration-tests, security-scan]
    if: always() && needs.start.result == 'success'
    uses: hoverkraft-tech/ci-github-publish/.github/workflows/release-finish.yml@main
    permissions:
      contents: write
    with:
      tag: ${{ needs.start.outputs.tag }}
      publish: >-
        ${{
          needs.unit-tests.result == 'success' &&
          needs.integration-tests.result == 'success' &&
          needs.security-scan.result == 'success'
        }}
```
