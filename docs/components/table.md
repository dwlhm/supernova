# Table

Description
A configurable data-table component with populated and empty states, up to ten columns and ten rows, optional row selection, and optional row numbering.

## When to Use

- Use to present structured records that users need to scan and compare across consistent columns. Use the Empty state when no records are available.

## Usage Guidelines

- Use clear column labels and keep cell content consistent by column.
- Show only the columns required for the task.
- Enable checkboxes only when bulk selection or row selection is supported.
- Enable row numbers only when sequential references are useful.
- Use the Empty state for true no-data outcomes and provide a relevant next action when possible.
- For complex sorting, filtering, pagination, or responsive behavior, pair this component with the appropriate surrounding controls and patterns.

## Interactive Preview

<ComponentPreview name="Table" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `columns` | `TableColumn[]` | `[]` | - |
| `rows` | `TableRow[]` | `[]` | - |
| `caption` | `string` | `'Data table'` | - |
| `noLabel` | `string` | `'No'` | - |
| `selectAllLabel` | `string` | `'Select all rows'` | - |
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
| `showRow1` | `boolean` | `true` | - |
| `showRow2` | `boolean` | `true` | - |
| `showRow3` | `boolean` | `true` | - |
| `showRow4` | `boolean` | `true` | - |
| `showRow5` | `boolean` | `true` | - |
| `showRow6` | `boolean` | `false` | - |
| `showRow7` | `boolean` | `true` | - |
| `showRow8` | `boolean` | `true` | - |
| `showRow9` | `boolean` | `true` | - |
| `showRow10` | `boolean` | `true` | - |
| `showCheckbox` | `boolean` | `false` | - |
| `showNo` | `boolean` | `false` | - |
| `title` | `string` | `'No Data Available'` | - |
| `body` | `string` | `"There's nothing here yet. Try adding some data or adjusting your filters."` | - |
| `cTALabel` | `string` | `'Add Data'` | - |
| `showIcon` | `boolean` | `true` | - |
| `showTitle` | `boolean` | `true` | - |
| `showDescription` | `boolean` | `true` | - |
| `showCTA` | `boolean` | `true` | - |
| `icon` | `string` | `'inbox'` | - |
| `state` | `'Default' \| 'Empty'` | `'Default'` | Default, Empty |
| `className` | `string` | `''` | - |
| `onSelectionChange` | `(selectedIds: string[]) => void` | `-` | - |
| `onCtaClick` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Table } from '@supernova/design-system/react';

export default function App() {
  return <Table caption="Data table" noLabel="No" selectAllLabel="Select all rows" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Table } from '@supernova/design-system/vue3';
</script>

<template>
  <Table caption="Data table" noLabel="No" selectAllLabel="Select all rows" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Table } from '@supernova/design-system/svelte';
</script>

<Table caption="Data table" noLabel="No" selectAllLabel="Select all rows" />
```

:::
