# ToggleGroup

Description
A toggle group organizes several related switch controls into one scannable settings section. Each switch remains independent, while the shared layout and optional group label communicate their relationship.

## When to Use

- Use when two to five related settings should be presented together.
- Use when each option can be enabled or disabled independently.
- Use in settings pages, preference panels, filters, or configuration forms.
- Do not use when users must choose only one option; use a radio group or segmented control instead.

## Usage Guidelines

- Give the group a concise label when the relationship between options is not self-evident.
- Write each toggle label as a clear setting name with an unambiguous on state.
- Show only the number of toggle rows needed; hide unused rows.
- Keep the size consistent with surrounding controls and interface density.
- Order options logically, placing the most common or important settings first.
- Explain unavailable options near the affected toggle rather than at the group level.

## Interactive Preview

<ComponentPreview name="ToggleGroup" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Small, Medium, Large |
| `label` | `string` | `-` | - |
| `showLabel` | `boolean` | `true` | - |
| `showToggle1` | `boolean` | `true` | - |
| `showToggle2` | `boolean` | `true` | - |
| `showToggle3` | `boolean` | `true` | - |
| `showToggle4` | `boolean` | `true` | - |
| `showToggle5` | `boolean` | `true` | - |
| `toggles` | `ToggleGroupItem[]` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onToggleChange` | `(id: string, checked: boolean) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { ToggleGroup } from '@supernova/design-system/react';

export default function App() {
  return <ToggleGroup size="Medium" showLabel showToggle1 />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { ToggleGroup } from '@supernova/design-system/vue3';
</script>

<template>
  <ToggleGroup size="Medium" showLabel showToggle1 />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { ToggleGroup } from '@supernova/design-system/svelte';
</script>

<ToggleGroup size="Medium" showLabel showToggle1 />
```

:::
