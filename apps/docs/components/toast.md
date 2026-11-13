# Toast

A brief, non-intrusive notification that communicates the status of an action or process without interrupting the user’s workflow.

## When to Use

- Confirm that an action completed successfully.
- Report an error or warn about a condition that may require attention.
- Provide short, time-sensitive system information.
- Use for feedback that does not require an immediate decision. For blocking or complex messages, use an alert or dialog instead.

## Usage Guidelines

- Keep the title concise and action-oriented; add a description only when extra context is necessary.
- Choose the Type that matches the message intent, not its visual prominence.
- Use one optional action for a clear, reversible, or follow-up task.
- Show the close button when users may need to dismiss a persistent toast.
- Show the timestamp only when message recency is useful.
- Avoid stacking many toasts, duplicating inline validation, or using toasts for critical information that must remain visible.

## Live Preview & Usage

<ComponentPreview name="Toast" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `id` | `string` | `''` | - |
| `open` | `boolean` | `true` | - |
| `type` | `'default' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'default'` | default, success, error, warning, info |
| `placement` | `'inline' \| 'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'inline'` | inline, top-left, top-center, top-right, bottom-left, bottom-center, bottom-right |
| `title` | `string` | `''` | - |
| `description` | `string` | `''` | - |
| `showDescription` | `boolean` | `false` | - |
| `actionText` | `string` | `'Undo'` | - |
| `showAction` | `boolean` | `false` | - |
| `showClose` | `boolean` | `false` | - |
| `closeLabel` | `string` | `'Dismiss notification'` | - |
| `closeIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `timestamp` | `string` | `''` | - |
| `showTimestamp` | `boolean` | `true` | - |
| `duration` | `number` | `0` | - |
| `pauseOnHover` | `boolean` | `true` | - |
| `draggable` | `boolean` | `true` | - |
| `swipeThreshold` | `number` | `88` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `inlineStyle` | `Record<string, string>` | `-` | - |
| `className` | `string` | `''` | - |
| `onAction` | `() => void` | `-` | - |
| `onClose` | `() => void` | `-` | - |

### `ToastViewport`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `id` | `string` | `-` | - |
| `placement` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-right'` | top-left, top-center, top-right, bottom-left, bottom-center, bottom-right |
| `inline` | `boolean` | `false` | - |
| `expanded` | `boolean` | `false` | - |
| `scrollable` | `boolean` | `true` | - |
| `ariaLabel` | `string` | `'Notifications'` | - |
| `inlineStyle` | `Record<string, string>` | `-` | - |
| `className` | `string` | `''` | - |
| `onMouseEnter` | `() => void` | `-` | - |
| `onMouseLeave` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`Toast` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-destructive-default` | `--color-destructive-default` | Background / Surface fill |
| `bg-foreground-subtle` | `--color-foreground-subtle` | Background / Surface fill |
| `bg-info-default` | `--color-info-default` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `bg-secondary-hover` | `--color-secondary-hover` | Background / Surface fill |
| `bg-success-default` | `--color-success-default` | Background / Surface fill |
| `bg-warning-default` | `--color-warning-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-foreground-on-accent` | `--color-foreground-on-accent` | Text / Foreground color |
| `text-info-default` | `--color-info-default` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |
| `text-success-default` | `--color-success-default` | Text / Foreground color |
| `text-warning-default` | `--color-warning-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Toast className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Toast className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
