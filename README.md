# Komerce Design System (`komerce-design`)

Komerce Design turns Figma design tokens and component specs into a reviewable, multi-framework design system. An LLM authors universal Mitosis components (`src/components/*.lite.tsx`). A deterministic compiler checks each one against React, Vue 3, Svelte, Vue 2 and Angular, and outputs standalone framework packages under `library/*` directly in your local workspace—ready to commit and push to **GitLab**, **GitHub**, or any Git remote.

## Local-First Pipeline

```text
[ Figma Plugin (packages/figma-plugin) ]
          │ 1a. Export Extraction JSON ⬇ (zero server)
          │ 1b. Or 1-Click Sync to `pnpm komerce listen` (127.0.0.1:8080)
          ▼
[ Komerce Design Local CLI (`pnpm komerce sync` / `regen` / `build` / `inspect`) ]
          ├─► 2. Incremental sync plan against `src/*` and `var/extractions/latest.json` (zero database)
          ├─► 3. Blueprint pre-compiler (packages/mitosis-author)
          │      Figma geometry, typography and tokens → Tailwind/Mitosis blueprint
          ├─► 4. LLM authoring (packages/mitosis-author)
          │      Base-first edits of `src/components/*.lite.tsx`
          ├─► 5. Quality gate (packages/mitosis-compiler)
          │      AST normalize → lint → typecheck → compile to 5 targets → render check,
          │      with a stateful repair loop on errors
          ▼
[ Local Working Tree (`src/*`, `library/*`, `apps/docs`) ]
          ├─► 6. Writes universal `.lite.tsx` & tokens to `src/*`
          ├─► 7. Compiles standalone packages into `library/{tokens,react,vue3,svelte,vue2,angular}`
          ├─► 8. Live multi-framework review at `make review` (`http://localhost:5173`)
          └─► 9. Targeted revisions via `pnpm komerce regen <Component> "<notes>"`
```

## Workspace Layout

| Path | Description |
| --- | --- |
| `src/` | **Single Source of Truth**: universal Mitosis components (`src/components/*.lite.tsx`), icons (`src/icons/*.lite.tsx`), composition examples (`src/examples/*.lite.tsx`), and tokens (`src/tokens/*`) |
| `library/` | **Generated Multi-Framework Packages**: `@komerce-design/tokens`, `@komerce-design/react`, `@komerce-design/vue3`, `@komerce-design/svelte`, `@komerce-design/vue2`, and `@komerce-design/angular` |
| `apps/api` | Local CLI (`pnpm komerce sync`, `regen`, `inspect`, `build`, `listen`) and optional HTTP API server |
| `apps/docs` | VitePress docs with an isolated 5-framework live preview and catalog |
| `packages/contracts` | OpenAPI schema (`openapi.yaml`) and generated TypeScript types |
| `packages/figma-plugin` | Figma extractor plugin (TypeScript + esbuild) with offline JSON export and local sync |
| `packages/mitosis-author` | Blueprint pre-compiler and LLM authoring agent (`agy` or OpenAI-compatible) |
| `packages/mitosis-compiler` | Normalizer, linter, cross-framework compiler and headless runtime helpers |

---

## Step-by-Step Tutorial (End-to-End Local Workflow)

### Prerequisites

- Node.js `>= 22` and pnpm `>= 10` (or Nix: `nix develop`).
- Figma Desktop (for running the development plugin).
- An LLM provider:
  - **Recommended (Zero API Key):** Antigravity CLI (`agy`) logged in locally (`LLM_PROVIDER=agy`).
  - **Alternative:** Any OpenAI-compatible endpoint (`LLM_PROVIDER=openai`, plus `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`).

### Step 1: Install & Initial Build

```bash
git clone https://github.com/dwlhm/komerce-design.git
cd komerce-design
make install
cp .env.example .env
make build
```

`make build` compiles all internal packages (`packages/*`, `apps/api`) and compiles the universal Mitosis sources in `src/*` into the 6 framework packages in `library/*`.

### Step 2: Import the Figma Plugin

1. Open **Figma Desktop** and open your Design System file.
2. Go to **Plugins → Development → Import plugin from manifest…**.
3. Select `packages/figma-plugin/manifest.json`.
4. Run **Plugins → Development → Komerce Design Extractor**. The plugin automatically scans all pages for variables, styles, and component sets.

### Step 3: Sync Figma to Local Workspace (2 Options)

You can run Komerce Design completely offline via a JSON file, or with a 1-click loopback listener. Neither requires `API_TOKEN`, `GITHUB_TOKEN`, or public webhooks.

#### Option A — Pure File CLI (100% Serverless)
1. In the Figma plugin UI, select the components you want and click **Export Extraction JSON ⬇** to save e.g. `figma-extraction.json`.
2. In your terminal, run:
   ```bash
   pnpm komerce sync ./figma-extraction.json
   ```
   *Tip:* Every sync saves the extraction payload to `var/extractions/latest.json`. You can re-run or force specific components anytime without re-exporting from Figma:
   ```bash
   # Re-run against the latest stored extraction
   pnpm komerce sync --replay latest

   # Force LLM re-authoring on specific components (even if unchanged in Figma)
   pnpm komerce sync --replay latest --components Button,Badge
   ```

#### Option B — 1-Click Local Listener
1. Start the loopback listener in your terminal:
   ```bash
   pnpm komerce listen
   # Listening on http://127.0.0.1:8080 (no API_TOKEN required)
   ```
2. In the Figma plugin UI, click **Compute Local Sync Plan** → inspect the diff (`New`, `Changed`, `Unchanged`) → click **Apply Sync to Workspace**.

**What happens during sync:**
- Token changes are written to `src/tokens/{tokens.json,tokens.css,theme.css,tokens.ts}`.
- New/changed components are authored into `src/components/*.lite.tsx` (or `src/icons/*.lite.tsx`) and verified across all 5 target frameworks.
- Standalone packages in `library/{tokens,react,vue3,svelte,vue2,angular}/dist` and docs in `apps/docs` are automatically recompiled.

### Step 4: Live Multi-Framework Review & Instant Iteration

Start the local VitePress preview server:

```bash
make review
# Opens http://localhost:5173
```

1. Browse `/showcase` or `/components/` to test interactive states (`default`, `filled`, `focus`, `error`, `disabled`, dark mode) across **Vue 3, React, Svelte, Vue 2, and Angular** in isolated iframes.
2. Inspect the universal source changes in your editor:
   ```bash
   git diff src/
   ```
3. Need to tweak a component or its live preview behavior? You have **two synchronized ways**:
   - **Option 1 — Interactive AI Session (Recommended: `agy`, Claude Code, Cursor, OpenCode):**
     Chat directly with your interactive agent in this workspace. Thanks to [`AGENTS.md`](./AGENTS.md), the agent automatically:
     1. Inspects the Figma blueprint and rules via `pnpm komerce inspect <Component>`,
     2. Edits `src/components/*.lite.tsx` (plus sub-components and `src/examples/<Name>Example.lite.tsx`),
     3. Saves the behavioral/design rule into `src/knowledge.json` so future `pnpm komerce sync` runs never revert your changes, and
     4. Runs `pnpm komerce build <Component>` to sync AST markdown docs (`apps/docs/components/*.md`), `library/*`, and the 5-framework live preview.
   - **Option 2 — One-Shot CLI Regeneration (`komerce regen`):**
     ```bash
     pnpm komerce regen Button "use the semantic destructive token on hover and tighten horizontal padding to px-3"
     ```
     Applies **Base-First surgical edits** to the component family, records the rule in `src/knowledge.json`, and recompiles `library/*` and `apps/docs`.

### Step 5: Consume `library/*` Packages & Push to GitLab / GitHub

All compiled outputs live in standalone workspace packages under `library/*`:

| Package | Path | Description |
| --- | --- | --- |
| `@komerce-design/tokens` | `library/tokens` | CSS variables (`tokens.css`), Tailwind v4 `@theme` (`theme.css`), TS tokens |
| `@komerce-design/react` | `library/react` | React `.tsx` components + `utils.ts` |
| `@komerce-design/vue3` | `library/vue3` | Vue 3 `<script setup lang="ts">` SFCs |
| `@komerce-design/svelte` | `library/svelte` | Svelte components |
| `@komerce-design/vue2` | `library/vue2` | Vue 2 Options API SFCs |
| `@komerce-design/angular` | `library/angular` | Angular `@Component` (`kd-*` selector) + `@NgModule` |

To recompile `library/*` manually after hand-editing any file in `src/*`:

```bash
make compile   # or: pnpm compile:library
```

Once your review is complete, commit and push to **GitLab**, **GitHub**, or any Git remote using standard Git:

```bash
git checkout -b feat/update-design-system
git add src/ apps/docs/
git commit -m "feat(ds): sync button and tokens from figma"
git push origin feat/update-design-system
```

---

## CLI & Makefile Reference

| Command | Description |
| --- | --- |
| `pnpm komerce sync <file.json>` | Run in-process sync from a Figma extraction JSON file into `src/*`, `library/*`, and `apps/docs` |
| `pnpm komerce sync --replay [latest\|<jobId>]` | Replay a stored extraction from `var/extractions/` (`--components A,B` to force specific components) |
| `pnpm komerce inspect <Component>` | Inspect a component's Figma blueprint, family files, and `src/knowledge.json` rules |
| `pnpm komerce build [Component...]` | Sync manual `src/*` edits to AST docs (`apps/docs/components/*.md`), `library/*`, and 5-framework preview |
| `pnpm komerce regen <Component> "<notes>"` | Re-author a single component in-place with feedback notes and recompile `library/*` |
| `pnpm komerce listen` | Start loopback HTTP receiver on `127.0.0.1:8080` for 1-click Figma plugin sync |
| `make compile` | Compile `src/{components,icons}/*.lite.tsx` and `src/tokens/*` into `library/*` |
| `make review` | Start VitePress live multi-framework preview server (`http://localhost:5173`) |
| `make check` | Build all packages, compile `library/*`, typecheck, and run all test suites |

## Environment Variables (`.env`)

| Variable | Purpose |
| --- | --- |
| `LLM_PROVIDER` | `agy` (default, uses local `agy` CLI session) or `openai` |
| `LLM_MODEL` | Model identifier (default `gemini-4-argon-medium` for `agy`) |
| `LLM_TIMEOUT` | Per-component authoring timeout, e.g. `180s` or `5m` (default `10m`) |
| `LLM_BASE_URL`, `LLM_API_KEY` | Required only when `LLM_PROVIDER=openai` |
| `KOMERCE_DEV_MOCK_LLM` | Set to `true` for fast deterministic mock authoring (zero token cost) |
| `API_TOKEN`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_WEBHOOK_SECRET` | Optional — only needed if running `make run` as a remote HTTP server with GitHub PR publishing |

## License

MIT
