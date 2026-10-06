# Supernova Exporters Monorepo

Monorepo for custom Supernova exporters, Figma-to-Mitosis transpilers, and cross-framework UI component packages maintained by dwlhm.

---

## Overview & Philosophy

Modern design systems face a fundamental friction: designers define cohesive tokens and components in design tools like Figma and Supernova, but engineering teams must duplicate component logic across diverse frontend frameworks (React, Svelte, Vue 3, Vue 2, etc.). This leads to visual discrepancies, divergent APIs, and high maintenance costs.

This repository resolves that bottleneck through a unified, hybrid architecture:

> **"Single source of truth in design, universal Mitosis templates in code, zero-runtime multi-framework compilation."**

1. **Hybrid Source of Truth**:
   - **Design Tokens**: Managed in Supernova Cloud and synchronized to `tokens/` (`tokens.ts`, `tokens.css`, `theme.css`).
   - **Components**: Authored directly as Figma Component Sets, discovered via the Figma REST API, and transpiled into universal Mitosis (`components/*.lite.tsx`) with automated Drift Detection.
2. **Universal Mitosis Intermediate Layer**:
   Components are represented in framework-agnostic Mitosis JSX AST (`.lite.tsx`), abstracting state, props, event bindings, and semantic tokens without locking into any single framework runtime.
3. **Deterministic Multi-Target Compilation**:
   The Mitosis compiler translates universal ASTs into idiomatic, native framework code:
   - `@dwlhm/ui-react` (React 18 / 19 hooks and JSX, bundled with `tsup`)
   - `@dwlhm/ui-svelte` (Svelte reactive components and TypeScript ambient types)
   - `@dwlhm/ui-vue` (Vue 3 Composition API SFCs)
   - `@dwlhm/ui-vue2` (Vue 2 Options API SFCs)
4. **Cohesive Token Binding**:
   Design tokens are compiled simultaneously into TypeScript contracts and CSS custom properties (`tokens.css`, `theme.css`), guaranteeing pixel-perfect styling parity across all target frameworks.
5. **Intelligent Drift Detection & PR Automation**:
   When designers update Figma component sets or tokens, CI computes deterministic SHA-256 fingerprints to safely update templates, flag drift, and protect developer customizations.

---

## Architecture & Dataflow Pipeline

The automated build and sync pipeline follows a unidirectional dataflow from design definition to production-ready npm packages:

```
+------------------------------------+    +------------------------------------+
|          Supernova Cloud           |    |            Figma Design            |
|   (Authoritative Design Tokens)    |    |  (Component Sets, Variants, Props) |
|   *or* Local Mock Engine (Offline) |    |   *or* Local Fixtures (Offline)    |
+------------------------------------+    +------------------------------------+
                  |                                          |
                  | [1] Exporter Sync                        | [2] Figma Discovery & Transpilation:
                  |     Local: npm run export:mock           |     npm run figma:import
                  |     Cloud: Supernova CLI / Webhook       |     (scripts/figma-to-mitosis.js)
                  v                                          v
+------------------------------------+    +------------------------------------+
|              tokens/               |    |            components/             |
|   - tokens.ts                      |    |   - Button.lite.tsx                |
|   - tokens.css                     |    |   - Badge.lite.tsx                 |
|   - theme.css                      |    |   - Checkbox.lite.tsx              |
+------------------------------------+    |   - AlertDialog.lite.tsx           |
                  |                       +------------------------------------+
                  |                                          |
                  | [3] Token Sync:                          | [4] Drift Detection & Lifecycle:
                  |     npm run generate:tokens              |     npm run sync:components
                  v                                          v
+------------------------------------+    +------------------------------------+
|       @dwlhm/design-tokens         |    |     .components-manifest.json      |
|       (packages/tokens)            |    |     & components.catalog.json      |
|   - src/tokens.ts, index.ts        |    +------------------------------------+
|   - css/tokens.css, theme.css      |                       |
+------------------------------------+                       |
                  ^                                          | [5] Mitosis Multi-Target Compilation:
                  |                                          |     npm run generate:components
                  |                                          |     (Mitosis APIs + Framework Adapters)
                  +-------------------+----------------------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
+------------------+         +------------------+         +------------------+
|  @dwlhm/ui-react |         | @dwlhm/ui-svelte |         |   @dwlhm/ui-vue  |
| (packages/react) |         | (packages/svelte)|         |  (packages/vue)  |
| - Button.tsx     |         | - Button.svelte  |         | - Button.vue     |
| - Badge.tsx      |         | - Badge.svelte   |         | - Badge.vue      |
| - Checkbox.tsx   |         | - Checkbox.svelte|         | - Checkbox.vue   |
| - AlertDialog.tsx|         | - AlertDialog... |         | - AlertDialog.vue|
| - dist/ (esm,cjs)|         | - ambient.d.ts   |         | - @dwlhm/ui-vue2 |
+------------------+         +------------------+         +------------------+
         |                            |                            |
         +----------------------------+----------------------------+
                                      |
                                      v
                        +----------------------------+
                        |   VitePress Documentation  |
                        |          (docs/)           |
                        +----------------------------+
```

### Pipeline Stages

1. **Design Token Sync (`Supernova Cloud -> tokens/`)**:
   Tokens are maintained in Supernova Cloud and exported into `tokens/` as TypeScript constants (`tokens.ts`) and CSS custom properties (`tokens.css`, `theme.css`).
2. **Figma Component Transpilation (`Figma -> components/*.lite.tsx`)**:
   `scripts/import-figma-components.js` fetches component set nodes via the Figma REST API. `scripts/figma-to-mitosis.js` transpiles Figma autolayout, variant combinations, and design token references into universal Mitosis `.lite.tsx` templates.
3. **Drift Detection & Lifecycle Control (`scripts/process-pr-components.js`)**:
   Tracks component SHA-256 fingerprints in `.components-manifest.json`. Automatically detects when Figma definitions drift from Git base branches, generates fresh templates, and protects custom code modifications.
4. **Token Distribution (`npm run generate:tokens`)**:
   Mirrors tokens into `packages/tokens/`, producing `@dwlhm/design-tokens` with TypeScript declarations and CSS bundles.
5. **Multi-Target Component Compilation (`npm run generate:components`)**:
   Reads universal `.lite.tsx` components from `components/` and compiles them into idiomatic React (`packages/react`), Svelte (`packages/svelte`), Vue 3 (`packages/vue`), and Vue 2 (`packages/vue2`).
6. **Package Bundling & Docs (`npm run build:packages` & `npm run docs:build`)**:
   Bundles all packages into production ESM/CJS libraries and builds the interactive VitePress documentation site.

---

## CI/CD & PR Automation Workflow

The repository employs an automated two-pull-request workflow designed to maintain token integrity, provide maintainer review over generated templates, and automate multi-framework compilation:

### 1. PR 1: Supernova Token Sync & Validation (`.github/workflows/pr-component-sync.yml`)
- **Trigger**: Pull requests targeting `main` from Supernova Cloud modifying `tokens/**` or `components.catalog.json`.
- **Role**: Validates tokens and package compilation in an isolated, read-only CI check.
- **Workflow**:
  1. Checks out the PR branch and installs dependencies.
  2. Validates design tokens using the mock exporter test suite (`npm run test:exporter`).
  3. Tests building tokens and framework packages (`npm run generate:tokens && npm run build:packages`).
  4. **Zero Mutation Guarantee**: Does **not** push or modify templates back into PR 1. Supernova's pull request remains clean and purely token-focused.

### 2. PR 2: Template Confirmation & Multi-Framework Generation (`.github/workflows/template-sync-pr.yml`)
- **Trigger**: Automated on `push` to `main` with paths `tokens/**` or `components.catalog.json` (e.g. when PR 1 is merged), or manually via `workflow_dispatch`.
- **Role**: Regenerates universal Mitosis templates and compiles multi-framework packages, opening a confirmation PR against `main`.
- **Workflow**:
  1. Checks out repository with full git history.
  2. Syncs tokens into packages (`npm run generate:tokens`).
  3. Runs Figma component discovery and import (`npm run figma:import`), or falls back to template drift synchronization (`npm run sync:components`).
  4. Generates multi-framework components for React, Svelte, Vue 3, and Vue 2 (`npm run generate:components`).
  5. Updates VitePress documentation pages and component manifests (`npm run generate:docs`).
  6. Detects drift across `components/`, `packages/`, `docs/`, `.components-manifest.json`, and `components.catalog.json`.
  7. If changes exist, pushes to branch `chore/sync-templates-and-packages` and creates or updates a dedicated confirmation Pull Request against `main`.
- **Maintainer Confirmation**: Maintainers review the generated Mitosis templates (`components/*.lite.tsx`) and compiled multi-framework packages before merging.

### 3. Release & Deployment Lifecycle (`.github/workflows/design-system-ci.yml`)
- **Trigger**: `push` to `main` with changes to `components/**`, `packages/**`, or `.components-manifest.json` (i.e. when PR 2 is approved and merged into `main`), or manual execution via `workflow_dispatch` / `repository_dispatch`.
- **Workflow**:
  1. Validates the committed Supernova exporter bundle (`git diff --exit-code -- exporter/dist/index.js`).
  2. Executes full automated test suite (`npm test`).
  3. Runs full generation pipeline (`npm run generate`) and builds all framework packages (`npm run build:packages`).
  4. Builds static VitePress documentation site (`npm run docs:build`).
  5. Bumps patch version automatically across workspaces (`npm version patch --workspaces`).
  6. Tags git release (`vX.Y.Z`) and deploys the static documentation site to GitHub Pages.

---

## CLI Commands Reference

| Command | Script / Target | Description |
|---|---|---|
| `npm run figma:discover` | `scripts/import-figma-components.js --dry-run` | Discovers component sets from Figma file, inspects variant properties and token bindings without writing to disk. |
| `npm run figma:import` | `scripts/import-figma-components.js` | Imports component sets directly from Figma API, transpiles them into universal Mitosis (`components/*.lite.tsx`), and registers them in `components.catalog.json`. |
| `npm run figma:sync` | `scripts/import-figma-components.js && scripts/process-pr-components.js` | Full end-to-end Figma synchronization: imports component sets and resolves component PR drift in one step. |
| `npm run sync:components` | `scripts/process-pr-components.js` | Runs drift detection and template lifecycle controller. Compares SHA-256 fingerprints against `.components-manifest.json` to safely manage updates. |
| `npm run generate` | `generate:tokens` + `generate:components` + `generate:docs` | Master generation command: syncs tokens, compiles Mitosis templates to all 4 framework packages, and regenerates documentation files. |
| `npm run build:packages` | `npm run build --workspaces --if-present` | Compiles and bundles all framework packages (`@dwlhm/design-tokens`, `@dwlhm/ui-react`, `@dwlhm/ui-svelte`, `@dwlhm/ui-vue`, `@dwlhm/ui-vue2`) with ESM/CJS and TypeScript definitions. |
| `npm run docs:dev` | `vitepress dev docs` | Launches the interactive VitePress documentation site locally with Hot Module Replacement (HMR). |
| `npm run docs:build` | `vitepress build docs` | Builds production-ready static VitePress documentation site for deployment (GitHub Pages). |
| `npm test` | Unified Test Runner | Executes all 4 automated test suites (exporter, figma import, figma-to-mitosis transpiler, drift controller — 34 tests total). |
| `npm run test:exporter` | `exporter/mock/test.js` | Runs unit and integration tests for the Supernova Pulsar exporter and mock engine. |
| `npm run test:figma-import` | `scripts/test-import-figma-components.js` | Runs unit tests for Figma component set discovery, name normalization, and catalog generation. |
| `npm run test:figma-to-mitosis` | `scripts/test-figma-to-mitosis.js` | Runs unit tests for the Figma-to-Mitosis AST transpiler and variant resolution. |
| `npm run test:pr-components` | `scripts/test-process-pr-components.js` | Runs unit tests for PR drift detection, fingerprint computation, and lifecycle management. |
| `npm run export:mock` | `exporter/mock/runner.js` | Runs local offline Supernova mock exporter without requiring Supernova Cloud or API keys. |
| `npm run dev:mock` | `exporter/mock/runner.js --watch` | Runs local mock exporter in watch mode, automatically regenerating output on code changes. |
| `npm run clean` | `scripts/clean.js` | Cleans build artifacts (`dist/`, generated packages) across all workspaces. |

---

## Workspaces & Components

### Workspaces Breakdown

| Workspace | Directory | Role & Description |
|---|---|---|
| **`@dwlhm/supernova-exporter-mitosis`** | `exporter/` | Custom Supernova Pulsar exporter plugin. Transforms design tokens into CSS/TypeScript contracts. |
| **`@dwlhm/design-tokens`** | `packages/tokens/` | Standalone design tokens package exporting TypeScript token contracts and CSS stylesheets (`tokens.css`, `theme.css`). |
| **`@dwlhm/ui-react`** | `packages/react/` | Production React component library (supports React 18 and 19) compiled from universal Mitosis components and bundled with `tsup`. |
| **`@dwlhm/ui-svelte`** | `packages/svelte/` | Svelte UI component library compiled from Mitosis, complete with ambient Svelte module declarations for type-checking. |
| **`@dwlhm/ui-vue`** | `packages/vue/` | Vue 3 component library compiled from Mitosis (Composition API). |
| **`@dwlhm/ui-vue2`** | `packages/vue2/` | Vue 2 component library compiled from Mitosis (Options API). |

### Core Component Catalog

Each component is authored as a universal Mitosis template (`components/*.lite.tsx`) and compiled across all supported framework packages:

- **`Button`**: Multi-variant interactive button supporting `primary`, `secondary`, `outline`, `ghost`, `destructive`, and `link` styles, responsive sizes (`large`, `regular`, `small`, `mini`), roundness treatments, interaction states (`default`, `hover`, `focus`, `pressed`, `disabled`), and optional leading/trailing icons.
- **`Badge`**: Visual status indicator supporting contextual semantics (`primary`, `secondary`, `destructive`, `success`, `warning`, `info`, `outline`) and editable text labels.
- **`Checkbox`**: Form selection control supporting selected (`on`), unselected (`off`), and indeterminate states, responsive sizes (`small`, `medium`, `large`), disabled states, and configurable left/right label placement.
- **`AlertDialog`**: Accessible modal dialog for high-consequence user actions, supporting customizable heading and description content, safe cancel actions, and destructive/primary confirmation actions.

---

## Environment Setup & Quick Start

### Prerequisites

- Node.js (>= 18.0.0, Node 22 recommended)
- npm (>= 9.0.0)

### 1. Installation

Install all workspace dependencies from the root directory:

```bash
npm install
```

### 2. Environment Variables Configuration

Copy `.env.example` to `.env` and configure your API tokens:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Supernova Personal Access Token / API Key
SUPERNOVA_API_KEY=your_supernova_api_key_here

# Figma Personal Access Token
# Required scopes: file_content:read, file_metadata:read, library_content:read, team_library_content:read
FIGMA_ACCESS_TOKEN=your_figma_access_token_here

# Figma File Key (extracted from URL: figma.com/file/<key>/...)
FIGMA_FILE_KEY=your_figma_file_key_here
```

### 3. Verification & Build Commands

```bash
# 1. Run all 34 automated unit and integration tests
npm test

# 2. Synchronize tokens, compile Mitosis components, and build docs
npm run generate

# 3. Build all framework packages (React, Svelte, Vue, Tokens)
npm run build:packages

# 4. Build documentation site
npm run docs:build
```

---

## Offline Local Development (Mock Engine)

You can develop, modify, and test the exporter and components **100% offline without Supernova Cloud or Figma API credentials**:

```bash
# 1. Run mock exporter once (emits to output/)
npm run export:mock

# 2. Watch mode: auto-rebuild on exporter code changes
npm run dev:mock

# 3. Export with Dark Theme override
npm run export:mock:dark

# 4. Full mock pipeline: Mock Export -> Token Sync -> Mitosis Compilation -> Docs
npm run mock:generate

# 5. Run mock exporter automated test suite
npm run test:exporter
```

See the [Mock Engine Documentation](exporter/mock/README.md) for details on modifying mock fixtures in `exporter/mock/data/`.

---

## Repository Structure

```tree
.
├── .env.example               # Environment variables template (Figma + Supernova)
├── .components-manifest.json  # Component fingerprint tracking for drift detection
├── components.catalog.json    # Canonical catalog of imported Figma component sets
├── package.json               # Root monorepo configuration (npm workspaces)
├── components/                # Universal Mitosis components (*.lite.tsx)
│   ├── AlertDialog.lite.tsx
│   ├── Badge.lite.tsx
│   ├── Button.lite.tsx
│   └── Checkbox.lite.tsx
├── tokens/                    # Design tokens exported from Supernova
│   ├── tokens.ts              # TypeScript token contracts
│   ├── tokens.css             # CSS custom properties
│   └── theme.css              # Theme CSS overrides
├── scripts/
│   ├── figma-to-mitosis.js          # Figma node to Mitosis universal JSX transpiler
│   ├── import-figma-components.js   # Figma component sets discovery and import CLI
│   ├── process-pr-components.js     # Component PR drift detector & lifecycle controller
│   ├── sync-tokens.js               # Synchronizes tokens into packages/tokens
│   ├── generate-components.js       # Mitosis multi-target compiler (React, Svelte, Vue)
│   ├── generate-docs.js             # VitePress documentation generator
│   └── clean.js                     # Cleans build artifacts across workspaces
├── packages/
│   ├── tokens/                # @dwlhm/design-tokens
│   ├── react/                 # @dwlhm/ui-react
│   ├── svelte/                # @dwlhm/ui-svelte
│   ├── vue/                   # @dwlhm/ui-vue
│   └── vue2/                  # @dwlhm/ui-vue2
├── docs/                      # VitePress interactive documentation site
├── exporter/                  # Supernova Mitosis custom exporter workspace
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── README.md              # Exporter architecture and documentation
│   ├── mock/                  # 100% Offline Mock Development Engine
│   └── src/                   # Exporter TypeScript source files
├── exporter.json              # Supernova manifest referencing exporter/dist/index.js
└── config.json                # Supernova configuration parameters
```

---

## Installing this Exporter in Supernova

Use the repository URL: **https://github.com/dwlhm/supernova**. The repository root contains the authoritative `exporter.json` and `config.json`; its manifest selects `exporter/dist/index.js` as the executable. Supernova treats the repository root as the exporter package root. See [installing exporters](https://developers.supernova.io/latest/exporters/installing-exporters-GT7tr0qA) and [exporter anatomy](https://developers.supernova.io/latest/exporters/building-exporters-101/exporter-anatomy-HvQzZtsO).

Before importer refresh or an exporter version update, run `npm run build:exporter` from the repository root, then commit and push `exporter/dist/index.js` together with the matching sources, root `exporter.json` and `config.json`. The build validates the package automatically; `npm run validate:exporter-package` runs that check separately. After any exporter source change, rebuild and stage the bundled executable in the same commit; CI rejects a bundle that differs from a fresh build. The compiled executable is an intentional installation artifact; TypeScript sources remain authoritative. Other `dist/` files stay ignored. Validation checks manifest/config presence, safe executable paths, nonempty bundled JavaScript at the expected path; rebuilding is required to keep the committed executable current. Bundling dependencies remains the responsibility of the `noExternal` setting in `exporter/tsup.config.ts`.

Cloud installation has not been verified by the local package validation.

---

## License

MIT © dwlhm
