.PHONY: install test test-ts typecheck build check clean run dev review preview-pr preview-build dev-sync

HAS_PNPM := $(shell command -v pnpm 2>/dev/null)
NIX_BIN := $(shell command -v nix 2>/dev/null || echo /nix/var/nix/profiles/default/bin/nix)
NIX_EXEC := $(if $(HAS_PNPM),,$(NIX_BIN) develop --command)

install:
	$(NIX_EXEC) pnpm install

run:
	$(NIX_EXEC) node apps/api/dist/cli.js

dev: build run

review:
	$(NIX_EXEC) pnpm --dir apps/docs dev

preview-pr:
	$(NIX_EXEC) ./scripts/preview-pr.sh "$(BRANCH)" dev

preview-build:
	$(NIX_EXEC) ./scripts/preview-pr.sh "$(BRANCH)" build

dev-sync:
	$(NIX_EXEC) ./scripts/dev-sync.sh $(ARGS)

build:
	$(NIX_EXEC) pnpm build

typecheck:
	$(NIX_EXEC) pnpm typecheck

test:
	$(NIX_EXEC) pnpm test

test-ts: test

check: build typecheck test
	@echo "All checks passed successfully."

clean:
	rm -rf dist
