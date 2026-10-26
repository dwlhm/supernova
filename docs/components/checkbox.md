# Checkbox

A checkbox lets users select or clear one or more independent options. It supports selected and unselected states, three sizes, disabled states, and optional labels on either side.

## When to Use

- Use for optional, independent choices where more than one option may be selected.
- Use for confirmations, consent, preferences, and multi-select lists.
- Use when the result is applied after a user action such as Save or Submit.
- Do not use for mutually exclusive choices; use radio buttons instead.
- Do not use for an action that takes effect immediately; use a switch instead.

## Usage Guidelines

- Pair the checkbox with a short, clear label that describes the choice.
- Prefer a right-side label for left-to-right interfaces; use a left-side label only when the layout requires it.
- Use only one label position at a time.
- Keep related checkboxes vertically aligned and group them under a clear heading when needed.
- Avoid preselecting an option unless it is safe, expected, and easy to reverse.
- Use the disabled state only when the option is unavailable, and explain why when the reason is not obvious.

## Interactive Preview

<ComponentPreview name="Checkbox" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `false` | - |
| `label` | `string` | `''` | - |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Small'` | Small, Medium, Large |
| `disabled` | `boolean` | `false` | - |
| `id` | `string` | `''` | - |
| `name` | `string` | `''` | - |
| `value` | `string` | `''` | - |
| `ariaLabel` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `onChange` | `(checked: boolean) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Checkbox } from '@supernova/design-system/react';

export default function App() {
  return <Checkbox checked={false} leftLabel={false} rightLabel={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Checkbox } from '@supernova/design-system/vue3';
</script>

<template>
  <Checkbox :checked="false" :leftLabel="false" :rightLabel="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Checkbox } from '@supernova/design-system/svelte';
</script>

<Checkbox checked={false} leftLabel={false} rightLabel={false} />
```

:::
