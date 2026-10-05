---
layout: home

hero:
  name: "Supernova"
  text: "Design System"
  tagline: Design tokens compiled from Supernova.
  actions:
    - theme: brand
      text: Design Tokens
      link: /tokens

features:
  - title: Automated Pipeline
    details: Webhook-driven export from Supernova cloud directly into monorepo packages and documentation.
  - title: Design Tokens
    details: Every Supernova token exported as CSS variables and typed TypeScript.
---

## Packages Overview

The Supernova design system is published as a single design-tokens package:

| Package | Version | Ecosystem | Install Command |
| :--- | :--- | :--- | :--- |
| **`@dwlhm/design-tokens`** | `1.0.0` | CSS Variables, Tailwind v4, TS Tokens | `npm install @dwlhm/design-tokens` |

---

## Quick Start

### 1. Tokens Only (Framework Agnostic)

Use design tokens directly in any web project:

```bash
npm install @dwlhm/design-tokens
```

In TypeScript / JavaScript:

```ts
import { tokens } from '@dwlhm/design-tokens'

console.log(tokens.colors.colorBackgroundPrimary)
console.log(tokens.typography.heading1.fontSize)
```

In CSS:

```css
.custom-card {
  background-color: var(--color-background-page);
  box-shadow: var(--shadow-raised);
}
```
