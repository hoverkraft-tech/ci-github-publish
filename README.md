# Continuous Integration - GitHub - Publish

[![Continuous Integration](https://github.com/hoverkraft-tech/ci-github-publish/actions/workflows/__main-ci.yml/badge.svg)](https://github.com/hoverkraft-tech/ci-github-publish/actions/workflows/__main-ci.yml)
[![GitHub tag](https://img.shields.io/github/tag/hoverkraft-tech/ci-github-publish?include_prereleases=&sort=semver&color=blue)](https://github.com/hoverkraft-tech/ci-github-publish/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Opinionated GitHub Actions and workflows for streamlined release, deployment, and publishing.

---

## Actions

### ArgoCD

_Actions dedicated to ArgoCD workflows._

#### - [Get manifest files](actions/argocd/get-manifest-files/README.md)

### Checks

_Actions for validating the result of a deploy._

#### - [URL - Lighthouse](actions/check/url-lighthouse/README.md)

#### - [URL - Ping](actions/check/url-ping/README.md)

### Clean deploy

_Actions for cleaning deployments on various platforms._

#### - [Repository dispatch](actions/clean-deploy/repository-dispatch/README.md)

### Deploy

_Actions for deploying to various platforms._

#### - [Argocd manifest files](actions/deploy/argocd-manifest-files/README.md)

#### - [Get environment](actions/deploy/get-environment/README.md)

#### - [GitHub Pages](actions/deploy/github-pages/README.md)

#### - [Helm repository dispatch](actions/deploy/helm-repository-dispatch/README.md)

#### - [Jampack](actions/deploy/jampack/README.md)

#### - [Jekyll](actions/deploy/jekyll/README.md)

#### - [Report](actions/deploy/report/README.md)

### Deployment

_Actions for managing deployments._

#### - [Create](actions/deployment/create/README.md)

#### - [Delete](actions/deployment/delete/README.md)

#### - [Get finished](actions/deployment/get-finished/README.md)

#### - [Read](actions/deployment/read/README.md)

#### - [Update](actions/deployment/update/README.md)

### Release

_Actions for managing releases._

#### - [Create](actions/release/create/README.md)

### Workflow

_Actions for managing workflows._

#### - [Get workflow failure](actions/workflow/get-workflow-failure/README.md)

## Reusable Workflows

## Cleaning deploy

### - [Clean deploy argocd app of apps](.github/workflows/clean-deploy-argocd-app-of-apps.yml)

### - [Clean deploy](.github/workflows/clean-deploy.yml)

### Performs deploy

### - [Deploy argocd app of apps](.github/workflows/deploy-argocd-app-of-apps.yml)

### - [Deploy chart](.github/workflows/deploy-chart.yml)

### - [Deploy finish](.github/workflows/deploy-finish.yml)

### - [Deploy start](.github/workflows/deploy-start.yml)

### - [Finish deploy argocd app of apps](.github/workflows/finish-deploy-argocd-app-of-apps.yml)

### Releases

_Reusable workflows for managing release process._

### - [Prepare release](.github/workflows/prepare-release.yml)

### - [Release actions](.github/workflows/release-actions.yml)

## Contributing

👍 If you wish to contribute to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file, PRs are Welcome !

## Author

🏢 **Hoverkraft <contact@hoverkraft.cloud>**

- Site: [https://hoverkraft.cloud](https://hoverkraft.cloud)
- GitHub: [@hoverkraft-tech](https://github.com/hoverkraft-tech)

## License

📝 Copyright © 2023 [Hoverkraft <contact@hoverkraft.cloud>](https://hoverkraft.cloud).<br />
This project is [MIT](LICENSE) licensed.
