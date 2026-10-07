# Mitosis + Tailwind Cross-Framework Component Lab

An experiment evaluating **Mitosis** as a unified single-source authoring layer for multi-framework design systems (React, Vue 3, Vue 2, and Svelte), styled with **Tailwind CSS** and powered by **Headless State & Geometry Patterns**.

---

## Overview & Scope

Modern design systems often need to support multiple frontend frameworks concurrently without duplicating UI logic or styling. This experiment demonstrates an end-to-end authoring and verification workflow:

1. **Context Preparation**: Extracting Figma raw node payloads, Auto Layout parameters, and Supernova design tokens into a normalized format.
2. **Single-Source Authoring**: Implementing components once in Mitosis JSX (`source/*.lite.tsx`) with pure headless logic and Tailwind CSS utility classes.
3. **Multi-Target Compilation**: Compiling `.lite.tsx` sources into 4 distinct framework targets (`generated/{react,vue,vue2,svelte}`).
4. **Interactive Preview**: Serving all 4 target applications via Vite with real-time framework switching.
5. **Multi-Framework E2E Verification**: Executing end-to-end browser interaction tests via Playwright across all 4 targets, capturing visual artifacts and generating structured evidence reports.

---

## Directory Structure

```
experiments/llm-mitosis/
├── context/                      # Normalized Figma payloads & design tokens
│   ├── Chart.json                # Raw Figma scene payload for Chart
│   ├── Checkbox.json             # Raw Figma scene payload for Checkbox
│   ├── DataTable.json            # Raw Figma scene payload for DataTable
│   ├── TableBodyRow.json         # Raw Figma scene payload for TableBodyRow
│   ├── TableCellValue.json       # Raw Figma scene payload for TableCellValue
│   ├── TableHeaderRow.json       # Raw Figma scene payload for TableHeaderRow
│   ├── TextField.json            # Raw Figma scene payload for TextField
│   ├── tokens.css                # CSS custom properties from design tokens
│   └── tokens.json               # Normalized token definitions
├── source/                       # Single-source Mitosis components (.lite.tsx)
│   ├── Alert.lite.tsx            # Alert notification with actions and dismiss
│   ├── Avatar.lite.tsx           # Avatar supporting initials, image, shape, size
│   ├── Button.lite.tsx           # Button with variants, styles, and sizes
│   ├── Chart.lite.tsx            # Headless dynamic SVG bar/line chart
│   ├── Checkbox.lite.tsx         # Accessible controlled checkbox
│   ├── DataTable.lite.tsx        # High-level data table wrapper
│   ├── ExperimentDemo.lite.tsx   # Interactive showcase application
│   ├── Table.lite.tsx            # Headless accessible table with row selection
│   └── TextField.lite.tsx        # Accessible controlled textfield with validation
├── generated/                    # Compiled framework outputs (built by compile.cjs)
│   ├── react/                    # React 18 (.tsx)
│   ├── vue/                      # Vue 3 Composition API (.vue)
│   ├── vue2/                     # Vue 2 Options API (.vue)
│   └── svelte/                   # Svelte 3/4 (.svelte)
├── preview/                      # Preview harnesses and Vite entrypoints
│   ├── react/                    # React preview entry
│   ├── vue/                      # Vue 3 preview entry
│   ├── vue2/                     # Vue 2 preview entry
│   ├── svelte/                   # Svelte preview entry
│   └── style.css                 # Base preview styling
├── verification/                 # Test artifacts and verification evidence
│   ├── browser-report.json       # Structured Playwright test execution results
│   ├── desktop.png               # Desktop viewport screenshot (1440x1100)
│   └── mobile.png                # Mobile viewport screenshot (390x844)
├── AUTHORING.md                  # Detailed Mitosis + Tailwind authoring guide
├── compile.cjs                   # Mitosis compilation script for all 4 targets
├── manifest.json                 # Experiment metadata, hashes, and token mappings
├── prepare-context.cjs           # Context extraction & token normalization script
├── preview.cjs                   # Vite build and multi-target preview server
├── README.md                     # This documentation
└── test.cjs                      # Playwright multi-framework browser test runner
```

---

## Workflow & Commands

### 1. Prepare Context & Tokens
Extracts Figma scenes from the local cache and normalizes Supernova tokens into `context/`:
```bash
node experiments/llm-mitosis/prepare-context.cjs
```

### 2. Compile Mitosis Components
Compiles all `source/*.lite.tsx` components into React, Vue 3, Vue 2, and Svelte:
```bash
node experiments/llm-mitosis/compile.cjs
```

### 3. Build & Preview
Launches a local preview server with links to toggle between all 4 framework targets:
```bash
# Start preview server (default: http://127.0.0.1:4179)
node experiments/llm-mitosis/preview.cjs

# Or build static preview bundles only
node experiments/llm-mitosis/preview.cjs --build
```

### 4. Run Multi-Framework Automated Tests
Executes headless Chromium tests using Playwright across all 4 framework builds, verifies behavioral parity, and records visual screenshots:
```bash
node experiments/llm-mitosis/test.cjs
```

---

## Component Showcase & Interaction Coverage

The test suite in `test.cjs` exercises all components across React, Vue 3, Vue 2, and Svelte:

| Component | Tested Interactions & States |
| :--- | :--- |
| **Button** | Click callback counter increment; disabled toggle prevents interaction; style and size variants. |
| **Avatar** | Dynamic shape toggle (`round` ↔ `square`); size toggle (`medium` ↔ `small`); automatic initials generation; image source fallback. |
| **Alert** | Action button callback; dismiss toggle (removes from DOM); reset button restores alert; color variants (`primary`, `secondary`, `positive`). |
| **Checkbox** | Native `<input type="checkbox">`; label click toggling; keyboard <kbd>Space</kbd> activation; controlled event callback; disabled locked state prevention. |
| **TextField** | Controlled typing & clear; character counter limit (`maxlength="40"`); helper text & error message ARIA association (`aria-describedby`, `aria-invalid`). |
| **Table** | Dynamic row counts (0, 1, 3, 12 rows); row selection state callbacks; stable row id preservation across sorting/reversing; select-all header toggle; empty state action callback. |
| **Chart** | Dynamic SVG geometry calculation for bar and line variants; finite coordinates across normal, updated, single-value, zero, and negative datasets; companion accessible `<table>`; fallback states for empty data and unsupported variants. |
| **Layout** | Mobile viewport (390px) responsiveness and horizontal overflow prevention (`scrollWidth <= innerWidth`). |

---

## Architecture Documentation

For in-depth explanations of LLM authoring from Figma payloads, Tailwind utility class mappings, headless component logic, and cross-framework compilation nuances, consult [AUTHORING.md](./AUTHORING.md).
