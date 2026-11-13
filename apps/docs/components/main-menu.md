# MainMenu

A primary navigation item used for top-level destinations in the sidebar. It supports interaction and selection states, optional leading and trailing icons, and an optional status badge.

## When to Use

- Use for primary sections or destinations in the application's main navigation.
- Use Active for the current destination and interaction states only while the related interaction occurs.

## Usage Guidelines

- Keep labels short, specific, and action-oriented where appropriate.
- Use only one active item within the same navigation level.
- Use badges sparingly for meaningful status or newly introduced content.
- Show a trailing icon only when it communicates disclosure, navigation, or a relevant action.
- Do not use hover as the only indication that an item is interactive.

## Live Preview & Usage

<ComponentPreview name="MainMenu" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `active` | `boolean` | `false` | - |
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

`MainMenu` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `bg-primary-foreground` | `--color-primary-foreground` | Background / Surface fill |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-inverse` | `--color-foreground-inverse` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<MainMenu className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<MainMenu className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
