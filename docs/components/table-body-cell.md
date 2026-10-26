# TableBodyCell

Description
A reusable body cell container for table rows. It hosts a selectable Table Cell Value component so each column can display the appropriate content type while preserving consistent spacing and alignment.

## When to Use

- Use inside Table Body Row when building data rows with text, badges, actions, status, product, or other supported cell content.

## Usage Guidelines

- Keep one content type per cell.
- Choose a cell-value variant that matches the data semantics.
- Keep content concise; use truncation or a wider column for long values.
- Maintain consistent alignment for cells in the same column.

## Interactive Preview

<ComponentPreview name="TableBodyCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `variant` | `TableBodyCellVariant` | `'text'` | - |
| `value` | `string` | `''` | - |
| `secondaryValue` | `string` | `''` | - |
| `badgeLabel` | `string` | `''` | - |
| `statusLabel` | `string` | `''` | - |
| `imageSrc` | `string` | `''` | - |
| `avatarInitials` | `string` | `''` | - |
| `href` | `string` | `''` | - |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { TableBodyCell } from '@supernova/design-system/react';

export default function App() {
  return <TableBodyCell variant="text" align="left" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableBodyCell } from '@supernova/design-system/vue3';
</script>

<template>
  <TableBodyCell variant="text" align="left" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableBodyCell } from '@supernova/design-system/svelte';
</script>

<TableBodyCell variant="text" align="left" />
```

:::
