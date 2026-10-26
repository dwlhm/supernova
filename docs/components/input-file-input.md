# InputFileInput

A compact file input that lets users browse for and select a single file from their device.

## When to Use

- Use when a form requires one document or attachment.
- Use when upload is secondary to the main task and a compact control is preferred.
- Use a drop zone when uploading is a primary task or benefits from a larger target.

## Usage Guidelines

- State accepted formats and maximum size before selection.
- Display the selected file name clearly.
- Allow users to replace or remove the selected file.
- Validate type and size with a specific error message.
- Keep the browse action keyboard accessible.

## Interactive Preview

<ComponentPreview name="InputFileInput" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `labelText` | `string` | `'Picture'` | - |
| `buttonText` | `string` | `'Choose File'` | - |
| `fileName` | `string` | `'No file chosen'` | - |
| `hintErrorText` | `string` | `'Supported formats: PNG, JPG, or PDF.'` | - |
| `showRequired` | `boolean` | `false` | - |
| `showHint` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `state` | `'Default' \| 'Focus' \| 'Filled' \| 'Error' \| 'Disabled'` | `'Default'` | Default, Focus, Filled, Error, Disabled |
| `accept` | `string` | `''` | - |
| `previewSrc` | `string` | `''` | - |
| `fileMeta` | `string` | `''` | - |
| `removeLabel` | `string` | `'Remove'` | - |
| `className` | `string` | `''` | - |
| `onChange` | `(fileName: string) => void` | `-` | - |
| `onRemove` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { InputFileInput } from '@supernova/design-system/react';

export default function App() {
  return <InputFileInput labelText="Picture" buttonText="Choose File" fileName="No file chosen" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputFileInput } from '@supernova/design-system/vue3';
</script>

<template>
  <InputFileInput labelText="Picture" buttonText="Choose File" fileName="No file chosen" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputFileInput } from '@supernova/design-system/svelte';
</script>

<InputFileInput labelText="Picture" buttonText="Choose File" fileName="No file chosen" />
```

:::
