# Progressbar

A horizontal progress bar that communicates how much of an ongoing process has been completed.

## When to Use

- Use for tasks with measurable progress, such as uploads, downloads, installations, onboarding, or multi-step processing.
- Use when progress can be represented as a percentage or a known fraction of completion.
- Do not use for activity with an unknown duration; use an indeterminate loading indicator instead.

## Usage Guidelines

- Keep the track width consistent within the same flow.
- Update progress from left to right and avoid moving backward unless the underlying process genuinely regresses.
- Pair the bar with a percentage or short status label when users need precise progress information.
- Do not use color alone to communicate status; provide supporting text when status is important.
- Show completion clearly at 100%, then transition to the completed state or next step.

## Interactive Preview

<ComponentPreview name="Progressbar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | - |
| `min` | `number` | `0` | - |
| `max` | `number` | `100` | - |
| `label` | `string` | `''` | - |
| `showValue` | `boolean` | `false` | - |
| `tone` | `'primary' \| 'success' \| 'warning' \| 'info' \| 'danger'` | `'primary'` | primary, success, warning, info, danger |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `ariaLabel` | `string` | `''` | - |
| `description` | `string` | `''` | - |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { Progressbar } from '@supernova/design-system/react';

export default function App() {
  return <Progressbar value={0} min={0} max={100} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Progressbar } from '@supernova/design-system/vue3';
</script>

<template>
  <Progressbar :value="0" :min="0" :max="100" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Progressbar } from '@supernova/design-system/svelte';
</script>

<Progressbar value={0} min={0} max={100} />
```

:::
