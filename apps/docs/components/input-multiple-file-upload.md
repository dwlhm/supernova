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
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `id` | `string` | `'multiple-file-upload'` | - |
| `name` | `string` | `'files'` | - |
| `value` | `string` | `''` | - |
| `label` | `string` | `''` | - |
| `instruction` | `string` | `'Choose one or more files'` | - |
| `browseText` | `string` | `'Browse'` | - |
| `fileCount` | `string \| ((count: number) => string)` | `''` | - |
| `hint` | `string \| ((fileName: string) => string)` | `''` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `accept` | `string` | `'image/png,image/jpeg,application/pdf,application/zip'` | - |
| `state` | `'default' \| 'focus' \| 'filled' \| 'error' \| 'disabled'` | `'default'` | default, focus, filled, error, disabled |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(files: unknown[]) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

### `InputMultipleFileUploadItem`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `statusText` | `string` | `''` | - |
| `status` | `'uploading' \| 'completed' \| 'error'` | `'completed'` | uploading, completed, error |
| `removeText` | `string` | `'Remove'` | - |
| `disabled` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onRemove` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`InputMultipleFileUpload` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-subtle` | `--color-background-subtle` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `bg-secondary-hover` | `--color-secondary-hover` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `border-primary-border-emphasis` | `--color-primary-border-emphasis` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-primary-default` | `--color-primary-default` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |
| `text-success-default` | `--color-success-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<InputMultipleFileUpload className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<InputMultipleFileUpload className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
