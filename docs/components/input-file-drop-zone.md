# InputFileDropZone

A large upload target for adding a file by drag and drop or by opening the device file picker.

## When to Use

- Use when file upload is a primary task.
- Use when a large, discoverable target improves completion.
- Keep a browse action available because drag and drop may not be available on every device.

## Usage Guidelines

- State accepted formats, maximum size, and file-count limits before upload.
- Provide visible feedback during drag-over and keyboard focus.
- Show the selected file name and upload status.
- Allow replacement or removal before submission.
- Explain upload failures and how to resolve them.

## Interactive Preview

<ComponentPreview name="InputFileDropZone" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `labelText` | `string` | `'Documents'` | - |
| `hintErrorText` | `string` | `'You can upload one file.'` | - |
| `showLabel` | `boolean` | `true` | - |
| `showRequired` | `boolean` | `false` | - |
| `showHint` | `boolean` | `true` | - |
| `primaryText` | `string` | `'Drag and drop files here, or'` | - |
| `supportingText` | `string` | `'PNG, JPG, or PDF up to 10 MB'` | - |
| `browseLabel` | `string` | `'Browse files'` | - |
| `fileName` | `string` | `''` | - |
| `fileMetadata` | `string` | `''` | - |
| `state` | `'Default' \| 'Focus' \| 'Filled' \| 'Error' \| 'Disabled'` | `'Default'` | Default, Focus, Filled, Error, Disabled |
| `accept` | `string` | `''` | - |
| `multiple` | `boolean` | `false` | - |
| `id` | `string` | `'file-drop-zone'` | - |
| `className` | `string` | `''` | - |
| `onFilesSelected` | `(fileName: string, fileCount: number) => void` | `-` | - |
| `onRemove` | `() => void` | `-` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { InputFileDropZone } from '@supernova/design-system/react';

export default function App() {
  return <InputFileDropZone labelText="Documents" hintErrorText="You can upload one file." showLabel />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputFileDropZone } from '@supernova/design-system/vue3';
</script>

<template>
  <InputFileDropZone labelText="Documents" hintErrorText="You can upload one file." showLabel />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputFileDropZone } from '@supernova/design-system/svelte';
</script>

<InputFileDropZone labelText="Documents" hintErrorText="You can upload one file." showLabel />
```

:::
