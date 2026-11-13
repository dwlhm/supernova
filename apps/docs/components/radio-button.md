# RadioButton

A radio button lets users select exactly one option from a set of mutually exclusive choices. Radio buttons should always appear in a group of two or more options with clear labels.

## When to Use

- Use when users must choose one option from a visible list.
- Use when seeing all available options at once supports comparison.
- Use for short, stable option sets.
- Use a checkbox when users may select multiple options.
- Use a select or dropdown when the list is long or space is limited.

## Usage Guidelines

- Group related radio buttons under a clear question or group label.
- Keep option labels concise, specific, and grammatically parallel.
- Arrange options vertically when possible for easier scanning.
- Use a sensible default only when it is safe and helpful.
- Treat the control and its label as one interaction target in implementation.
- Never use a single radio button for an independent on/off setting.
- Explain why an option is disabled when the reason is not obvious.

## Live Preview & Usage

<ComponentPreview name="RadioButton" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'radio-button'` | - |
| `checked` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `labelPosition` | `'left' \| 'right'` | `'right'` | left, right |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `name` | `string` | `''` | - |
| `value` | `string` | `''` | - |
| `ariaLabel` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onChange` | `(value: string) => void` | `-` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`RadioButton` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-primary-default` | `--color-primary-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<RadioButton className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<RadioButton className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
