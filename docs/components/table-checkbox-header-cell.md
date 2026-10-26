# TableCheckboxHeaderCell

Description
A compact header cell containing the table's selection checkbox.

## When to Use

- Use when the table supports selecting all visible or eligible rows.

## Usage Guidelines

- Pair with Table Checkbox Body Cell in selectable rows.
- Use an indeterminate state when only some eligible rows are selected.
- Disable or omit it when bulk selection is unavailable.

## Interactive Preview

<ComponentPreview name="TableCheckboxHeaderCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `false` | - |
| `indeterminate` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `'Select all rows'` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { TableCheckboxHeaderCell } from '@supernova/design-system/react';

export default function App() {
  return <TableCheckboxHeaderCell checked={false} indeterminate={false} disabled={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableCheckboxHeaderCell } from '@supernova/design-system/vue3';
</script>

<template>
  <TableCheckboxHeaderCell :checked="false" :indeterminate="false" :disabled="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableCheckboxHeaderCell } from '@supernova/design-system/svelte';
</script>

<TableCheckboxHeaderCell checked={false} indeterminate={false} disabled={false} />
```

:::
