# InputDropdown

A selection input that lets users choose one option from a predefined list while keeping the form compact.

## When to Use

- Use when available values are known in advance.
- Use when displaying all choices at once would take too much space.
- Use radio buttons for a small set of choices that should remain visible.

## Usage Guidelines

- Use a clear label and a meaningful placeholder such as “Choose department.”
- Order options logically and keep labels concise.
- Enable search for long or difficult-to-scan lists.
- Show the selected option in the Filled state.
- Provide specific error guidance and never rely on color alone.

## Interactive Preview

<ComponentPreview name="InputDropdown" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'input-dropdown'` | - |
| `labelText` | `string` | `'Department'` | - |
| `placeholderText` | `string` | `'Choose department'` | - |
| `hintErrorText` | `string` | `'Select your department or area of work.'` | - |
| `options` | `InputDropdownOption[]` | `[]` | - |
| `value` | `string` | `''` | - |
| `variation` | `'Default' \| 'Focus' \| 'Filled' \| 'Error' \| 'Disabled'` | `'Default'` | Default, Focus, Filled, Error, Disabled |
| `showLabel` | `boolean` | `true` | - |
| `showRequired` | `boolean` | `false` | - |
| `showHint` | `boolean` | `false` | - |
| `showCharacterCount` | `boolean` | `true` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `true` | - |
| `showSearchInput` | `boolean` | `true` | - |
| `searchPlaceholder` | `string` | `'Search options'` | - |
| `maxSearchLength` | `number` | `50` | - |
| `emptyMessage` | `string` | `'No options found'` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { InputDropdown } from '@supernova/design-system/react';

export default function App() {
  return <InputDropdown id="input-dropdown" labelText="Department" placeholderText="Choose department" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputDropdown } from '@supernova/design-system/vue3';
</script>

<template>
  <InputDropdown id="input-dropdown" labelText="Department" placeholderText="Choose department" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputDropdown } from '@supernova/design-system/svelte';
</script>

<InputDropdown id="input-dropdown" labelText="Department" placeholderText="Choose department" />
```

:::
