# Components Catalog

The Supernova UI component catalog provides cross-framework components authored in Mitosis and compiled natively for React and Svelte.

---

## Available Components

| Component | Description | Frameworks | Documentation |
| :--- | :--- | :--- | :--- |
| **`<Badge>`** | Compact status badge indicator used for categorization, counters, and highlights. | React, Svelte | [View Badge Docs](/components/badge) |
| **`<Button>`** | Interactive button component with support for multiple visual variants, sizes, full-width layouts, and disabled states. | React, Svelte | [View Button Docs](/components/button) |
| **`<Card>`** | Container element for organizing related content with optional title, subtitle, elevation shadow, and borders. | React, Svelte | [View Card Docs](/components/card) |
| **`<Input>`** | Form input component supporting text values, validation error states, helper text, labels, and required flags. | React, Svelte | [View Input Docs](/components/input) |
| **`<StatusBadge>`** | StatusBadge component generated from Supernova. | React, Svelte | [View StatusBadge Docs](/components/statusbadge) |
| **`<Typography>`** | Standardized typography component for headings, body copy, and caption text with consistent font scale and weight. | React, Svelte | [View Typography Docs](/components/typography) |

---

## Feature Comparison

All components share identical API surfaces across frameworks:

- **Type Safe**: Strict TypeScript definitions for props and events.
- **Zero Style Desync**: Single source of truth styles powered by Tailwind CSS v4 and Supernova tokens.
- **Native Output**: React uses JSX; Svelte uses idiomatic `.svelte` templates.
