# InputTextArea

A multi-line text input for collecting longer free-form content such as messages, comments, notes, feedback, or descriptions.

## When to Use

- Use when the expected response may span multiple lines.
- Use for open-ended input that benefits from a larger writing area.
- Use a single-line text input for short, predictable values.

## Usage Guidelines

- Keep the label visible and specific.
- Use placeholder text only as a short example, never as a replacement for the label.
- Show helper text for useful context and a specific corrective message for errors.
- Use a character count when a limit matters.
- Preserve entered content between states and use Disabled sparingly.

## Interactive Preview

<ComponentPreview name="InputTextArea" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | - |
| `name` | `string` | `'input-text-area'` | - |
| `id` | `string` | `'input-text-area'` | - |
| `label` | `string` | `'Your message'` | - |
| `labelText` | `string` | `''` | - |
| `placeholder` | `string` | `''` | - |
| `placeholderText` | `string` | `'Type your message here.'` | - |
| `hint` | `string` | `''` | - |
| `hintErrorText` | `string` | `'Your message will be copied to the support team.'` | - |
| `errorMessage` | `string` | `''` | - |
| `characterCount` | `string` | `''` | - |
| `maxLength` | `number` | `200` | - |
| `rows` | `number` | `4` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showRequired` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `showCharacterCount` | `boolean` | `true` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `false` | - |
| `visualState` | `InputTextAreaVisualState` | `'Default'` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onFocus` | `() => void` | `-` | - |
| `onBlur` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { InputTextArea } from '@supernova/design-system/react';

export default function App() {
  return <InputTextArea name="input-text-area" id="input-text-area" label="Your message" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputTextArea } from '@supernova/design-system/vue3';
</script>

<template>
  <InputTextArea name="input-text-area" id="input-text-area" label="Your message" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputTextArea } from '@supernova/design-system/svelte';
</script>

<InputTextArea name="input-text-area" id="input-text-area" label="Your message" />
```

:::
