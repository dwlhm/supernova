# SwitchButton

A switch lets users turn one setting on or off. It communicates a binary state and should apply the change immediately.

## When to Use

- Use for settings or preferences with two mutually exclusive states.
- Use when turning a feature on or off takes effect immediately.
- Use in forms, lists, and settings panels for independent binary controls.
- Do not use for mutually exclusive choices in a group; use radio buttons instead.
- Do not use when the change requires a separate Submit or Confirm action; use a checkbox instead.

## Usage Guidelines

- Pair the switch with a clear label that describes the setting, not the action.
- Keep labels positive and consistent so the on state is easy to understand.
- Use Medium by default, Small in dense layouts, and Large for prominent or touch-focused contexts.
- Preserve clear hover, focus, pressed, and state feedback in implementation.
- Use the disabled state only when the setting is temporarily unavailable.
- Explain why a switch is disabled when the reason is not obvious.

## Live Preview & Usage

<ComponentPreview name="SwitchButton" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'switch-button'` | - |
| `name` | `string` | `'switch'` | - |
| `value` | `string` | `'on'` | - |
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
| `ariaLabel` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |
| `onValueChange` | `(checked: boolean) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`SwitchButton` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<SwitchButton className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<SwitchButton className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
