# Supernova

Supernova is an automated, multi-framework design system component pipeline that bridges Figma design tokens and component specs with production code.

---

## Overview

The Supernova component pipeline operates through the following stages:

```text
[ Figma File / Plugin ]
          │
          │ 1. Extracts Component Specs & Design Tokens
          ▼
[ Go Backend API (apps/api) ]
          │
          ├─► 2. Checks Existing Code from Git Repository (Incremental Mode)
          ├─► 3. LLM Authoring (packages/mitosis-author)
          │      - Generates universal Mitosis (.lite.tsx) component
          │      - Discovers missing tokens & names them semantically (newTokens)
          ├─► 4. Pre-flight Quality Gate (packages/mitosis-compiler)
          │      - Tests compilation to React, Svelte, Vue 3, Vue 2, Angular
          │      - Triggers Self-Healing Repair Loop if errors occur
          │
          ▼
[ GitHub PR / GitLab MR Review ]
          │
          ├─► 5. Programmer Reviews Minimal Diff:
          │      - src/components/{Component}.lite.tsx
          │      - src/tokens/tokens.json
          ├─► 6. Programmer tweaks/commits directly to the PR branch
          │
          ▼
[ CI/CD Release Pipeline (on merge) ]
          │
          └─► 7. Compiles universal Mitosis code to 5 target frameworks
                 and publishes multi-framework packages (@ui-react, @ui-vue, etc.)
```

---

## Workspace Layout

| Path | Description | Tech Stack |
| --- | --- | --- |
| `apps/api` | Backend API and orchestration service | Go 1.25 |
| `apps/docs` | Project documentation site | VitePress |
| `packages/contracts` | Shared OpenAPI specs and generated TypeScript/Go types | OpenAPI / TypeScript |
| `packages/figma-plugin` | Figma extraction and synchronization plugin | TypeScript / esbuild |
| `packages/mitosis-author` | LLM-assisted Mitosis component authoring engine | Go 1.25 |
| `packages/mitosis-compiler` | Cross-framework compilation pipeline | Node.js 22 / TypeScript |

---

## Prerequisites

Before getting started, make sure you have the following installed:

- **Go**: `>= 1.25`
- **Node.js**: `>= 22.0.0`
- **pnpm**: `>= 10.0.0`
- **Figma Desktop App** (required for importing local development plugins)
- **LLM Engine**: Either a local instance of [Ollama](https://ollama.com/) (free & offline) or an OpenAI / OpenRouter API Key.

---

## Setup & Configuration

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/dwlhm/supernova.git
cd supernova

# Install dependencies across all monorepo packages
make install
```

### 2. Configure Environment Variables (`.env`)

Copy the example environment file to `.env`:

```bash
cp .env.example .env
```

Open `.env` and configure your settings:

```dotenv
# ==============================================================================
# Server Configuration
# ==============================================================================
PORT=8080

# Bearer Token for the Backend API (required). Paste the same value into the Figma plugin.
# Generate one with: openssl rand -hex 32
API_TOKEN=

# Local development only: run without auth. The server refuses to start with an empty
# API_TOKEN unless this is exactly "true".
# SUPERNOVA_INSECURE_NO_AUTH=true

# ==============================================================================
# LLM Provider Configuration (OpenAI-compatible)
# ==============================================================================

# Option A: Local Ollama (Default - 100% Local & Free)
LLM_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=ollama
LLM_MODEL=llama3.2
# Recommended alternative Ollama models: qwen2.5-coder, deepseek-r1:8b, mistral

# Option B: OpenAI Cloud
# LLM_BASE_URL=https://api.openai.com/v1
# LLM_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
# LLM_MODEL=gpt-4o-mini

# Option C: OpenRouter
# LLM_BASE_URL=https://openrouter.ai/api/v1
# LLM_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxx
# LLM_MODEL=anthropic/claude-3.5-sonnet

# ==============================================================================
# GitHub PR Integration (Required for Automated Git PR Output)
# ==============================================================================
# Generate a GitHub Personal Access Token (classic or fine-grained)
# Permissions needed: 'repo' (or 'Contents: Read & Write' and 'Pull Requests: Read & Write')
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=your-org/your-design-system-repo
GITHUB_BASE_BRANCH=main
```

---

## Running the Components

### Step 1: Start the Backend API Server

In a new terminal window:

```bash
cd apps/api
go run ./cmd/api
```

You should see high-visibility startup logs:

```text
2026/10/07 15:00:00 INFO [SERVER] Loading environment configuration...
2026/10/07 15:00:00 INFO [SERVER] Supernova API configured | port=8080 auth_enabled=false llm_model=llama3.2 llm_base_url=http://localhost:11434/v1 github_repo=your-org/your-design-system-repo
2026/10/07 15:00:00 INFO [SERVER] Starting Supernova API server on port 8080
```

Verify that the server is healthy:

```bash
curl http://localhost:8080/v1/health
# Response: {"status":"ok","version":"1.0.0"}
```

---

### Step 2: Build the Figma Plugin

In a separate terminal window, build the Figma plugin bundle:

```bash
pnpm --filter @supernova/figma-plugin build
```

This compiles `src/code.ts` and `src/ui.ts` into the `packages/figma-plugin/dist/` directory.

---

### Step 3: Load the Plugin into Figma Desktop App

1. Open the **Figma Desktop App**.
2. Open any Figma design file containing your design components and styles/variables.
3. Click the **Figma Menu** (top-left) ➔ **Plugins** ➔ **Development** ➔ **Import plugin from manifest...**.
4. In the file picker, select:
   ```text
   <your-project-path>/packages/figma-plugin/manifest.json
   ```
5. The plugin **Supernova Design System Extractor** is now registered under your development plugins!

---

## End-to-End Workflow Tutorial

### 1. Triggering the Sync from Figma

1. In Figma, right-click on the canvas or press `Cmd + /` (macOS) / `Ctrl + /` (Windows).
2. Type `Supernova` and launch **Supernova Design System Extractor**.
3. In the plugin popup:
   - **Backend API URL**: Keep as `http://localhost:8080` (or your remote URL).
   - **API Bearer Token**: The `API_TOKEN` value from your `.env` (leave blank only when running with `SUPERNOVA_INSECURE_NO_AUTH=true`).
   - **Target Frameworks**: Check the frameworks you plan to build (React, Svelte, Vue 3, Vue 2, Angular).
   - **Publish Outputs**:
     - Check **GitHub PR** to create a clean reviewable Pull Request on GitHub.
     - Check **Download ZIP** if you also want a direct zip download.
4. Click **Extract Entire Document & Generate**.

---

### 2. Monitoring Real-Time Backend Telemetry

Look at your backend terminal. The backend logs every single phase with high clarity:

1. **HTTP Inbound**: Logs request method, path, remote IP, and request ID.
2. **Repository Pre-fetch**: Checks if `src/components/{Component}.lite.tsx` already exists in your GitHub repository. If found, switches to **Incremental Refactoring Mode**.
3. **LLM Authoring**: Calls the LLM to generate Mitosis code and discover any unmapped design tokens.
4. **Pre-flight Quality Check**: Invokes the `mitosis-compiler` locally to verify that the universal JSX compiles to all selected frameworks without errors.
   - If a syntax warning or error occurs, the **Self-Healing Repair Loop** kicks in automatically to fix it!
5. **Git Pull Request**: Opens a clean GitHub PR with only the universal Mitosis code and design tokens.

---

### 3. Reviewing the Pull Request in GitHub

Once finished, the Figma plugin UI displays a link to the created Pull Request:

1. Click the PR link (e.g. `https://github.com/your-org/your-design-system-repo/pull/42`).
2. **Review the Clean Diff**:
   - `src/components/{Component}.lite.tsx`: The clean, universal Mitosis component definition.
   - `src/tokens/tokens.json`: The consolidated design tokens (including semantic tokens discovered by AI).
   - **Zero Diff Fatigue**: No overwhelming 50+ compiled files to review.
3. **Make Adjustments (Human-in-the-Loop)**:
   - You can leave comments or suggested changes directly on lines of code.
   - You or other developers can checkout the branch (`git checkout supernova/figma-xxxx`) and push commits directly to the PR branch.
4. **Merge & Release**:
   - Merge the Pull Request into `main`.
   - Your CI/CD pipeline builds the production packages for React, Vue 3, Svelte, etc., and publishes them to your organization's registry.

---

## Core Features & Intelligence

### 1. Incremental Authoring (Preserving Developer Code)
When a component already exists in your target Git repository:
- Supernova fetches the existing `.lite.tsx` file from the base branch.
- The LLM is instructed to update the component to match the new Figma design specs **while strictly preserving** any custom helper functions, custom state hooks, and analytics integrations added by developers.

### 2. Auto-Discovery of Missing Tokens
- If a Figma component uses hardcoded colors or styles not registered in the Figma token catalog, the LLM identifies them and names them semantically (e.g., `color/button-destructive-hover`).
- These tokens are automatically merged into `src/tokens/tokens.json` and saved with the PR.

---

## Developer Commands

Run all quality checks (Go formatting, vet, Go unit tests, TypeScript typechecks, TS unit tests, and package builds):

```bash
make check
```

Run specific test suites:

```bash
# Run Go unit & integration tests
make test-go

# Run TypeScript tests
make test-ts

# Run static typechecks
make typecheck
```

---

## Troubleshooting

- **Connection Refused (`http://localhost:8080`) in Figma Plugin**:
  Ensure the Go backend is running (`cd apps/api && go run ./cmd/api`). If you are running Figma in the browser instead of the desktop app, ensure CORS or localhost networking permissions are enabled.
- **GitHub PR Fails with 401/404**:
  Verify that your `GITHUB_TOKEN` has `repo` write permissions, and that `GITHUB_REPO` is set in format `owner/repo-name` and exists.
- **LLM Timeout or Connection Error**:
  - If using Ollama: ensure Ollama is running (`ollama serve`) and the model is downloaded (`ollama pull llama3.2`).
  - If using OpenAI: check that `LLM_API_KEY` is valid and has sufficient credits.

---

## License

MIT
