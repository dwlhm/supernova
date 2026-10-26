# TableCellValue

Description
A flexible set of content patterns for table cells, including text, media, selection controls, status, links, badges, actions, products, and custom slot content.

## When to Use

- Use within Table Body Cell to represent the semantic type of data or control required by a column.

## Usage Guidelines

- Select the Type variant based on meaning, not visual preference.
- Keep repeated cells in a column consistent.
- Use interactive variants only when the table supports that action.
- Keep labels brief and provide accessible names for icon-only actions.
- Use Slot only when none of the standard variants fit.

## Interactive Preview

<ComponentPreview name="TableCellValue" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `TableCellValueType` | `'Text'` | - |
| `value` | `string` | `'Cell Value'` | - |
| `secondaryValue` | `string` | `''` | - |
| `badgeLabel` | `string` | `''` | - |
| `statusLabel` | `string` | `''` | - |
| `status` | `TableCellValueStatus` | `'success'` | - |
| `imageSrc` | `string` | `''` | - |
| `imageAlt` | `string` | `''` | - |
| `avatarInitials` | `string` | `''` | - |
| `href` | `string` | `''` | - |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `showAffiliate` | `boolean` | `true` | - |
| `showKomlabs` | `boolean` | `true` | - |
| `showRajaOngkir` | `boolean` | `true` | - |
| `showKomads` | `boolean` | `true` | - |
| `showKomcards` | `boolean` | `true` | - |
| `showKomchat` | `boolean` | `true` | - |
| `showKomclass` | `boolean` | `true` | - |
| `showKompack` | `boolean` | `true` | - |
| `showKomplace` | `boolean` | `true` | - |
| `showKomship` | `boolean` | `true` | - |
| `showKomtim` | `boolean` | `true` | - |
| `showKomed` | `boolean` | `true` | - |
| `showKomstore` | `boolean` | `true` | - |
| `showKomerce` | `boolean` | `true` | - |
| `showEdit` | `boolean` | `true` | - |
| `showDelete` | `boolean` | `true` | - |
| `showMore` | `boolean` | `true` | - |
| `onAction` | `() => void` | `-` | - |
| `onEdit` | `() => void` | `-` | - |
| `onDelete` | `() => void` | `-` | - |
| `onMore` | `() => void` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { TableCellValue } from '@supernova/design-system/react';

export default function App() {
  return <TableCellValue type="Text" value="Cell Value" status="success" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableCellValue } from '@supernova/design-system/vue3';
</script>

<template>
  <TableCellValue type="Text" value="Cell Value" status="success" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableCellValue } from '@supernova/design-system/svelte';
</script>

<TableCellValue type="Text" value="Cell Value" status="success" />
```

:::
