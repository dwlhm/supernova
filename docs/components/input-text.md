# InputText

A single-line input for collecting short-form information such as names, titles, email addresses, search terms, or other concise values.

## When to Use

- Use when the expected value fits on one line.
- Use for short, structured, or predictable information.
- Use a text area when users may need to enter multiple lines.

## Usage Guidelines

- Use a persistent, descriptive label.
- Match the input type and keyboard to the expected value in implementation.
- Use placeholder text as an example only.
- Provide actionable validation feedback and preserve the entered value.
- Use leading or trailing icons only when they clarify meaning or provide a relevant action.

## Interactive Preview

<ComponentPreview name="InputText" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'input-text'` | - |
| `name` | `string` | `'input-text'` | - |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'number'` | `'text'` | text, email, password, search, tel, url, number |
| `value` | `string` | `''` | - |
| `autoComplete` | `string` | `'off'` | - |
| `labelText` | `string` | `'Username'` | - |
| `placeholderText` | `string` | `'Max Leiter'` | - |
| `hintErrorText` | `string` | `'Choose a unique username for your account.'` | - |
| `characterCount` | `string` | `''` | - |
| `maxLength` | `number` | `200` | - |
| `showLabel` | `boolean` | `true` | - |
| `showRequired` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `showCharacterCount` | `boolean` | `false` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `true` | - |
| `leftIcon` | `string` | `'search'` | - |
| `rightIcon` | `string` | `'check'` | - |
| `visualState` | `'Default' \| 'Focus' \| 'Filled' \| 'Error' \| 'Disabled'` | `'Default'` | Default, Focus, Filled, Error, Disabled |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { InputText } from '@supernova/design-system/react';

export default function App() {
  return <InputText id="input-text" name="input-text" type="text" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputText } from '@supernova/design-system/vue3';
</script>

<template>
  <InputText id="input-text" name="input-text" type="text" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputText } from '@supernova/design-system/svelte';
</script>

<InputText id="input-text" name="input-text" type="text" />
```

:::
