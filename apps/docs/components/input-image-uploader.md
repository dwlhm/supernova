# InputImageUploader

An image-specific uploader for selecting or dropping an image and communicating its preview or upload status.

WHEN TO USE
• Use for profile photos, cover images, product media, or other visual assets.
• Use when image-specific constraints such as aspect ratio or dimensions matter.
• Use a general file input for non-image documents.

USAGE GUIDELINES
• State accepted formats, maximum size, and recommended dimensions or aspect ratio.
• Show a preview after a valid image is selected.
• Provide replace and remove actions.
• Use a specific error message for unsupported, oversized, or corrupted images.
• Include meaningful alternative-text handling elsewhere in the flow when the image conveys content.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.
• Primary text — Main upload instruction.
• Supporting text — Image requirements.
• File name — Selected-image name.
• File metadata — Dimensions, size, or upload status.

## Live Preview

<FrameworkPreview name="InputImageUploader" />

## Usage

::: code-group

```tsx [React]
import { InputImageUploader } from './InputImageUploader';

export default function Example() {
  return (
    <InputImageUploader file metadata="1200 × 1200 · 1.8 MB" file name="profile-photo.jpg">
      InputImageUploader
    </InputImageUploader>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputImageUploader } from './InputImageUploader';
</script>

<template>
  <InputImageUploader file metadata="1200 × 1200 · 1.8 MB" file name="profile-photo.jpg">
    InputImageUploader
  </InputImageUploader>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import InputImageUploader from './InputImageUploader.svelte';
</script>

<InputImageUploader file metadata="1200 × 1200 · 1.8 MB" file name="profile-photo.jpg">
  InputImageUploader
</InputImageUploader>
```

```ts [Angular]
import { Component } from '@angular/core';
import { InputImageUploaderComponent } from './input-image-uploader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputImageUploaderComponent],
  template: `
    <app-input-image-uploader file metadata="1200 × 1200 · 1.8 MB" file name="profile-photo.jpg">
      InputImageUploader
    </app-input-image-uploader>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `File metadata` | `text` | `1200 × 1200 · 1.8 MB` | - |
| `File name` | `text` | `profile-photo.jpg` | - |
| `Hint/Error text` | `text` | `For best results, use a 1:1 image.` | - |
| `Label text` | `text` | `Profile image` | - |
| `Primary text` | `text` | `Upload an image` | - |
| `Show hint` | `boolean` | `true` | - |
| `Show label` | `boolean` | `true` | - |
| `Show required` | `boolean` | `true` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |
| `Supporting text` | `text` | `Square JPG or PNG, up to 5 MB` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
