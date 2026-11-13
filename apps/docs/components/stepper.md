# Stepper

A progress indicator that communicates a user’s position within a four-step process. It supports horizontal and vertical orientations. Completed steps use a check icon, the current step is highlighted, and upcoming steps remain neutral.

## When to Use

- Use for linear, multi-step flows where users should understand their current position and remaining steps.
- Use Horizontal when sufficient width is available and the flow is short.
- Use Vertical in narrow layouts, side panels, mobile screens, or when labels need more horizontal room.
- Suitable for onboarding, checkout, setup, application, and form workflows.
- Do not use for non-linear navigation, tabs, or processes with frequent branching.

## Usage Guidelines

- Keep step labels short, clear, and action-oriented.
- Present steps in the exact order users will complete them.
- Use the Current property to match the active screen or task.
- Mark a step as completed only after its required action succeeds.
- Keep the orientation and total number of steps stable during a flow.
- Pair the Stepper with explicit Back and Continue actions.

## Live Preview & Usage

<ComponentPreview name="Stepper" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `orientation` | `'horizontal' \| 'vertical' \| 'responsive' \| string` | `'horizontal'` | horizontal, vertical, responsive, string |
| `ariaLabel` | `string` | `'Progress'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `StepperConnector`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `status` | `'completed' \| 'active' \| 'upcoming'` | `'upcoming'` | completed, active, upcoming |
| `orientation` | `'horizontal' \| 'vertical' \| 'responsive' \| string` | `'horizontal'` | horizontal, vertical, responsive, string |
| `isLast` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |

### `StepperIndicator`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `index` | `number` | `0` | - |
| `status` | `'completed' \| 'active' \| 'upcoming'` | `'upcoming'` | completed, active, upcoming |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `className` | `string` | `''` | - |

### `StepperItem`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `index` | `number` | `0` | - |
| `status` | `'completed' \| 'active' \| 'upcoming'` | `'upcoming'` | completed, active, upcoming |
| `orientation` | `'horizontal' \| 'vertical' \| 'responsive' \| string` | `'horizontal'` | horizontal, vertical, responsive, string |
| `isLast` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`Stepper` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-border-default` | `--color-border-default` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `bg-success-foreground` | `--color-success-foreground` | Background / Surface fill |
| `bg-success-subtle` | `--color-success-subtle` | Background / Surface fill |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |
| `text-success-foreground` | `--color-success-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Stepper className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Stepper className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
