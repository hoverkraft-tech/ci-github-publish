.PHONY: help

help: ## Display help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

lint: ## Execute linting
	$(call run_linter,)

lint-fix: ## Execute linting and fix
	$(call run_linter, \
		-e FIX_JSON_PRETTIER=true \
		-e FIX_JAVASCRIPT_PRETTIER=true \
		-e FIX_YAML_PRETTIER=true \
		-e FIX_MARKDOWN=true \
		-e FIX_MARKDOWN_PRETTIER=true \
		-e FIX_NATURAL_LANGUAGE=true \
		-e FIX_SHELL_SHFMT=true \
	)

setup: ## Install npm dependencies for all package.json files under actions/
	@echo "Installing npm dependencies for all packages..."
	$(call run_npm_for_packages,install)

npm-audit-fix: ## Execute npm audit fix
	@echo "Running npm audit fix for all packages..."
	$(call run_npm_for_packages,audit fix)

test: ## Execute tests
	@echo "Running tests for all packages..."
	$(call run_npm_for_packages,test)

ci: ## Execute CI tasks
	$(MAKE) setup
	$(MAKE) npm-audit-fix
	$(MAKE) lint-fix
	$(MAKE) test

define run_linter
	DEFAULT_WORKSPACE="$(CURDIR)"; \
	LINTER_IMAGE="linter:latest"; \
	VOLUME="$$DEFAULT_WORKSPACE:$$DEFAULT_WORKSPACE"; \
	docker build --build-arg UID=$(shell id -u) --build-arg GID=$(shell id -g) --tag $$LINTER_IMAGE .; \
	docker run \
		-e DEFAULT_WORKSPACE="$$DEFAULT_WORKSPACE" \
		-e FILTER_REGEX_INCLUDE="$(filter-out $@,$(MAKECMDGOALS))" \
		-e IGNORE_GITIGNORED_FILES=true \
		$(1) \
		-v $$VOLUME \
		--rm \
		$$LINTER_IMAGE
endef

define run_npm_for_packages
	@set -uo pipefail; \
	overall_status=0; \
	packages="$$(find actions -type f -name package.json -not -path '*/node_modules/*' -print | sort)"; \
	for pkg in $$packages; do \
		pkg_dir="$$(dirname "$$pkg")"; \
		echo "---"; \
		echo "npm $(1) in $$pkg_dir"; \
		if ! npm --prefix "$$pkg_dir" $(1); then \
			overall_status=1; \
		fi; \
	done; \
	exit $$overall_status
endef

#############################
# Argument fix workaround
#############################
%:
	@: