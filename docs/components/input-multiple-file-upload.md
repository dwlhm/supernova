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

## Live Preview & Usage

<ComponentPreview name="InputMultipleFileUpload" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'multiple-file-upload'` | - |
| `name` | `string` | `'files'` | - |
| `label` | `string` | `'Attachments'` | - |
| `instruction` | `string` | `'Choose one or more files'` | - |
| `browseText` | `string` | `'Browse'` | - |
| `files` | `UploadedFile[]` | `[]` | - |
| `fileCount` | `string` | `'0 of 5'` | - |
| `hint` | `string` | `'Up to 5 files, 10 MB each.'` | - |
| `errorMessage` | `string` | `''` | - |
| `accept` | `string` | `'image/png,image/jpeg,application/pdf,application/zip'` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onRemove` | `(id: string) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
