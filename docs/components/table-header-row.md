# TableHeaderRow

Description
A reusable table header row with up to ten configurable columns.

## When to Use

- Use at the top of a data table to label and align its columns. Omit it only when the surrounding context makes every column unambiguous.

## Usage Guidelines

- Match visible header columns to the visible columns in every body row.
- Use short, descriptive labels.
- Keep column order and widths consistent with the body rows.
- Avoid wrapping header labels when a shorter label is available.

## Interactive Preview

<ComponentPreview name="TableHeaderRow" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `showColumn1` | `boolean` | `true` | - |
| `showColumn2` | `boolean` | `true` | - |
| `showColumn3` | `boolean` | `true` | - |
| `showColumn4` | `boolean` | `true` | - |
| `showColumn5` | `boolean` | `true` | - |
| `showColumn6` | `boolean` | `false` | - |
| `showColumn7` | `boolean` | `false` | - |
| `showColumn8` | `boolean` | `false` | - |
| `showColumn9` | `boolean` | `false` | - |
| `showColumn10` | `boolean` | `false` | - |
| `columnLabels` | `string[]` | `-` | - |
| `columnAlignments` | `Array<'left' \| 'center' \| 'right'>` | `-` | Array<'left, center, right'> |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { TableHeaderRow } from '@supernova/design-system/react';

export default function App() {
  return <TableHeaderRow showColumn1 showColumn2 showColumn3 />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableHeaderRow } from '@supernova/design-system/vue3';
</script>

<template>
  <TableHeaderRow showColumn1 showColumn2 showColumn3 />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableHeaderRow } from '@supernova/design-system/svelte';
</script>

<TableHeaderRow showColumn1 showColumn2 showColumn3 />
```

:::
