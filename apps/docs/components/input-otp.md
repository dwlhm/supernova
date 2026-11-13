# InputOTP

A one-time password input for entering short verification or authentication codes.

## When to Use

- Use in sign-in, account recovery, transaction approval, or identity-verification flows.
- Use only for temporary codes sent through a trusted channel.
- Use a standard text input for permanent passwords or recovery keys.

## Usage Guidelines

- State where the code was sent without exposing sensitive contact details.
- Allow paste and automatic code retrieval when supported.
- Move focus naturally between cells and support keyboard correction.
- Show expiration and resend guidance near the input.
- Use a clear error message for incomplete, expired, or incorrect codes.

## Live Preview & Usage

<ComponentPreview name="InputOTP" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | - |
| `length` | `number` | `6` | - |
| `id` | `string` | `'input-otp'` | - |
| `name` | `string` | `'otp'` | - |
| `label` | `string` | `''` | - |
| `hint` | `string \| ((value: string) => string)` | `''` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onChange` | `(value: string) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`InputOTP` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `border-primary-border-emphasis` | `--color-primary-border-emphasis` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<InputOTP className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<InputOTP className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
