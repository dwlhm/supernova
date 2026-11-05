# Pipeline Overview

Supernova is a multi-framework component pipeline bridging design systems in Figma directly to production component libraries across multiple frontend frameworks.

## End-to-End Workflow

The workflow consists of three dedicated stages, isolated into modular packages:

1. **Extraction (`packages/figma-plugin`)**:
   - Runs as a native Figma plugin.
   - Invokes `figma.loadAllPagesAsync()` to guarantee traversal of the entire document.
   - Extracts all local variables (color, spacing, numbers), paint styles, text styles, and component sets.
   - Dispatches a single structured payload to the TypeScript backend API (`apps/api`).

2. **Deterministic Pre-Compiler & Mitosis Authoring (`packages/mitosis-author`)**:
   - The TypeScript backend (`@supernova/api`) translates Figma Auto Layout geometry, `boundVariables`, and cleaned variant properties into a deterministic blueprint before invoking an OpenAI-compatible LLM endpoint.
   - Generates single-source Mitosis `.lite.tsx` JSX code using headless state management (`utils.ts`) and design tokens.
   - Normalizes Mitosis AST patterns and feeds compiler/render diagnostics back into the LLM prompt if initial compilation fails (stateful cross-attempt repair loop).

3. **Multi-Target Compilation & Quality Gate (`packages/mitosis-compiler`)**:
   - Directly invoked in-process by `@supernova/api` (zero subprocess overhead).
   - Compiles `.lite.tsx` components to 5 frontend frameworks with AST linting and SSR/DOM render verification:
     - **React** (`.tsx`)
     - **Svelte** (`.svelte`)
     - **Vue 3** Composition API (`.vue`)
     - **Vue 2** Options API (`.vue`)
     - **Angular** (`.ts`)

4. **Publishing & Distribution**:
   - **Download ZIP**: Download a packaged archive of all frameworks immediately from the plugin.
   - **GitHub Pull Request**: Automatically branch, commit all generated code, and open a PR against your repository.
