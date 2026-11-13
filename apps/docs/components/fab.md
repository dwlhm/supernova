# FAB

Floating Action Button (FAB)

A Floating Action Button represents the most important action on a screen, such as creating, adding, composing, or starting a new task.

## When to Use

- Use for one high-priority action that should remain easy to access.
- Use only when the action is relevant to most of the screen's content.
- Do not use for destructive, ambiguous, or low-frequency actions.
- Avoid showing more than one prominent FAB on the same screen.

## Usage Guidelines

- Use a clear, action-oriented icon. Add a short label when the icon alone may be unclear.
- Keep placement consistent and preserve safe spacing from screen edges and other controls.
- Ensure the FAB does not cover essential content, navigation, or system controls.
- Use the Primary variant for the highest emphasis, Secondary for reduced emphasis, and Outline on visually dense or contrasting surfaces.
- Provide an accessible name and maintain a logical focus order.
- Use interaction states as specified; do not use Disabled when the action can remain available with validation or guidance.

## Live Preview & Usage

<ComponentPreview name="FAB" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | button, submit, reset |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | primary, secondary, outline |
| `size` | `'small' \| 'regular' \| 'large' \| 'extended'` | `'small'` | small, regular, large, extended |
| `placement` | `'inline' \| 'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'inline'` | inline, top-left, top-center, top-right, bottom-left, bottom-center, bottom-right |
| `disabled` | `boolean` | `false` | - |
| `showIcon` | `boolean` | `true` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `ariaLabel` | `string` | `'Action'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`FAB` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `bg-primary-hover` | `--color-primary-hover` | Background / Surface fill |
| `bg-primary-pressed` | `--color-primary-pressed` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `bg-secondary-hover` | `--color-secondary-hover` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<FAB className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<FAB className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
