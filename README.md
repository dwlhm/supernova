# Supernova

Supernova turns Figma design tokens and component specs into a reviewable, multi-framework design system. An LLM authors universal Mitosis components (`.lite.tsx`). A deterministic compiler checks each one against React, Vue 3, Svelte, Vue 2 and Angular, and the result is opened as a GitHub pull request.

## Pipeline

```text
[ Figma Plugin (packages/figma-plugin) ]
          │ 1. Extracts variables, styles and component sets
          ▼
[ TypeScript API (apps/api) ]
          ├─► 2. Incremental sync plan against the previous snapshot (SQLite)
          ├─► 3. Blueprint pre-compiler (packages/mitosis-author)
          │      Figma geometry, typography and tokens → Tailwind/Mitosis blueprint
          ├─► 4. LLM authoring (packages/mitosis-author)
          │      Base-first edits of templates/ds-repo components
          ├─► 5. Quality gate (packages/mitosis-compiler)
          │      AST normalize → lint → compile to 5 targets → render check,
          │      with a stateful repair loop on errors
          ▼
[ GitHub PR on the design system repo ]
          ├─► 6. Review only .lite.tsx sources, tokens and docs
          ├─► 7. `/supernova regenerate <Component>: <notes>` comments re-author a component
          ▼
[ Design system repo CI (templates/ds-repo) ]
          └─► 8. Compiles to every framework and publishes packages on merge
```

## Workspace Layout

| Path | Description |
| --- | --- |
| `apps/api` | Node.js 22 API: jobs, sync plans, SSE progress, GitHub publisher and webhook |
| `apps/docs` | VitePress docs with an isolated multi-framework live preview and catalog |
| `packages/contracts` | OpenAPI schema (`openapi.yaml`) and generated TypeScript types |
| `packages/figma-plugin` | Figma extractor plugin (TypeScript + esbuild) |
| `packages/mitosis-author` | Blueprint pre-compiler and LLM authoring agent (`agy` or OpenAI-compatible) |
| `packages/mitosis-compiler` | Normalizer, linter, cross-framework compiler and headless runtime helpers |
| `templates/ds-repo` | Scaffolding and baseline components for the target design system repo |

## Prerequisites

- Node.js `>= 22` and pnpm `>= 10`, or Nix: `nix develop` gives you both through `flake.nix`. The Makefile uses Nix automatically when `pnpm` is not on `PATH`.
- Figma Desktop, needed to import a development plugin.
- An LLM provider: the Antigravity CLI (`agy`, recommended; uses your local `agy` session) or any OpenAI-compatible endpoint.

## Setup

```bash
git clone https://github.com/dwlhm/supernova.git
cd supernova
make install
cp .env.example .env
```

`.env.example` documents every variable. You need at least these:

| Variable | Purpose |
| --- | --- |
| `API_TOKEN` | Bearer token for the API and the Figma plugin (`openssl rand -hex 32`). The server refuses to start without it unless `SUPERNOVA_INSECURE_NO_AUTH=true` is set. |
| `LLM_PROVIDER` | `agy` (default model `gemini-4-argon-medium`) or `openai` (also needs `LLM_BASE_URL`, `LLM_API_KEY` and `LLM_MODEL`) |
| `LLM_TIMEOUT` | Authoring timeout, e.g. `180s` or `5m` (default `10m`) |
| `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BASE_BRANCH` | Turn on PR publishing. The token needs Contents and Pull Requests read/write. |
| `GITHUB_WEBHOOK_SECRET` | Turns on `/v1/webhooks/github`. Without it the endpoint returns 503. |
| `SUPERNOVA_DEV_MOCK_LLM` | `true` switches to deterministic mock authoring, with no token cost |

Jobs, snapshots and artifacts are stored in `var/supernova.db` (`DATABASE_PATH`), and raw extractions in `var/extractions` (`EXTRACTIONS_DIR`).

## Running

### 1. API server

```bash
make dev          # build every package, then start apps/api on $PORT (default 8080)
curl http://localhost:8080/v1/health
# {"status":"ok","version":"1.0.0"}
```

### 2. Figma plugin

```bash
pnpm --filter @supernova/figma-plugin build
```

In Figma Desktop, open **Plugins → Development → Import plugin from manifest…**, select `packages/figma-plugin/manifest.json`, and run **Extractor**. Fill in the API URL (`http://localhost:8080`) and your `API_TOKEN`, pick targets and publishers (GitHub PR and/or ZIP download), then start the extraction.

### 3. Live preview

```bash
make review                                    # preview templates/ds-repo baseline components
make preview-pr                                # preview the latest supernova/* PR branch
make preview-pr BRANCH=supernova/<branch>      # preview a specific PR branch
make preview-build BRANCH=supernova/<branch>   # static build of a PR branch preview
```

## Reviewing a PR

- A Supernova PR contains only universal sources: `src/components/*.lite.tsx`, `src/icons/*.lite.tsx`, `src/tokens/*` and `docs/`. Framework outputs are built by the design system repo's CI.
- Sync commits stack on the existing PR branch and never force-push, so your review commits are preserved.
- To have a component re-authored, comment on the PR. Only OWNER, MEMBER and COLLABORATOR comments are accepted.

  ```text
  /supernova regenerate Button: use the destructive token for the hover state
  ```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v1/health` | Liveness check (no auth) |
| `POST` | `/v1/extractions` | Submit a full extraction job |
| `POST` | `/v1/extractions/replay` | Re-run a stored extraction (`{ jobId? }`) |
| `POST` | `/v1/syncs` | Compute an incremental sync plan |
| `POST` | `/v1/syncs/replay` | Recompute a plan from a stored job or fixture |
| `POST` | `/v1/syncs/{syncId}/apply` | Apply a sync plan as a job |
| `GET` | `/v1/jobs/{jobId}` | Job status, components and publish results |
| `GET` | `/v1/jobs/{jobId}/events` | Server-sent progress events |
| `GET` | `/v1/jobs/{jobId}/download` | ZIP of the job's artifacts |
| `POST` | `/v1/webhooks/github` | GitHub `issue_comment` webhook (HMAC-verified) |

Every route except health and the webhook requires `Authorization: Bearer $API_TOKEN`. The full schema is in `packages/contracts/openapi.yaml`.

## Developer Commands

```bash
make check                    # build, typecheck and test every package
make build | make typecheck | make test
pnpm --dir apps/docs build    # docs and preview build (also run in CI)
make dev-sync                 # replay a stored extraction (default: latest) through sync → apply → PR, streaming progress; needs a running API
pnpm --dir packages/contracts generate   # regenerate src/schema.ts from openapi.yaml
```

## Troubleshooting

- **Figma plugin gets connection refused:** check that the API is running (`make dev`). If you use Figma in the browser, allow localhost network access.
- **401 from the API:** the plugin token must match `API_TOKEN`.
- **GitHub PR fails with 401 or 404:** check the `GITHUB_TOKEN` permissions and that `GITHUB_REPO` is `owner/repo`.
- **Webhook returns 503:** set `GITHUB_WEBHOOK_SECRET` and use the same secret in the GitHub webhook settings.
- **LLM timeout:** raise `LLM_TIMEOUT`. With `agy`, check that the CLI is installed and logged in.

## License

MIT
