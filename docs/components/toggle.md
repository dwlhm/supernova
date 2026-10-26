# Toggle

Toggle lets users switch a single setting between off and on, with the change taking effect immediately.

## When to Use

- Use for binary preferences or settings with an immediate result.
- Use when users can clearly understand the effect of turning the option on or off.
- Do not use for multiple-choice decisions, required acknowledgements, or actions that need confirmation.

## Usage Guidelines

- Pair the toggle with a clear, concise label that describes the enabled state.
- Keep the current state visually clear and avoid relying on color alone.
- Use one size consistently within the same interface area.
- Use supporting text when the outcome may not be obvious.
- Keep disabled controls visible only when their context is useful, and explain why they are unavailable when needed.

## Interactive Preview

<ComponentPreview name="Toggle" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `state` | `'Default' \| 'Active' \| 'Disabled'` | `'Default'` | Default, Active, Disabled |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Small'` | Small, Medium, Large |
| `showText` | `boolean` | `false` | - |
| `label` | `string` | `-` | - |
| `pressed` | `boolean` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |
| `onPressedChange` | `(pressed: boolean) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { Toggle } from '@supernova/design-system/react';

export default function App() {
  return <Toggle state="Default" size="Small" showText={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Toggle } from '@supernova/design-system/vue3';
</script>

<template>
  <Toggle state="Default" size="Small" :showText="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Toggle } from '@supernova/design-system/svelte';
</script>

<Toggle state="Default" size="Small" showText={false} />
```

:::
