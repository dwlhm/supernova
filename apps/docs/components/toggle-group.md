# ToggleGroup

A toggle group organizes several related switch controls into one scannable settings section. Each switch remains independent, while the shared layout and optional group label communicate their relationship.

## When to Use

- Use when two to five related settings should be presented together.
- Use when each option can be enabled or disabled independently.
- Use in settings pages, preference panels, filters, or configuration forms.
- Do not use when users must choose only one option; use a radio group or segmented control instead.

## Usage Guidelines

- Give the group a concise label when the relationship between options is not self-evident.
- Write each toggle label as a clear setting name with an unambiguous on state.
- Show only the number of toggle rows needed; hide unused rows.
- Keep the size consistent with surrounding controls and interface density.
- Order options logically, placing the most common or important settings first.
- Explain unavailable options near the affected toggle rather than at the group level.

## Live Preview & Usage

<ComponentPreview name="ToggleGroup" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `ariaLabel` | `string` | `'Toggle group'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `Toggle`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `pressed` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `showText` | `boolean` | `false` | - |
| `showIcon` | `boolean` | `false` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `ariaLabel` | `string` | `''` | - |
| `onPressedChange` | `(pressed: boolean) => void` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`ToggleGroup` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<ToggleGroup className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<ToggleGroup className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
