.PHONY: install fmt-check vet test-go test-ts typecheck build check clean run dev review preview-pr preview-build dev-sync

GO_MODULES := apps/api packages/contracts

install:
	pnpm install

run:
	go run ./apps/api/cmd/api

dev: run

review:
	pnpm --dir apps/docs dev

preview-pr:
	@./scripts/preview-pr.sh "$(BRANCH)" dev

preview-build:
	@./scripts/preview-pr.sh "$(BRANCH)" build

dev-sync:
	@./scripts/dev-sync.sh $(ARGS)

fmt-check:
	@diff=$$(gofmt -l $(GO_MODULES)); \
	if [ -n "$$diff" ]; then \
		echo "Unformatted Go files:"; \
		echo "$$diff"; \
		exit 1; \
	fi

vet:
	@set -e; for mod in $(GO_MODULES); do \
		echo "==> go vet in $$mod"; \
		(cd $$mod && go vet ./...); \
	done

test-go:
	@set -e; for mod in $(GO_MODULES); do \
		echo "==> go test in $$mod"; \
		(cd $$mod && go test ./...); \
	done

test-ts:
	pnpm test

typecheck:
	pnpm typecheck

build:
	pnpm build

check: fmt-check vet build test-go typecheck test-ts
	@echo "All checks passed successfully."

clean:
	rm -rf node_modules apps/*/node_modules packages/*/node_modules var/
