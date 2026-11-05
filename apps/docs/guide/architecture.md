# Full-TypeScript Architecture

The Supernova backend (`apps/api` — `@supernova/api`) is a 100% TypeScript / Node.js 22 service structured around clean domain and application boundaries with zero subprocess serialization overhead.

## Module Boundaries

Dependencies flow inward toward the domain and application layer:

```
[ Inbound HTTP / Webhooks ]       [ Core Application (`src/app/`) ]      [ In-Process Packages & Stores ]
  HTTP Router (`src/http/`) ----> SupernovaService (`service.ts`)  ----> @supernova/mitosis-author
  - /v1/extractions               JobRunner & AuthorRunner               - Deterministic Blueprint
  - /v1/syncs/*                   Incremental Diff (`sync.ts`)           - OpenAI Agent & Tooling
  - /v1/jobs/{id}/events (SSE)    AST Docgen (`docgen-ast.ts`)
  - /v1/webhooks/github           Token Resolver (`tokens.ts`)     ----> @supernova/mitosis-compiler
                                                                         - AST Normalizer (`normalize.ts`)
                                                                         - Linter & SSR Render Gate
                                                                   ----> Store (`src/store/`)
                                                                         - MemStore / SQLite (`node:sqlite`)
                                                                   ----> Publishers (`src/publisher/`)
                                                                         - Download ZIP Publisher
                                                                         - GitHub PR Publisher
```

### Domain Layer (`apps/api/src/domain/`)
- `models.ts`: Pure entity types (`Job`, `FigmaComponentSpec`, `CompiledArtifact`, `SyncPlan`, `ComponentTaskState`) and component name normalization (`normalizeComponentName`, `camelToKebab`).
- `artifact-path.ts`: Single source of truth mapping artifacts (`mitosis`, `tokens`, `docs`, framework outputs) to repository paths while excluding raw Figma extraction payloads from Git trees.

### Application Layer (`apps/api/src/app/`)
- `service.ts` & `job-runner.ts`: Orchestrates extraction jobs, incremental sync plans (`calculateSyncPlan`), concurrent component authoring, and publisher invocation.
- `author-runner.ts`: Stateful cross-attempt repair loop passing `repairErrors` and `partialComponents` into `@supernova/mitosis-author` and verifying output via `@supernova/mitosis-compiler`.
- `tokens.ts` & `docgen.ts` / `docgen-ast.ts`: Generates Tailwind v4 `@theme` (`theme.css`), CSS custom properties (`tokens.css`), and AST-driven Markdown documentation.
- `webhook.ts`: Handles `/supernova regenerate <Component>: <notes>` comments on GitHub Pull Requests.

### Storage & Publishers (`apps/api/src/{store,publisher}/`)
- `sqlite-store.ts` & `mem-store.ts`: Persists jobs, artifacts, ZIP bundles, and incremental component/token snapshots using Node.js 22 native `node:sqlite` (`DatabaseSync`).
- `github-publisher.ts` & `download-publisher.ts`: Publishes multi-framework ZIP archives or commits universal `.lite.tsx` sources, tokens, and docs to GitHub Pull Requests.
