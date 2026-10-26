# TableNoBodyCell

Description
A compact body cell that displays a row number.

## When to Use

- Use when rows need a visible sequential reference independent of the record's data.

## Usage Guidelines

- Keep numbering sequential after sorting, filtering, or pagination according to product requirements.
- Align values consistently in the number column.
- Use with Table No Header Cell.

## Interactive Preview

<ComponentPreview name="TableNoBodyCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `no` | `number \| string` | `1` | - |
| `srLabel` | `string` | `''` | - |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { TableNoBodyCell } from '@supernova/design-system/react';

export default function App() {
  return <TableNoBodyCell no={1} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableNoBodyCell } from '@supernova/design-system/vue3';
</script>

<template>
  <TableNoBodyCell :no="1" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableNoBodyCell } from '@supernova/design-system/svelte';
</script>

<TableNoBodyCell no={1} />
```

:::
