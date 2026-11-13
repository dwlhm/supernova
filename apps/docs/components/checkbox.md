# Checkbox

A checkbox lets users select or clear one or more independent options. It supports selected and unselected states, three sizes, disabled states, and optional labels on either side.

## When to Use

- Use for optional, independent choices where more than one option may be selected.
- Use for confirmations, consent, preferences, and multi-select lists.
- Use when the result is applied after a user action such as Save or Submit.
- Do not use for mutually exclusive choices; use radio buttons instead.
- Do not use for an action that takes effect immediately; use a switch instead.

## Usage Guidelines

- Pair the checkbox with a short, clear label that describes the choice.
- Prefer a right-side label for left-to-right interfaces; use a left-side label only when the layout requires it.
- Use only one label position at a time.
- Keep related checkboxes vertically aligned and group them under a clear heading when needed.
- Avoid preselecting an option unless it is safe, expected, and easy to reverse.
- Use the disabled state only when the option is unavailable, and explain why when the reason is not obvious.

## Live Preview & Usage

<ComponentPreview name="Checkbox" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'checkbox'` | - |
| `checked` | `boolean` | `false` | - |
| `indeterminate` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `labelPosition` | `'left' \| 'right'` | `'right'` | left, right |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `name` | `string` | `'checkbox'` | - |
| `value` | `string` | `''` | - |
| `ariaLabel` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |
| `onValueChange` | `(checked: boolean) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`Checkbox` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-primary-default` | `--color-primary-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Checkbox className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Checkbox className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
