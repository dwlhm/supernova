# Toast

A brief, non-intrusive notification that communicates the status of an action or process without interrupting the user’s workflow.

## When to Use

- Confirm that an action completed successfully.
- Report an error or warn about a condition that may require attention.
- Provide short, time-sensitive system information.
- Use for feedback that does not require an immediate decision. For blocking or complex messages, use an alert or dialog instead.

## Usage Guidelines

- Keep the title concise and action-oriented; add a description only when extra context is necessary.
- Choose the Type that matches the message intent, not its visual prominence.
- Use one optional action for a clear, reversible, or follow-up task.
- Show the close button when users may need to dismiss a persistent toast.
- Show the timestamp only when message recency is useful.
- Avoid stacking many toasts, duplicating inline validation, or using toasts for critical information that must remain visible.

## Interactive Preview

<ComponentPreview name="Toast" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `toastText` | `string` | `'Toast Text'` | - |
| `descriptionText` | `string` | `'Toast description text here'` | - |
| `actionText` | `string` | `'Undo'` | - |
| `showDescription` | `boolean` | `false` | - |
| `showActionButton` | `boolean` | `false` | - |
| `showCloseButton` | `boolean` | `false` | - |
| `clock` | `boolean` | `true` | - |
| `timestampText` | `string` | `-` | - |
| `type` | `ToastType` | `'Default'` | - |
| `className` | `string` | `''` | - |
| `onAction` | `() => void` | `-` | - |
| `onClose` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Toast } from '@supernova/design-system/react';

export default function App() {
  return <Toast toastText="Toast Text" descriptionText="Toast description text here" actionText="Undo" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Toast } from '@supernova/design-system/vue3';
</script>

<template>
  <Toast toastText="Toast Text" descriptionText="Toast description text here" actionText="Undo" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Toast } from '@supernova/design-system/svelte';
</script>

<Toast toastText="Toast Text" descriptionText="Toast description text here" actionText="Undo" />
```

:::
