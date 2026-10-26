# InputMultipleFileUpload

A multi-file upload input for adding and managing several files in one interaction.

## When to Use

- Use when users need to attach a collection of documents or assets.
- Use when each file must remain individually visible and manageable.
- Use a single-file input when only one attachment is accepted.

## Usage Guidelines

- State accepted formats, per-file size, total size, and file-count limits.
- Show each file with its name and upload status.
- Allow users to remove, retry, or replace individual files.
- Keep progress and errors associated with the relevant file.
- Preserve successfully uploaded files when another file fails.

## Interactive Preview

<ComponentPreview name="InputMultipleFileUpload" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'multiple-file-upload'` | - |
| `labelText` | `string` | `'Attachments'` | - |
| `hintErrorText` | `string` | `'Up to 5 files, 10 MB each.'` | - |
| `showLabel` | `boolean` | `true` | - |
| `showRequired` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `instruction` | `string` | `'Choose one or more files'` | - |
| `fileCount` | `string` | `'0 of 5'` | - |
| `file1Name` | `string` | `'brand-guidelines.pdf'` | - |
| `file1Status` | `string` | `'Uploaded'` | - |
| `file2Name` | `string` | `'campaign-assets.zip'` | - |
| `file2Status` | `string` | `'Uploading · 64%'` | - |
| `files` | `InputMultipleFileUploadFile[]` | `[]` | - |
| `useFileListSlot` | `boolean` | `false` | - |
| `visualState` | `InputMultipleFileUploadState` | `'Default'` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |
| `onBrowse` | `() => void` | `-` | - |
| `onRemoveFile` | `(file: InputMultipleFileUploadFile, index: number) => void` | `-` | - |
| `onRetryFile` | `(file: InputMultipleFileUploadFile, index: number) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { InputMultipleFileUpload } from '@supernova/design-system/react';

export default function App() {
  return <InputMultipleFileUpload id="multiple-file-upload" labelText="Attachments" hintErrorText="Up to 5 files, 10 MB each." />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputMultipleFileUpload } from '@supernova/design-system/vue3';
</script>

<template>
  <InputMultipleFileUpload id="multiple-file-upload" labelText="Attachments" hintErrorText="Up to 5 files, 10 MB each." />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputMultipleFileUpload } from '@supernova/design-system/svelte';
</script>

<InputMultipleFileUpload id="multiple-file-upload" labelText="Attachments" hintErrorText="Up to 5 files, 10 MB each." />
```

:::
