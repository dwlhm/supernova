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

## Live Preview & Usage

<ComponentPreview name="InputFileDropZone" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'file-drop-zone'` | - |
| `name` | `string` | `'drop-file'` | - |
| `label` | `string` | `'Documents'` | - |
| `primaryText` | `string` | `'or drag and drop files here'` | - |
| `supportingText` | `string` | `'PNG, JPG, or PDF up to 10 MB'` | - |
| `browseText` | `string` | `'Browse'` | - |
| `fileName` | `string` | `''` | - |
| `fileMetadata` | `string` | `''` | - |
| `hint` | `string` | `'You can upload one file.'` | - |
| `errorMessage` | `string` | `''` | - |
| `accept` | `string` | `'image/png,image/jpeg,application/pdf'` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onFileNameChange` | `(fileName: string) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
