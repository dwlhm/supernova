# TableBodyRow

Description
A reusable table body row with up to ten configurable data columns.

## When to Use

- Use for each data record in the default table state.

## Usage Guidelines

- Keep the visible columns synchronized with Table Header Row.
- Use the same cell-value type and alignment throughout each column.
- Preserve a consistent row height across a table.
- Place row-level actions in the designated actions column.

## Interactive Preview

<ComponentPreview name="TableBodyRow" />

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
| `column1Value` | `string \| number` | `-` | - |
| `column2Value` | `string \| number` | `-` | - |
| `column3Value` | `string \| number` | `-` | - |
| `column4Value` | `string \| number` | `-` | - |
| `column5Value` | `string \| number` | `-` | - |
| `column6Value` | `string \| number` | `-` | - |
| `column7Value` | `string \| number` | `-` | - |
| `column8Value` | `string \| number` | `-` | - |
| `column9Value` | `string \| number` | `-` | - |
| `column10Value` | `string \| number` | `-` | - |
| `align` | `TableBodyRowAlign` | `'left'` | - |
| `showActions` | `boolean` | `false` | - |
| `muted` | `boolean` | `false` | - |
| `hoverable` | `boolean` | `true` | - |
| `selected` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { TableBodyRow } from '@supernova/design-system/react';

export default function App() {
  return <TableBodyRow showColumn1 showColumn2 showColumn3 />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableBodyRow } from '@supernova/design-system/vue3';
</script>

<template>
  <TableBodyRow showColumn1 showColumn2 showColumn3 />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableBodyRow } from '@supernova/design-system/svelte';
</script>

<TableBodyRow showColumn1 showColumn2 showColumn3 />
```

:::
