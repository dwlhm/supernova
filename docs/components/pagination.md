# Pagination

Description
Pagination lets users navigate through content or data that is divided across multiple pages. This component includes Previous and Next controls, individual page numbers, and an ellipsis for skipped page ranges.

Variant
Default — Use the standard pagination layout when users need sequential navigation and direct access to nearby pages.

## When to Use

- Use for long lists, tables, search results, or collections that are split into pages.
- Use when users need to understand their current position and move to a specific page.
- Avoid pagination when all content can be displayed clearly on one page or when continuous loading is more appropriate.

## Usage Guidelines

- Place pagination directly below the content it controls.
- Clearly distinguish the current page from available pages.
- Disable Previous on the first page and Next on the last page.
- Use an ellipsis to compress long page ranges while keeping the first, last, current, and nearby pages accessible.
- Preserve sorting, filters, and item order when users move between pages.
- Provide accessible labels for navigation controls and indicate the current page to assistive technologies.

## Interactive Preview

<ComponentPreview name="Pagination" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `currentPage` | `number` | `1` | - |
| `totalPages` | `number` | `1` | - |
| `previousLabel` | `string` | `'Previous'` | - |
| `nextLabel` | `string` | `'Next'` | - |
| `ariaLabel` | `string` | `'Pagination'` | - |
| `className` | `string` | `''` | - |
| `onPageChange` | `(page: number) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Pagination } from '@supernova/design-system/react';

export default function App() {
  return <Pagination currentPage={1} totalPages={1} previousLabel="Previous" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Pagination } from '@supernova/design-system/vue3';
</script>

<template>
  <Pagination :currentPage="1" :totalPages="1" previousLabel="Previous" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Pagination } from '@supernova/design-system/svelte';
</script>

<Pagination currentPage={1} totalPages={1} previousLabel="Previous" />
```

:::
