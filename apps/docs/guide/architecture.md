# Full-TypeScript Architecture

Komerce Design (`apps/api` — `@komerce-design/api`) is a 100% TypeScript / Node.js 22 CLI and service structured around clean domain and application boundaries with zero database or subprocess serialization overhead.

## Module Boundaries

Dependencies flow inward toward the domain and application layer:

```text
[ Local CLI / Inbound HTTP ]       [ Core Application (`src/app/`) ]      [ In-Process Packages & Workspace ]
  CLI (`cli.ts`, `local-runner.ts`) -> Service (`service.ts`)            ----> @komerce-design/mitosis-author
  - `komerce sync [file.json]`         JobRunner & AuthorRunner               - Deterministic Blueprint (`blueprint.ts`)
  - `komerce regen <Comp> <notes>`     Local Regen (`regenerate.ts`)          - Agy CLI & OpenAI Agent
  - `komerce listen` (127.0.0.1)       Incremental Diff (`sync.ts`)
  HTTP Router (`src/http/`)            AST Docgen (`docgen-ast.ts`)     ----> @komerce-design/mitosis-compiler
  - /v1/extractions, /v1/syncs/*       Token Resolver (`tokens.ts`)           - AST Normalizer & Typecheck Gate
  - /v1/jobs/{id}/events (SSE)                                                - 5-Target Framework Adapters
                                                                        ----> Store (`src/store/`)
                                                                              - In-Memory Store (`mem-store.ts`) + Disk (`src/*`)
                                                                        ----> Publishers (`src/publisher/`)
                                                                              - LocalWorkspacePublisher (`src/*` & `library/*`)
                                                                              - Download ZIP & Optional GitHub PR Publisher
```

### Workspace Source & Output Layout
- `src/{components,icons,tokens,examples}`: Single source of truth for universal `.lite.tsx` components, headless `core-*.ts` / `utils.ts`, and semantic design tokens.
- `library/{tokens,react,vue3,svelte,vue2,angular}`: Standalone npm workspace packages (`@komerce-design/*`) compiled from `src/*` by `scripts/compile-library.mjs`.

### Domain Layer (`apps/api/src/domain/`)
- `models.ts`: Pure entity types (`Job`, `FigmaComponentSpec`, `CompiledArtifact`, `SyncPlan`, `PublisherType`) and component name normalization (`normalizeComponentName`, `camelToKebab`).
- `artifact-path.ts`: Single source of truth mapping artifacts (`mitosis`, `tokens`, `docs`) to repository paths (`src/components`, `src/icons`, `src/examples`, `src/tokens`, `docs/components`, `docs/tokens.md`).

### Application Layer (`apps/api/src/app/`)
- `service.ts` & `job-runner.ts`: Orchestrates extraction jobs, incremental sync plans (`calculateSyncPlan`), concurrent component authoring, and publisher invocation.
- `regenerate.ts`: In-process single-component regeneration (`regenerateComponentLocal`) reading local `src/` sources and `var/extractions/latest.json`, writing updated `.lite.tsx` and docs directly to disk, and recompiling `library/*`.
- `author-runner.ts`: Stateful cross-attempt repair loop passing `repairErrors` and `partialComponents` into `@komerce-design/mitosis-author` and verifying output via `@komerce-design/mitosis-compiler`.
- `tokens.ts` & `docgen.ts` / `docgen-ast.ts`: Generates Tailwind v4 `@theme` (`theme.css`), CSS custom properties (`tokens.css`), and AST-driven Markdown documentation.

### Storage & Publishers (`apps/api/src/{store,publisher}/`)
- `mem-store.ts`: Lightweight in-memory job and artifact store paired with direct filesystem inspection of `src/*` and `var/extractions/latest.json` (zero SQLite database required).
- `local-publisher.ts`: Writes universal `.lite.tsx` sources, tokens, and docs directly to the local working tree and invokes `scripts/compile-library.mjs`.
- `download-publisher.ts` & `github-publisher.ts`: Optional ZIP bundle and remote GitHub Pull Request publishers.
