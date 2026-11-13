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
| `label` | `string` | `''` | - |
| `buttonText` | `string` | `'Choose File'` | - |
| `placeholder` | `string` | `'No file chosen'` | - |
| `value` | `string` | `''` | - |
| `fileName` | `string` | `''` | - |
| `hint` | `string \| ((fileName: string) => string)` | `''` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `accept` | `string` | `'image/png,image/jpeg,application/pdf'` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onFileNameChange` | `(fileName: string) => void` | `-` | - |
| `onFilesChange` | `(files: unknown[]) => void` | `-` | - |
| `onRemove` | `() => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`InputFileInput` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `border-primary-border-emphasis` | `--color-primary-border-emphasis` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-foreground-subtle` | `--color-foreground-subtle` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<InputFileInput className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<InputFileInput className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
