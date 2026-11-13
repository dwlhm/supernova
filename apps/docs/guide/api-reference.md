# CLI & HTTP API Reference

Komerce Design (`apps/api` — `@komerce-design/api`) provides both an **in-process Local CLI** (recommended, zero server required) and an OpenAPI 3.0.3 HTTP interface under `/v1/`.

## Local CLI Commands

### 1. Sync from Figma JSON or Replay Snapshot
```bash
# Sync from an exported Figma JSON file
pnpm komerce sync ./figma-extraction.json

# Replay the latest stored extraction in var/extractions/
pnpm komerce sync --replay latest

# Force LLM authoring on specific components even when unchanged
pnpm komerce sync --replay latest --components Button,Badge
```
Computes an incremental diff against `src/*` and `var/extractions/latest.json`, authors universal `.lite.tsx` components into `src/*`, updates `apps/docs`, and compiles all 6 packages in `library/*`.

### 2. Regenerate a Component Locally
```bash
pnpm komerce regen Button "use semantic destructive token on hover"
```
Reads `src/components/Button.lite.tsx` and the stored Figma component spec, re-authors the component with your feedback notes, updates `apps/docs/components/button.md`, and recompiles `library/*`.

### 3. Inspect Component Blueprint & Rules (`inspect`)
```bash
pnpm komerce inspect Button
```
Reads `var/extractions/latest.json` and `src/knowledge.json` to output the deterministic Figma multi-variant blueprint (`canonicalProps`, `baseTailwindClasses`, `hierarchy`, `variantDiffs`, `stateStyles`), family files, and local knowledge rules.

### 4. Synchronize Docs & Compile Multi-Framework Packages (`build`)
```bash
# Sync and compile a single component family
pnpm komerce build Button

# Sync and compile the entire workspace
pnpm komerce build
```
Updates AST-driven Markdown documentation in `apps/docs/components/*.md`, compiles all 6 workspace packages in `library/{tokens,react,vue3,svelte,vue2,angular}`, and refreshes the 5-framework VitePress preview bundles.

### 5. Start Local Loopback Listener (`listen`)
```bash
pnpm komerce listen
```
Starts a loopback HTTP receiver on `http://127.0.0.1:8080` (with auth disabled on loopback by default) so the Figma Desktop plugin can compute and apply sync plans directly to the local workspace in 1 click.

---

## HTTP Endpoints

### 1. Health Check
`GET /v1/health`

Returns service health status. Public endpoint (bypasses Bearer authentication).

**Response (200 OK):**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

### 2. Compute & Apply Incremental Sync Plan
- `POST /v1/syncs` — Computes a diff plan (`new`, `changed`, `unchanged`, `removed`) against `src/*` and `var/extractions/latest.json`.
- `POST /v1/syncs/replay` — Computes a diff plan from a stored extraction (`{ "fixture": "latest" }`).
- `POST /v1/syncs/{syncId}/apply` — Enqueues an extraction job for the sync plan (`{ "publishers": ["local"], "targets": ["mitosis"], "selectedComponents": ["Button"] }`).

---

### 3. Submit Extraction
`POST /v1/extractions`

Submits an extracted Figma document payload for asynchronous component authoring and compilation.

**Request Body:**
```json
{
  "document": {
    "name": "Design System",
    "tokens": [
      {
        "id": "token-1",
        "name": "🌱 Semantic/color/primary",
        "type": "color",
        "value": "#18a0fb"
      }
    ],
    "components": [
      {
        "id": "comp-1",
        "name": "Button",
        "node": {
          "id": "comp-1",
          "name": "Button",
          "type": "COMPONENT"
        }
      }
    ]
  },
  "targets": ["mitosis"],
  "publishers": ["local"]
}
```

**Publishers (`PublisherType`):**
- `"local"`: Writes universal `.lite.tsx` sources, tokens, and docs to the local workspace (`src/*`, `apps/docs`) and compiles `library/*`.
- `"download"`: Bundles artifacts into a downloadable ZIP (`/v1/jobs/{id}/download`).
- `"pull_request"`: Commits universal sources to a remote GitHub Pull Request branch (requires `GITHUB_TOKEN` and `GITHUB_REPO`).

---

### 4. Get Job Status & Stream Events
- `GET /v1/jobs/{id}` — Returns job status, component tasks, and `publishResults` (`workspaceDir`, `filesWritten`, `downloadUrl`, `pullRequestUrl`).
- `GET /v1/jobs/{id}/events` — Server-Sent Events (SSE) stream emitting `job_status`, `task_status`, `job_completed`, and `job_failed`.
