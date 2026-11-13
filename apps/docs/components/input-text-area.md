# InputTextArea

A multi-line text input for collecting longer free-form content such as messages, comments, notes, feedback, or descriptions.

## When to Use

- Use when the expected response may span multiple lines.
- Use for open-ended input that benefits from a larger writing area.
- Use a single-line text input for short, predictable values.

## Usage Guidelines

- Keep the label visible and specific.
- Use placeholder text only as a short example, never as a replacement for the label.
- Show helper text for useful context and a specific corrective message for errors.
- Use a character count when a limit matters.
- Preserve entered content between states and use Disabled sparingly.

## Live Preview & Usage

<ComponentPreview name="InputTextArea" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | - |
| `defaultValue` | `string` | `''` | - |
| `name` | `string` | `'input-textarea'` | - |
| `id` | `string` | `'input-textarea'` | - |
| `label` | `string` | `''` | - |
| `placeholder` | `string` | `''` | - |
| `hint` | `string \| ((value: string) => string)` | `''` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `readOnly` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `rows` | `number` | `4` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `showCharacterCount` | `boolean` | `true` | - |
| `maxLength` | `number` | `200` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `false` | - |
| `leftIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `rightIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onChange` | `(event: unknown) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |
| `onFocus` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`InputTextArea` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
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

```tsx
// 1. Direct token override via className
<InputTextArea className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<InputTextArea className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
