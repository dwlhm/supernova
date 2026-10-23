# InputFileDropZone

A large upload target for adding a file by drag and drop or by opening the device file picker.

WHEN TO USE
• Use when file upload is a primary task.
• Use when a large, discoverable target improves completion.
• Keep a browse action available because drag and drop may not be available on every device.

USAGE GUIDELINES
• State accepted formats, maximum size, and file-count limits before upload.
• Provide visible feedback during drag-over and keyboard focus.
• Show the selected file name and upload status.
• Allow replacement or removal before submission.
• Explain upload failures and how to resolve them.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.
• Primary text — Main upload instruction.
• Supporting text — File requirements.
• File name — Selected-file name.
• File metadata — File size, type, or upload status.

## Live Preview

<FrameworkPreview name="InputFileDropZone" />

## Usage

::: code-group

```tsx [React]
import { InputFileDropZone } from './InputFileDropZone';

export default function Example() {
  return (
    <InputFileDropZone file metadata="248 KB · Ready to upload" file name="invoice-september.pdf">
      InputFileDropZone
    </InputFileDropZone>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputFileDropZone } from './InputFileDropZone';
</script>

<template>
  <InputFileDropZone file metadata="248 KB · Ready to upload" file name="invoice-september.pdf">
    InputFileDropZone
  </InputFileDropZone>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import InputFileDropZone from './InputFileDropZone.svelte';
</script>

<InputFileDropZone file metadata="248 KB · Ready to upload" file name="invoice-september.pdf">
  InputFileDropZone
</InputFileDropZone>
```

```ts [Angular]
import { Component } from '@angular/core';
import { InputFileDropZoneComponent } from './input-file-drop-zone.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputFileDropZoneComponent],
  template: `
    <app-input-file-drop-zone file metadata="248 KB · Ready to upload" file name="invoice-september.pdf">
      InputFileDropZone
    </app-input-file-drop-zone>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `File metadata` | `text` | `248 KB · Ready to upload` | - |
| `File name` | `text` | `invoice-september.pdf` | - |
| `Hint/Error text` | `text` | `You can upload one file.` | - |
| `Label text` | `text` | `Documents` | - |
| `Primary text` | `text` | `Drag and drop files here, or` | - |
| `Show hint` | `boolean` | `true` | - |
| `Show label` | `boolean` | `true` | - |
| `Show required` | `boolean` | `false` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |
| `Supporting text` | `text` | `PNG, JPG, or PDF up to 10 MB` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
