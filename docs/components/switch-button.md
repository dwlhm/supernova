# SwitchButton

Description
A switch lets users turn one setting on or off. It communicates a binary state and should apply the change immediately.

## When to Use

- Use for settings or preferences with two mutually exclusive states.
- Use when turning a feature on or off takes effect immediately.
- Use in forms, lists, and settings panels for independent binary controls.
- Do not use for mutually exclusive choices in a group; use radio buttons instead.
- Do not use when the change requires a separate Submit or Confirm action; use a checkbox instead.

## Usage Guidelines

- Pair the switch with a clear label that describes the setting, not the action.
- Keep labels positive and consistent so the on state is easy to understand.
- Use Medium by default, Small in dense layouts, and Large for prominent or touch-focused contexts.
- Preserve clear hover, focus, pressed, and state feedback in implementation.
- Use the disabled state only when the setting is temporarily unavailable.
- Explain why a switch is disabled when the reason is not obvious.

## Interactive Preview

<ComponentPreview name="SwitchButton" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Small, Medium, Large |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `leftLabelText` | `string` | `'Off'` | - |
| `rightLabelText` | `string` | `'On'` | - |
| `ariaLabel` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `name` | `string` | `-` | - |
| `className` | `string` | `''` | - |
| `onChange` | `(checked: boolean) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { SwitchButton } from '@supernova/design-system/react';

export default function App() {
  return <SwitchButton disabled={false} size="Medium" leftLabel={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { SwitchButton } from '@supernova/design-system/vue3';
</script>

<template>
  <SwitchButton :disabled="false" size="Medium" :leftLabel="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { SwitchButton } from '@supernova/design-system/svelte';
</script>

<SwitchButton disabled={false} size="Medium" leftLabel={false} />
```

:::
