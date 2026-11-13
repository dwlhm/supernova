# MenuItem

A secondary or expandable navigation item used within a menu hierarchy. It supports optional icons and badges, plus a submenu content slot for nested destinations.

## When to Use

- Use for secondary destinations or parent items that reveal nested navigation.
- Use Active when the item is selected or its submenu is expanded.

## Usage Guidelines

- Keep labels concise and clearly related to their parent section.
- Use the trailing icon to communicate expansion when submenu content is available.
- Keep nesting shallow and preserve a clear visual relationship between parent and submenu items.
- Use badges only for meaningful, concise status information.

## Live Preview & Usage

<ComponentPreview name="MenuItem" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Menu Item'` | - |
| `active` | `boolean` | `false` | - |
| `expanded` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showLeadingIcon` | `boolean` | `true` | - |
| `showTrailingIcon` | `boolean` | `true` | - |
| `leadingIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `trailingIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `showBadge` | `boolean` | `false` | - |
| `badgeLabel` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`MenuItem` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-inverse` | `--color-foreground-inverse` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<MenuItem className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<MenuItem className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
