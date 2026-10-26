# Tabs

A horizontal tab bar composed of Tab Item instances. It provides up to eight tabs for switching between related content views or categories.

## When to Use

- Use Tabs when users need to move between peer views within the same context without leaving the page. Do not use it for sequential steps or primary site navigation.

## Usage Guidelines

- Use two to eight tabs with concise, parallel labels.
- Keep one tab active and ensure its content is visible.
- Order tabs by importance, frequency, or a natural sequence.
- Hide unused tabs instead of leaving empty labels.
- Avoid overcrowding; use another navigation pattern if labels no longer fit clearly.

## Interactive Preview

<ComponentPreview name="Tabs" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `tabs` | `TabsItem[]` | `[]` | - |
| `activeId` | `string` | `''` | - |
| `defaultActiveId` | `string` | `''` | - |
| `onSelect` | `(id: string) => void` | `-` | - |
| `ariaLabel` | `string` | `'Tabs'` | - |
| `idBase` | `string` | `'tabs'` | - |
| `className` | `string` | `''` | - |
| `panelClassName` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Tabs } from '@supernova/design-system/react';

export default function App() {
  return <Tabs ariaLabel="Tabs" idBase="tabs" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Tabs } from '@supernova/design-system/vue3';
</script>

<template>
  <Tabs ariaLabel="Tabs" idBase="tabs" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Tabs } from '@supernova/design-system/svelte';
</script>

<Tabs ariaLabel="Tabs" idBase="tabs" />
```

:::
