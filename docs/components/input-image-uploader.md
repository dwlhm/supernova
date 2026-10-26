# InputImageUploader

An image-specific uploader for selecting or dropping an image and communicating its preview or upload status.

## When to Use

- Use for profile photos, cover images, product media, or other visual assets.
- Use when image-specific constraints such as aspect ratio or dimensions matter.
- Use a general file input for non-image documents.

## Usage Guidelines

- State accepted formats, maximum size, and recommended dimensions or aspect ratio.
- Show a preview after a valid image is selected.
- Provide replace and remove actions.
- Use a specific error message for unsupported, oversized, or corrupted images.
- Include meaningful alternative-text handling elsewhere in the flow when the image conveys content.

## Interactive Preview

<ComponentPreview name="InputImageUploader" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'image-uploader'` | - |
| `labelText` | `string` | `'Profile image'` | - |
| `hintErrorText` | `string` | `'For best results, use a 1:1 image.'` | - |
| `showRequired` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `primaryText` | `string` | `'Upload an image'` | - |
| `supportingText` | `string` | `'Square JPG or PNG, up to 5 MB'` | - |
| `fileName` | `string` | `'profile-photo.jpg'` | - |
| `fileMetadata` | `string` | `'1200 × 1200 · 1.8 MB'` | - |
| `imageSrc` | `string` | `''` | - |
| `accept` | `string` | `'image/png,image/jpeg'` | - |
| `state` | `'Default' \| 'Focus' \| 'Filled' \| 'Error' \| 'Disabled'` | `'Default'` | Default, Focus, Filled, Error, Disabled |
| `disabled` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onFileSelect` | `(file: ImageUploaderFileInfo) => void` | `-` | - |
| `onRemove` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { InputImageUploader } from '@supernova/design-system/react';

export default function App() {
  return <InputImageUploader id="image-uploader" labelText="Profile image" hintErrorText="For best results, use a 1:1 image." />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputImageUploader } from '@supernova/design-system/vue3';
</script>

<template>
  <InputImageUploader id="image-uploader" labelText="Profile image" hintErrorText="For best results, use a 1:1 image." />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputImageUploader } from '@supernova/design-system/svelte';
</script>

<InputImageUploader id="image-uploader" labelText="Profile image" hintErrorText="For best results, use a 1:1 image." />
```

:::
