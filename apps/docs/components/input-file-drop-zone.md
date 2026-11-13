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
| `label` | `string` | `''` | - |
| `primaryText` | `string` | `'Drag and drop files here, or'` | - |
| `supportingText` | `string` | `''` | - |
| `browseText` | `string` | `'Browse'` | - |
| `replaceText` | `string` | `'Replace'` | - |
| `removeText` | `string` | `'Remove'` | - |
| `value` | `string` | `''` | - |
| `fileName` | `string` | `''` | - |
| `fileMetadata` | `string` | `''` | - |
| `hint` | `string \| ((fileName: string) => string)` | `''` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `accept` | `string` | `''` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `state` | `'default' \| 'focus' \| 'filled' \| 'error' \| 'disabled'` | `'default'` | default, focus, filled, error, disabled |
| `isDragging` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onFileNameChange` | `(fileName: string) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
| `onDragStateChange` | `(isDragging: boolean) => void` | `-` | - |
| `onRemove` | `() => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`InputFileDropZone` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-destructive-background` | `--color-destructive-background` | Background / Surface fill |
| `bg-destructive-hover` | `--color-destructive-hover` | Background / Surface fill |
| `bg-primary-subtle` | `--color-primary-subtle` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `border-primary-default` | `--color-primary-default` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-primary-default` | `--color-primary-default` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<InputFileDropZone className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<InputFileDropZone className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
