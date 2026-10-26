# TableNoHeaderCell

Description
A compact header cell for the row-number column.

## When to Use

- Use above Table No Body Cell when the table displays numbered rows.

## Usage Guidelines

- Keep the column narrow and aligned with row numbers.
- Use consistently with the table's Show No option.

## Interactive Preview

<ComponentPreview name="TableNoHeaderCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `children` | `any` | `-` | - |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { TableNoHeaderCell } from '@supernova/design-system/react';

export default function App() {
  return <TableNoHeaderCell />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableNoHeaderCell } from '@supernova/design-system/vue3';
</script>

<template>
  <TableNoHeaderCell />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableNoHeaderCell } from '@supernova/design-system/svelte';
</script>

<TableNoHeaderCell />
```

:::
