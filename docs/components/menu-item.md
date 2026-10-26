# MenuItem

A secondary or expandable navigation item used within a menu hierarchy. It supports optional icons and badges, plus a submenu content slot for nested destinations.

## When to Use

- Use for secondary destinations or parent items that reveal nested navigation.
- Use Active when the item is selected or its submenu is expanded.

## Usage Guidelines

- Keep labels concise and clearly related to their parent section.
- Use the trailing icon to communicate expansion when submenu content is available.
- Keep nesting shallow and preserve a clear visual relationship between parent and submenu items.
- Use badges only for meaningful, concise status information.

## Interactive Preview

<ComponentPreview name="MenuItem" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Menu'` | - |
| `active` | `boolean` | `false` | - |
| `expanded` | `boolean` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showLeadingIcon` | `boolean` | `true` | - |
| `showTrailingIcon` | `boolean` | `true` | - |
| `showBadge` | `boolean` | `false` | - |
| `badgeLabel` | `string` | `'New'` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { MenuItem } from '@supernova/design-system/react';

export default function App() {
  return <MenuItem label="Menu" active={false} disabled={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { MenuItem } from '@supernova/design-system/vue3';
</script>

<template>
  <MenuItem label="Menu" :active="false" :disabled="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { MenuItem } from '@supernova/design-system/svelte';
</script>

<MenuItem label="Menu" active={false} disabled={false} />
```

:::
