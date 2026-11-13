# AlertDialog

Alert dialog asks users to explicitly confirm an important, risky, or difficult-to-reverse action before it is performed.

## When to Use

- Before destructive actions such as deleting an account, data, or access.
- When an action is permanent or may affect multiple people.
- When users need to understand the consequences before proceeding.

## Usage Guidelines

- Use a clear heading that states the decision the user must make.
- Keep the description concise and explain the consequence and affected item.
- Use specific action labels; avoid ambiguous labels such as “OK”.
- Place the safe or cancel action first and the primary action on the right.
- Hide the description only when the heading provides sufficient context. Keep it visible for high-risk actions.
- Use a destructive button style when the confirmed action is destructive.

## Live Preview & Usage

<ComponentPreview name="AlertDialog" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'alert-dialog'` | - |
| `open` | `boolean` | `true` | - |
| `inline` | `boolean` | `false` | - |
| `heading` | `string` | `''` | - |
| `description` | `string` | `''` | - |
| `showDescription` | `boolean` | `true` | - |
| `showCloseButton` | `boolean` | `true` | - |
| `closeLabel` | `string` | `'Close'` | - |
| `closeIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `cancelLabel` | `string` | `'Cancel'` | - |
| `confirmLabel` | `string` | `'Continue'` | - |
| `destructive` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onCancel` | `() => void` | `-` | - |
| `onConfirm` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`AlertDialog` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-destructive-background` | `--color-destructive-background` | Background / Surface fill |
| `bg-destructive-hover` | `--color-destructive-hover` | Background / Surface fill |
| `bg-destructive-pressed` | `--color-destructive-pressed` | Background / Surface fill |
| `bg-overlay-backdrop` | `--color-overlay-backdrop` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `bg-primary-hover` | `--color-primary-hover` | Background / Surface fill |
| `bg-primary-pressed` | `--color-primary-pressed` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `bg-secondary-hover` | `--color-secondary-hover` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<AlertDialog className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<AlertDialog className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
