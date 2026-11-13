# Pipeline Overview

Komerce Design is a local-first, VCS-agnostic pipeline bridging design systems in Figma directly to universal Mitosis sources (`src/*`) and standalone multi-framework packages (`library/*`).

## End-to-End Local Workflow

The workflow consists of four stages:

1. **Extraction (`packages/figma-plugin`)**:
   - Runs as a native Figma Desktop plugin (`figma.loadAllPagesAsync()`).
   - Extracts local variables (color, spacing, numbers), paint styles, text styles, and component sets.
   - Supports **Export Extraction JSON ⬇** (100% serverless) or **1-Click Local Sync** against `pnpm komerce listen` (`http://127.0.0.1:8080`).

2. **Deterministic Pre-Compiler & Mitosis Authoring (`packages/mitosis-author`)**:
   - Translates Figma Auto Layout geometry, `boundVariables`, and canonical variant properties into a deterministic Tailwind/Mitosis blueprint before invoking the LLM (`LLM_PROVIDER=agy` or `openai`).
   - Edits universal Mitosis `.lite.tsx` JSX components in `src/components/*.lite.tsx` and `src/icons/*.lite.tsx` using pure headless state helpers (`src/components/utils.ts`) and semantic design tokens (`src/tokens/*`).
   - Feeds compiler, linter, and TypeScript diagnostics back into the LLM in a stateful cross-attempt repair loop.

3. **Multi-Target Compilation & Quality Gate (`packages/mitosis-compiler` & `scripts/compile-library.mjs`)**:
   - Normalizes Mitosis AST patterns, enforces Tier 3 and cross-framework portability rules, and verifies in-memory TypeScript types.
   - Compiles `src/{components,icons}/*.lite.tsx` and copies `src/tokens/*` into standalone workspace packages under `library/*`:
     - **`@komerce-design/tokens`** (`library/tokens`)
     - **`@komerce-design/react`** (`library/react` — `.tsx`)
     - **`@komerce-design/vue3`** (`library/vue3` — Composition API `.vue`)
     - **`@komerce-design/svelte`** (`library/svelte` — `.svelte`)
     - **`@komerce-design/vue2`** (`library/vue2` — Options API `.vue`)
     - **`@komerce-design/angular`** (`library/angular` — `@Component` + `@NgModule` `.ts`)

4. **Local Review & Targeted Regeneration (`apps/docs` & `pnpm komerce regen`)**:
   - **Live Multi-Framework Preview (`make review`)**: Inspect all 5 frameworks side-by-side in isolated iframes at `http://localhost:5173`.
   - **Instant CLI Revision**: Run `pnpm komerce regen <Component> "<notes>"` to re-author a single component in-place and recompile `library/*` + docs.
   - **VCS-Agnostic Git Push**: Commit `src/*` and push to **GitLab**, **GitHub**, or any Git remote.
