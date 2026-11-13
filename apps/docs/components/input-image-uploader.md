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
| `labelText` | `string` | `-` | - |
| `primaryText` | `string` | `'Upload an image'` | - |
| `supportingText` | `string` | `'Square JPG or PNG, up to 5 MB'` | - |
| `chooseText` | `string` | `'Choose image'` | - |
| `replaceText` | `string` | `'Replace'` | - |
| `removeText` | `string` | `'Remove'` | - |
| `value` | `string` | `''` | - |
| `fileName` | `string` | `''` | - |
| `fileMetadata` | `string` | `''` | - |
| `imageSrc` | `string` | `''` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `state` | `'default' \| 'focus' \| 'filled' \| 'error' \| 'disabled'` | `'default'` | default, focus, filled, error, disabled |
| `hint` | `string \| ((fileName: string) => string)` | `'For best results, use a 1:1 image.'` | - |
| `hintErrorText` | `string` | `-` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `accept` | `string` | `'image/png,image/jpeg'` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `true` | - |
| `showRequired` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onFileNameChange` | `(fileName: string) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
| `onPreviewChange` | `(url: string) => void` | `-` | - |
| `onRemove` | `() => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`InputImageUploader` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-destructive-background` | `--color-destructive-background` | Background / Surface fill |
| `bg-destructive-hover` | `--color-destructive-hover` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `bg-secondary-hover` | `--color-secondary-hover` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-foreground-subtle` | `--color-foreground-subtle` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<InputImageUploader className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<InputImageUploader className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
