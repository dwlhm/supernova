# Topbar

A horizontal application header that provides a consistent area for page-level or global controls through a flexible content slot.

## When to Use

- Use at the top of authenticated application screens that require persistent global or contextual actions.
- Use to host content such as page context, search, notifications, help, or account actions when those controls need consistent placement.

## Usage Guidelines

- Place content in Topbar Content and prioritize the most important actions.
- Keep the bar concise; move infrequent actions into menus when space is limited.
- Maintain predictable control order across screens.
- Avoid duplicating navigation or actions already provided by the sidebar or page header.

## Interactive Preview

<ComponentPreview name="Topbar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `breadcrumbItems` | `TopbarBreadcrumbItem[]` | `-` | - |
| `breadcrumbSeparator` | `string` | `'/'` | - |
| `breadcrumbLabel` | `string` | `'Breadcrumb'` | - |
| `showSidebarToggle` | `boolean` | `false` | - |
| `sidebarToggleLabel` | `string` | `'Toggle sidebar'` | - |
| `sidebarToggleExpanded` | `boolean` | `false` | - |
| `onSidebarToggle` | `() => void` | `-` | - |
| `sticky` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Topbar } from '@supernova/design-system/react';

export default function App() {
  return <Topbar breadcrumbSeparator="/" breadcrumbLabel="Breadcrumb" showSidebarToggle={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Topbar } from '@supernova/design-system/vue3';
</script>

<template>
  <Topbar breadcrumbSeparator="/" breadcrumbLabel="Breadcrumb" :showSidebarToggle="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Topbar } from '@supernova/design-system/svelte';
</script>

<Topbar breadcrumbSeparator="/" breadcrumbLabel="Breadcrumb" showSidebarToggle={false} />
```

:::
