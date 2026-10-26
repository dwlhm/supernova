# TableCheckboxBodyCell

Description
A compact body cell containing a row-selection checkbox.

## When to Use

- Use when users can select individual rows for bulk actions or comparison.

## Usage Guidelines

- Place it consistently at the leading edge of each selectable row.
- Keep selection state synchronized with the header checkbox.
- Do not use it for an editable boolean data field.

## Interactive Preview

<ComponentPreview name="TableCheckboxBodyCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `false` | - |
| `indeterminate` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `leftLabel` | `string` | `-` | - |
| `label` | `string` | `-` | - |
| `ariaLabel` | `string` | `-` | - |
| `rowId` | `string` | `-` | - |
| `name` | `string` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |
| `onChange` | `(checked: boolean) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { TableCheckboxBodyCell } from '@supernova/design-system/react';

export default function App() {
  return <TableCheckboxBodyCell checked={false} indeterminate={false} disabled={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableCheckboxBodyCell } from '@supernova/design-system/vue3';
</script>

<template>
  <TableCheckboxBodyCell :checked="false" :indeterminate="false" :disabled="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TableCheckboxBodyCell } from '@supernova/design-system/svelte';
</script>

<TableCheckboxBodyCell checked={false} indeterminate={false} disabled={false} />
```

:::
