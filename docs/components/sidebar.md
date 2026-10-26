# Sidebar

A persistent vertical navigation shell that organizes brand, primary navigation, and account-related content. It supports expanded and collapsed layouts so the navigation can adapt to the available workspace.

## When to Use

- Use as the primary navigation container for desktop application layouts.
- Use the collapsed variant when horizontal space is limited or users need more room for page content.

## Usage Guidelines

- Place product identity or a logo in Brand content.
- Place the primary menu structure in Navigation content.
- Place profile, workspace, or account controls in Account content.
- Keep navigation order and icon meaning consistent between expanded and collapsed states.
- Provide accessible labels or tooltips when labels are hidden.

## Interactive Preview

<ComponentPreview name="Sidebar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `expanded` | `boolean` | `true` | - |
| `brandLabel` | `string` | `'Komerce'` | - |
| `brandInitials` | `string` | `'K'` | - |
| `navigationLabel` | `string` | `'Main'` | - |
| `accountLabel` | `string` | `'Account'` | - |
| `accountMeta` | `string` | `''` | - |
| `accountInitials` | `string` | `'A'` | - |
| `showAccount` | `boolean` | `true` | - |
| `onAccountClick` | `() => void` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Sidebar } from '@supernova/design-system/react';

export default function App() {
  return <Sidebar expanded brandLabel="Komerce" brandInitials="K" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Sidebar } from '@supernova/design-system/vue3';
</script>

<template>
  <Sidebar expanded brandLabel="Komerce" brandInitials="K" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Sidebar } from '@supernova/design-system/svelte';
</script>

<Sidebar expanded brandLabel="Komerce" brandInitials="K" />
```

:::
