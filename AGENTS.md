# CI GitHub Publish - Agent Instructions

> **Organization-wide guidelines (required):** Follow the prioritized shared instructions in [hoverkraft-tech/.github/AGENTS.md](https://github.com/hoverkraft-tech/.github/blob/main/AGENTS.md) before working in this repository.

## Quick Start

This project is a collection of **opinionated GitHub Actions** for streamlined CI/CD workflows. For comprehensive documentation, see the main [README.md](README.md).

### Key Sections to Reference

- **[Overview](README.md#overview)** - Project purpose and scope
- **[Actions](README.md#actions)** - Complete catalog of available actions by category
- **[Reusable Workflows](README.md#reusable-workflows)** - Orchestration workflows for complex deployments
- **[Contributing](README.md#contributing)** - Guidelines for contributing to the project; Structure patterns and development standards
- **[Development Workflow](README.md#development-workflow)** - Commands for linting, testing, and local development

## Agent-Specific Development Patterns

### Critical Workflow Knowledge

```bash
# Essential commands for development
make lint        # Run Super Linter (dockerized)
make lint-fix    # Auto-fix linting issues
gh act -W .github/workflows/workflow-file-to-test.yml  # Test workflows locally with `act`
```

For detailed documentation on each action and workflow, refer to the individual readme files linked in the main [README.md](README.md).
