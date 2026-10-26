# RadioButton

Description
A radio button lets users select exactly one option from a set of mutually exclusive choices. Radio buttons should always appear in a group of two or more options with clear labels.

## When to Use

- Use when users must choose one option from a visible list.
- Use when seeing all available options at once supports comparison.
- Use for short, stable option sets.
- Use a checkbox when users may select multiple options.
- Use a select or dropdown when the list is long or space is limited.

## Usage Guidelines

- Group related radio buttons under a clear question or group label.
- Keep option labels concise, specific, and grammatically parallel.
- Arrange options vertically when possible for easier scanning.
- Use a sensible default only when it is safe and helpful.
- Treat the control and its label as one interaction target in implementation.
- Never use a single radio button for an independent on/off setting.
- Explain why an option is disabled when the reason is not obvious.

## Interactive Preview

<ComponentPreview name="RadioButton" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `''` | - |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `checked` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `size` | `RadioButtonSize` | `'Medium'` | - |
| `name` | `string` | `-` | - |
| `value` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `className` | `string` | `''` | - |
| `onChange` | `(value: string) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { RadioButton } from '@supernova/design-system/react';

export default function App() {
  return <RadioButton leftLabel={false} rightLabel={false} checked={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { RadioButton } from '@supernova/design-system/vue3';
</script>

<template>
  <RadioButton :leftLabel="false" :rightLabel="false" :checked="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { RadioButton } from '@supernova/design-system/svelte';
</script>

<RadioButton leftLabel={false} rightLabel={false} checked={false} />
```

:::
