# InputMultipleFileUpload

A multi-file upload input for adding and managing several files in one interaction.

WHEN TO USE
• Use when users need to attach a collection of documents or assets.
• Use when each file must remain individually visible and manageable.
• Use a single-file input when only one attachment is accepted.

USAGE GUIDELINES
• State accepted formats, per-file size, total size, and file-count limits.
• Show each file with its name and upload status.
• Allow users to remove, retry, or replace individual files.
• Keep progress and errors associated with the relevant file.
• Preserve successfully uploaded files when another file fails.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• File list — Slot containing uploaded-file items.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.
• Instruction — Main file-selection instruction.
• File count — Current and maximum number of files.
• File 1 name / File 2 name — Example file names.
• File 1 status / File 2 status — Example upload statuses.

## Usage

::: code-group

```tsx [React]
import { InputMultipleFileUpload } from './InputMultipleFileUpload';

export default function Example() {
  return (
    <InputMultipleFileUpload file 1 name="brand-guidelines.pdf" file 1 status="Uploaded">
      InputMultipleFileUpload
    </InputMultipleFileUpload>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputMultipleFileUpload } from './InputMultipleFileUpload';
</script>

<template>
  <InputMultipleFileUpload file 1 name="brand-guidelines.pdf" file 1 status="Uploaded">
    InputMultipleFileUpload
  </InputMultipleFileUpload>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import InputMultipleFileUpload from './InputMultipleFileUpload.svelte';
</script>

<InputMultipleFileUpload file 1 name="brand-guidelines.pdf" file 1 status="Uploaded">
  InputMultipleFileUpload
</InputMultipleFileUpload>
```

```ts [Angular]
import { Component } from '@angular/core';
import { InputMultipleFileUploadComponent } from './input-multiple-file-upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputMultipleFileUploadComponent],
  template: `
    <app-input-multiple-file-upload file 1 name="brand-guidelines.pdf" file 1 status="Uploaded">
      InputMultipleFileUpload
    </app-input-multiple-file-upload>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `File 1 name` | `text` | `brand-guidelines.pdf` | - |
| `File 1 status` | `text` | `Uploaded` | - |
| `File 2 name` | `text` | `campaign-assets.zip` | - |
| `File 2 status` | `text` | `Uploading · 64%` | - |
| `File count` | `text` | `0 of 5` | - |
| `File list` | `slot` | - | Slot for uploaded-file items. Each item should expose its file name, status, and relevant management actions. |
| `Hint/Error text` | `text` | `Up to 5 files, 10 MB each.` | - |
| `Instruction` | `text` | `Choose one or more files` | - |
| `Label text` | `text` | `Attachments` | - |
| `Show hint` | `boolean` | `true` | - |
| `Show label` | `boolean` | `true` | - |
| `Show required` | `boolean` | `true` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
