# Badge

A compact label used to communicate status, category, or supporting metadata without interrupting the main content.

## When to Use

- Show a concise status, classification, or attribute.
- Help users scan and compare items quickly.
- Use alongside primary content, not as a replacement for buttons or alerts.

## Usage Guidelines

- Keep labels short, clear, and sentence case.
- Choose the variant by meaning, not decoration.
- Use one semantic meaning consistently across the product.
- Avoid placing several high-emphasis badges next to each other.
- Do not use a Badge for interactive actions.

## Interactive Preview

<ComponentPreview name="Badge" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Badge'` | - |
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'success' \| 'warning' \| 'info' \| 'outline'` | `'primary'` | primary, secondary, destructive, success, warning, info, outline |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Badge } from '@supernova/design-system/react';

export default function App() {
  return <Badge label="Badge" variant="primary" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Badge } from '@supernova/design-system/vue3';
</script>

<template>
  <Badge label="Badge" variant="primary" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Badge } from '@supernova/design-system/svelte';
</script>

<Badge label="Badge" variant="primary" />
```

:::
