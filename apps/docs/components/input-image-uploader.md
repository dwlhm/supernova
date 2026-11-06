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

## Live Preview & Usage

<ComponentPreview name="InputImageUploader" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'image-uploader'` | - |
| `name` | `string` | `'image-file'` | - |
| `label` | `string` | `'Profile image'` | - |
| `primaryText` | `string` | `'Upload an image'` | - |
| `supportingText` | `string` | `'Square JPG or PNG, up to 5 MB'` | - |
| `fileName` | `string` | `''` | - |
| `fileMetadata` | `string` | `''` | - |
| `imageSrc` | `string` | `''` | - |
| `hint` | `string` | `'For best results, use a 1:1 image.'` | - |
| `errorMessage` | `string` | `''` | - |
| `accept` | `string` | `'image/png,image/jpeg'` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onFileNameChange` | `(fileName: string) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
| `onPreviewChange` | `(url: string) => void` | `-` | - |
