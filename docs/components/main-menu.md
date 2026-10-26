# MainMenu

A primary navigation item used for top-level destinations in the sidebar. It supports interaction and selection states, optional leading and trailing icons, and an optional status badge.

## When to Use

- Use for primary sections or destinations in the application's main navigation.
- Use Active for the current destination and interaction states only while the related interaction occurs.

## Usage Guidelines

- Keep labels short, specific, and action-oriented where appropriate.
- Use only one active item within the same navigation level.
- Use badges sparingly for meaningful status or newly introduced content.
- Show a trailing icon only when it communicates disclosure, navigation, or a relevant action.
- Do not use hover as the only indication that an item is interactive.

## Interactive Preview

<ComponentPreview name="MainMenu" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Menu'` | - |
| `showLabel` | `boolean` | `true` | - |
| `showLeadingIcon` | `boolean` | `true` | - |
| `showTrailingIcon` | `boolean` | `true` | - |
| `showBadge` | `boolean` | `false` | - |
| `badgeLabel` | `string` | `'New'` | - |
| `active` | `boolean` | `false` | - |
| `href` | `string` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onClick` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { MainMenu } from '@supernova/design-system/react';

export default function App() {
  return <MainMenu label="Menu" showLabel showLeadingIcon />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { MainMenu } from '@supernova/design-system/vue3';
</script>

<template>
  <MainMenu label="Menu" showLabel showLeadingIcon />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { MainMenu } from '@supernova/design-system/svelte';
</script>

<MainMenu label="Menu" showLabel showLeadingIcon />
```

:::
