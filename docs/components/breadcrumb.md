# Breadcrumb

Description
A breadcrumb navigation component that communicates the user's current location within a hierarchical structure and provides a clear path back to higher levels.

## When to Use

- Use on pages that are nested within a clear hierarchy.
- Use when users may need to move quickly to a parent level.
- Use in content-heavy products, settings, catalogs, or multi-level navigation.
- Do not use as a replacement for primary navigation or for flat page structures.

## Usage Guidelines

- Keep labels concise, recognizable, and consistent with page titles.
- Arrange items from the highest level to the current page.
- Treat the final item as the current location; it should not navigate to itself.
- Use the shortest variant that accurately represents the hierarchy.
- For long paths, use the deep variant with an ellipsis to collapse intermediate levels.
- Keep separators visually consistent and ensure interactive items have clear hover and focus states.

## Interactive Preview

<ComponentPreview name="Breadcrumb" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `'1' \| '2' \| 'deep'` | `'2'` | 1, 2, deep |
| `showEllipsis` | `boolean` | `true` | - |
| `items` | `BreadcrumbItem[]` | `[]` | - |
| `separatorIcon` | `boolean` | `true` | - |
| `ariaLabel` | `string` | `'Breadcrumb'` | - |
| `className` | `string` | `''` | - |
| `onItemClick` | `(item: BreadcrumbItem, index: number) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Breadcrumb } from '@supernova/design-system/react';

export default function App() {
  return <Breadcrumb type="2" showEllipsis separatorIcon />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Breadcrumb } from '@supernova/design-system/vue3';
</script>

<template>
  <Breadcrumb type="2" showEllipsis separatorIcon />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Breadcrumb } from '@supernova/design-system/svelte';
</script>

<Breadcrumb type="2" showEllipsis separatorIcon />
```

:::
