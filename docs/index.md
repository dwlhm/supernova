---
layout: home

hero:
  name: "Supernova"
  text: "Design System"
  tagline: Multi-framework UI components and tokens compiled from Supernova and Mitosis
  actions:
    - theme: brand
      text: Components Catalog
      link: /components/
    - theme: alt
      text: Design Tokens
      link: /tokens

features:
  - title: Multi-Framework Compilation
    details: Write once in Mitosis, compile natively to React, Svelte, Vue 3, and Vue 2 with zero runtime overhead.
  - title: Automated Pipeline
    details: Webhook-driven export from Supernova cloud directly into monorepo packages and documentation.
  - title: First-Class TypeScript
    details: Fully typed props, Tailwind CSS v4 design tokens, and interactive sandbox components.
---

## Packages Overview

The Supernova UI ecosystem consists of five synchronized packages:

| Package | Version | Ecosystem | Install Command |
| :--- | :--- | :--- | :--- |
| **`@dwlhm/design-tokens`** | `1.0.0` | CSS Variables, Tailwind v4, TS Tokens | `npm install @dwlhm/design-tokens` |
| **`@dwlhm/ui-react`** | `1.0.0` | React 18 / 19 Native Components | `npm install @dwlhm/ui-react` |
| **`@dwlhm/ui-svelte`** | `1.0.0` | Svelte 4 / 5 Native Components | `npm install @dwlhm/ui-svelte` |
| **`@dwlhm/ui-vue`** | `1.0.0` | Vue 3 Native Components (Composition API) | `npm install @dwlhm/ui-vue` |
| **`@dwlhm/ui-vue2`** | `1.0.0` | Vue 2 Native Components (Webpack 4 Compatible) | `npm install @dwlhm/ui-vue2` |

---

## Quick Start

### 1. React Setup

Install the React component package and tokens:

```bash
npm install @dwlhm/ui-react @dwlhm/design-tokens
```

Import the design token stylesheets into your root application:

```css
/* main.css or index.css */
@import "@dwlhm/design-tokens/css/tokens.css";
@import "@dwlhm/design-tokens/css/theme.css";
```

Render components anywhere in your React application:

```tsx
import { Button, Card, Badge } from '@dwlhm/ui-react'

export default function App() {
  return (
    <Card title="Supernova UI" subtitle="React Application" bordered shadow="md">
      <Badge variant="success">Production Ready</Badge>
      <div style={{ marginTop: '16px' }}>
        <Button variant="primary" size="md">
          Explore System
        </Button>
      </div>
    </Card>
  )
}
```

---

### 2. Svelte Setup

Install the Svelte component package and tokens:

```bash
npm install @dwlhm/ui-svelte @dwlhm/design-tokens
```

Import tokens in your root layout:

```svelte
<script>
  import '@dwlhm/design-tokens/css/tokens.css'
  import '@dwlhm/design-tokens/css/theme.css'
  import Button from '@dwlhm/ui-svelte/Button.svelte'
  import Card from '@dwlhm/ui-svelte/Card.svelte'
  import Badge from '@dwlhm/ui-svelte/Badge.svelte'
</script>

<Card title="Supernova UI" subtitle="Svelte Application" bordered={true} shadow="md">
  <Badge variant="success">Production Ready</Badge>
  <div style="margin-top: 16px;">
    <Button variant="primary" size="md">
      Explore System
    </Button>
  </div>
</Card>
```

---

### 3. Vue 3 Setup

Install the Vue 3 component package and tokens:

```bash
npm install @dwlhm/ui-vue @dwlhm/design-tokens
```

Import tokens in your root application and use components:

```vue
<template>
  <Card title="Supernova UI" subtitle="Vue 3 Application" :bordered="true" shadow="md">
    <Badge variant="success">Production Ready</Badge>
    <div style="margin-top: 16px;">
      <Button variant="primary" size="md">
        Explore System
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import '@dwlhm/design-tokens/css/tokens.css'
import '@dwlhm/design-tokens/css/theme.css'
import { Button, Card, Badge } from '@dwlhm/ui-vue'
</script>
```

---

### 4. Vue 2 (Webpack 4 Compatible) Setup

Install the Vue 2 component package and tokens:

```bash
npm install @dwlhm/ui-vue2 @dwlhm/design-tokens
```

Import pre-bundled components directly (no special webpack loaders needed):

```vue
<template>
  <Card title="Supernova UI" subtitle="Vue 2 Application" :bordered="true" shadow="md">
    <Badge variant="success">Production Ready</Badge>
    <div style="margin-top: 16px;">
      <Button variant="primary" size="md">
        Explore System
      </Button>
    </div>
  </Card>
</template>

<script>
import '@dwlhm/design-tokens/css/tokens.css'
import '@dwlhm/design-tokens/css/theme.css'
import { Button, Card, Badge } from '@dwlhm/ui-vue2'

export default {
  components: {
    Button,
    Card,
    Badge,
  },
}
</script>
```

---

### 3. Tokens Only (Framework Agnostic)

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
