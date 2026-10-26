# Tooltip

Tooltip provides brief contextual information about a UI element without interrupting the user’s workflow.

## When to Use

- Explain unfamiliar icons, controls, or abbreviated labels.
- Add helpful context that is useful but not essential to completing a task.
- Reveal supporting information on hover, keyboard focus, or a short press.
- Do not use for critical instructions, validation errors, or content users must remember.

## Usage Guidelines

- Keep the message concise—prefer a short phrase or one sentence.
- Place the tooltip close to its trigger without covering important content.
- Choose the position with the most available space; avoid clipping at viewport edges.
- Keep terminology direct and consistent with the trigger label.
- Avoid interactive controls, links, or long-form content inside a tooltip.
- Ensure the same information is available to keyboard and touch users.

## Interactive Preview

<ComponentPreview name="Tooltip" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `textContent` | `string` | `'Label'` | - |
| `text` | `string` | `-` | - |
| `position` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Top'` | Top, Bottom, Left, Right |
| `id` | `string` | `'tooltip'` | - |
| `disabled` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Tooltip } from '@supernova/design-system/react';

export default function App() {
  return <Tooltip textContent="Label" position="Top" id="tooltip" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Tooltip } from '@supernova/design-system/vue3';
</script>

<template>
  <Tooltip textContent="Label" position="Top" id="tooltip" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Tooltip } from '@supernova/design-system/svelte';
</script>

<Tooltip textContent="Label" position="Top" id="tooltip" />
```

:::
