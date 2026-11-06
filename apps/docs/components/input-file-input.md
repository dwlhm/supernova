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

## Live Preview & Usage

<ComponentPreview name="InputFileInput" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'input-file'` | - |
| `name` | `string` | `'file'` | - |
| `label` | `string` | `'Picture'` | - |
| `buttonText` | `string` | `'Choose File'` | - |
| `fileName` | `string` | `''` | - |
| `hint` | `string` | `'Supported formats: PNG, JPG, or PDF.'` | - |
| `errorMessage` | `string` | `''` | - |
| `accept` | `string` | `'image/png,image/jpeg,application/pdf'` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onFileNameChange` | `(fileName: string) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
