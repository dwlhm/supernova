# Pipeline Overview

Supernova is a multi-framework component pipeline bridging design systems in Figma directly to production component libraries across multiple frontend frameworks.

## End-to-End Workflow

The workflow consists of three dedicated stages, isolated into modular packages:

1. **Extraction (`packages/figma-plugin`)**:
   - Runs as a native Figma plugin.
   - Invokes `figma.loadAllPagesAsync()` to guarantee traversal of the entire document.
   - Extracts all local variables (color, spacing, numbers), paint styles, text styles, and component sets.
   - Dispatches a single structured payload to the Go backend API.

2. **Mitosis Authoring (`packages/mitosis-author`)**:
   - The Go backend orchestrates authoring using an OpenAI-compatible LLM endpoint (local Ollama or cloud OpenAI/OpenRouter).
   - Generates single-source Mitosis `.lite.tsx` JSX code using headless state management and design tokens.
   - Feeds compiler diagnostics back into the LLM prompt if initial compilation fails (automatic repair loop up to 2 retries).

3. **Multi-Target Compilation (`packages/mitosis-compiler`)**:
   - Invokes `@builder.io/mitosis` via a headless Node.js CLI tool.
   - Compiles `.lite.tsx` components to 5 frontend frameworks:
     - **React** (`.tsx`)
     - **Svelte** (`.svelte`)
     - **Vue 3** Composition API (`.vue`)
     - **Vue 2** Options API (`.vue`)
     - **Angular** (`.ts`)

4. **Publishing & Distribution**:
   - **Download ZIP**: Download a packaged archive of all frameworks immediately from the plugin.
   - **GitHub Pull Request**: Automatically branch, commit all generated code, and open a PR against your repository.
