# Supernova Exporters Monorepo

Monorepo for custom Supernova exporters, tools, and UI component packages maintained by dwlhm.

---

## Overview & Philosophy

Modern design systems face a fundamental friction: designers define cohesive tokens and components in design tools like Figma and Supernova, but engineering teams must duplicate component logic across diverse frontend frameworks (React, Svelte, Vue, etc.). This leads to visual discrepancies, divergent APIs, and high maintenance costs.

This repository resolves that bottleneck through a single foundational principle:

> **"Write once in Mitosis, compile to any frontend framework."**

1. **Single Source of Truth**: Supernova Cloud and Figma serve as the authoritative origin for all design tokens (colors, typography, spacing, elevations) and component specifications.
2. **Universal Mitosis Intermediate Layer**: Rather than maintaining divergent component codebases, the Supernova exporter generates framework-agnostic Mitosis (`.lite.tsx`) components. Mitosis represents component state, props, styling, and template logic in a universal TypeScript/JSX AST.
3. **Deterministic Multi-Target Compilation**: The Mitosis compiler translates the universal AST into idiomatic, framework-native output (e.g., React hooks and TSX, Svelte reactive stores and SFCs) with zero runtime translation overhead.
4. **Cohesive Token Binding**: Design tokens are compiled simultaneously into TypeScript objects and CSS custom properties (`tokens.css`, `theme.css`), guaranteeing pixel-perfect styling parity across all target frameworks.

---

## Architecture & Dataflow Pipeline

The automated build and sync pipeline follows a unidirectional dataflow from design definition to production-ready npm packages:

```
+--------------------------------------------------------------+
|                Supernova Cloud / Figma                       |
|         (Design Tokens, Styles & Components)                 |
|                                                              |
|        *OR* Offline Local Mock Engine (No Cloud Needed)      |
|             (exporter/mock/data/{tokens,groups,themes}.json) |
+--------------------------------------------------------------+
                               |
                               | [1] Exporter run:
                               |     Local: npm run export:mock
                               |     Cloud: supernova run-local-exporter
                               v
+--------------------------------------------------------------+
|     @dwlhm/supernova-exporter-mitosis (Pulsar Plugin)        |
+--------------------------------------------------------------+
             |                                    |
             | Generates                          | Generates
             v                                    v
+-----------------------------+     +-----------------------------+
|    output/tokens/           |     |    output/components/       |
|    - tokens.ts              |     |    - Button.lite.tsx        |
|    - tokens.css             |     |    - Card.lite.tsx          |
|    - theme.css              |     |    - Badge.lite.tsx         |
+-----------------------------+     |    - Input.lite.tsx         |
             |                      |    - Typography.lite.tsx    |
             | [2] Token Sync:      +-----------------------------+
             |     npm run                         |
             |     generate:tokens                 | [3] Mitosis Compilation:
             v                                     |     npm run generate:components
+-----------------------------+                    |     (Mitosis code generation APIs + moveToSrcPlugin)
| @dwlhm/design-tokens        |                    +---------------+---------------+
| (packages/tokens)           |                                    |               |
| - src/tokens.ts, index.ts   |                                    v               v
| - css/tokens.css, theme.css |                       +-------------------+ +-------------------+
+-----------------------------+                       |  @dwlhm/ui-react  | |  @dwlhm/ui-svelte |
             ^                                        | (packages/react)  | | (packages/svelte) |
             |                                        | - src/Button.tsx  | | - src/Button.svelte|
             +--------------------+-------------------| - src/Card.tsx    | | - src/Card.svelte  |
                                  | consumes tokens   | - src/index.ts    | | - src/ambient.d.ts |
                                  +-------------------| - dist/ (esm,cjs) | | - src/index.ts    |
                                                      +-------------------+ +-------------------+
```

### Pipeline Stages

1. **Design System Origin (Supernova Cloud OR Offline Mock Data)**:
   Tokens and component definitions are maintained in Supernova Cloud or directly simulated via the offline mock engine in `exporter/mock/data/`.
2. **Pulsar Exporter Execution**:
   Executing `npm run export:mock` (or `supernova run-local-exporter`) invokes `@dwlhm/supernova-exporter-mitosis`, transforming design tokens and components into structured intermediate files inside `output/`.
3. **Intermediate Artifact Staging**:
   - `output/tokens/`: Contains TypeScript token maps (`tokens.ts`) and CSS custom property definitions (`tokens.css`, `theme.css`).
   - `output/components/`: Universal Mitosis components (`*.lite.tsx`).
4. **Token Distribution Sync (`npm run generate:tokens`)**:
   `scripts/sync-tokens.js` mirrors token definitions into `packages/tokens/src/` and `packages/tokens/css/`, auto-generating barrel exports (`index.ts`).
5. **Mitosis Compilation & Post-Processing (`npm run generate:components`)**:
   `scripts/generate-components.js` owns the four target configurations and options, reads `output/components/*.lite.tsx`, and invokes Mitosis code generation APIs for React, Svelte, Vue 3 and Vue 2.
6. **Package Bundling & Distribution (`npm run build:packages`)**:
   Compiles target packages into production-ready ESM and CommonJS bundles with TypeScript declarations (`.d.ts`).

---

## Offline Local Development (Mock Supernova)

Kamu dapat mengembangkan, memodifikasi, dan menguji exporter **100% offline tanpa akun Supernova Cloud, tanpa login CLI, dan tanpa API Key**.

```bash
# 1. Jalankan mock exporter sekali (output/ langsung ter-generate)
npm run export:mock

# 2. Mode Live Watch: otomatis rebuild dan export saat kode exporter diubah
npm run dev:mock

# 3. Ekspor dengan Dark Theme override
npm run export:mock:dark

# 4. Pipeline komplit: Mock Export -> Token Sync -> Mitosis Compilation -> Docs
npm run generate:mock

# 5. Jalankan automated test untuk mock exporter
npm run test:exporter
```

Lihat [dokumentasi lengkap mock engine](file:///Users/dwlhm/komerce/supernova/exporter/mock/README.md) untuk detail memodifikasi atau menambahkan token mock di `exporter/mock/data/tokens.json`.

---

## Workspaces & Components

### Workspaces Breakdown

| Workspace | Directory | Role & Description |
|---|---|---|
| **`@dwlhm/supernova-exporter-mitosis`** | `exporter/` | Custom Supernova Pulsar exporter plugin. Transforms design tokens into CSS/TypeScript and components into universal Mitosis `.lite.tsx` definitions. |
| **`@dwlhm/design-tokens`** | `packages/tokens/` | Standalone design tokens package exporting TypeScript token contracts and CSS stylesheets (`tokens.css`, `theme.css`). |
| **`@dwlhm/ui-react`** | `packages/react/` | Production React component library (supports React 18 and 19) compiled from universal Mitosis components and bundled with `tsup`. |
| **`@dwlhm/ui-svelte`** | `packages/svelte/` | Svelte UI component library compiled from Mitosis, complete with ambient Svelte module declarations for type-checking. |
| **`@dwlhm/ui-vue`** | `packages/vue/` | Vue 3 component library compiled from Mitosis (Composition API). |
| **`@dwlhm/ui-vue2`** | `packages/vue2/` | Vue 2 component library compiled from Mitosis (Options API). |

### Core Component Catalog

Each component is authored as a universal Mitosis template (`output/components/*.lite.tsx`) and compiled across all supported framework packages:

- **`Button`**: Multi-variant interactive button supporting `primary`, `secondary`, `outline`, `ghost`, and `danger` variants, responsive sizes (`sm`, `md`, `lg`), disabled states, and full-width layout.
- **`Card`**: Structured container component with configurable padding, elevation, hover effects, and bordered styling.
- **`Badge`**: Visual status tag supporting contextual colors (`primary`, `success`, `warning`, `danger`, `neutral`) and pill styling.
- **`Input`**: Form input with label, placeholder, helper text, error validation state, disabled mode, and change handlers.
- **`Typography`**: Design system typography wrapper supporting heading and body scales, font weights, colors, and semantic tags (`h1`-`h6`, `p`, `span`).

---

## Quick Start

### Prerequisites

- Node.js (>= 18.0.0)
- npm (>= 9.0.0)

### Installation

Install all workspace dependencies from the root directory:

```bash
npm install
```

### Full Offline Build & Verify

```bash
# 1. Export tokens & components via mock Supernova
npm run export:mock

# 2. Sync tokens, compile Mitosis components, and build docs
npm run generate

# 3. Build all consumer packages (React, Svelte, Vue, Tokens)
npm run build:packages
```

---

## Repository Structure

```tree
.
├── package.json               # Root monorepo configuration (npm workspaces)
├── mitosis.config.js          # Mitosis multi-target compiler configuration
├── scripts/
│   ├── sync-tokens.js         # Syncs tokens from output/tokens to packages/tokens
│   ├── generate-components.js # Mitosis multi-target compiler script
│   ├── generate-docs.js       # VitePress docs generator
│   └── clean.js               # Cleans generated artifacts across packages
├── output/                    # Exporter output directory
│   ├── components/            # Mitosis .lite.tsx components
│   └── tokens/                # Generated tokens (tokens.ts, tokens.css, theme.css)
├── packages/
│   ├── tokens/                # @dwlhm/design-tokens
│   ├── react/                 # @dwlhm/ui-react
│   ├── svelte/                # @dwlhm/ui-svelte
│   ├── vue/                   # @dwlhm/ui-vue
│   └── vue2/                  # @dwlhm/ui-vue2
└── exporter/                  # Mitosis custom exporter workspace
    ├── package.json
    ├── tsconfig.json
    ├── tsup.config.ts
    ├── exporter.json          # Supernova exporter manifest
    ├── config.json            # Supernova exporter configuration parameters
    ├── README.md              # Mitosis exporter documentation
    ├── mock/                  # 100% Offline Mock Development Engine
    │   ├── runner.js          # Mock runner & live file watcher CLI
    │   ├── mock-sdk.js        # Mock Supernova SDK & Pulsar bridge
    │   ├── test.js            # Automated test suite
    │   ├── README.md          # Mock documentation & token guide
    │   └── data/
    │       ├── tokens.json    # 66+ Realistic design tokens (colors, typography, etc.)
    │       ├── token-groups.json # Group hierarchy
    │       └── themes.json    # Theme overrides (e.g., dark mode)
    └── src/
        ├── index.ts           # Main Supernova exporter entrypoint
        ├── config.ts          # Type definitions for exporter settings
        ├── generators/
        │   ├── token-generator.ts      # Generates tokens.ts, tokens.css, theme.css
        │   ├── component-generator.ts  # Generates Mitosis universal .lite.tsx components
        │   └── index-generator.ts      # Generates root index.ts barrel file
        └── utils/
            ├── file-helper.ts          # File formatting and header helpers
            └── naming.ts               # Case conversion and identifier sanitization
```

---

## License

MIT © dwlhm

Engineering owns the versioned `mitosisDefinition` Text custom property on Supernova catalog components; designers retain the Figma workflow. The exporter validates that contract, emits Mitosis using typed AST construction, and emits ordinary TypeScript runtime helpers separately. `scripts/generate-components.js` generates all four framework targets and copies runtime helpers. See [exporter architecture and setup](exporter/README.md#component-architecture-and-ownership). Supernova cloud setup remains a prerequisite; local fixtures use the same SDK property shape.

## Installing this exporter in Supernova

Use the exporter subdirectory URL: **https://github.com/dwlhm/supernova/tree/main/exporter**. The whole repository root URL is incorrect for this monorepo because `exporter.json` lives inside `exporter/`. Supernova treats the selected directory as the exporter package root. See [installing exporters](https://developers.supernova.io/latest/exporters/installing-exporters-GT7tr0qA) and [exporter anatomy](https://developers.supernova.io/latest/exporters/building-exporters-101/exporter-anatomy-HvQzZtsO).

Before importer refresh or an exporter version update, run `npm run build:exporter` from the repository root, then commit and push `exporter/dist/index.js` together with the matching sources, `exporter/exporter.json` and `exporter/config.json`. The build validates the package automatically; `npm run validate:exporter-package` runs that check separately. After any exporter source change, rebuild and stage the bundled executable in the same commit; CI rejects a bundle that differs from a fresh build. The compiled executable is an intentional installation artifact; TypeScript sources remain authoritative. Other `dist/` files stay ignored. Validation checks manifest/config presence, safe executable paths, nonempty bundled JavaScript at the expected path; rebuilding is required to keep the committed executable current. Bundling dependencies remains the responsibility of the `noExternal` setting in `exporter/tsup.config.ts`.

Cloud installation has not been verified by the local package validation.
