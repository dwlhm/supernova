# Topbar

A horizontal application header that provides a consistent area for page-level or global controls through a flexible content slot.

## When to Use

- Use at the top of authenticated application screens that require persistent global or contextual actions.
- Use to host content such as page context, search, notifications, help, or account actions when those controls need consistent placement.

## Usage Guidelines

- Place content in Topbar Content and prioritize the most important actions.
- Keep the bar concise; move infrequent actions into menus when space is limited.
- Maintain predictable control order across screens.
- Avoid duplicating navigation or actions already provided by the sidebar or page header.

## Live Preview & Usage

<ComponentPreview name="Topbar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `ariaLabel` | `string` | `'Application header'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `BreadcrumbItem`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `href` | `string` | `''` | - |
| `current` | `boolean` | `false` | - |
| `isLast` | `boolean` | `false` | - |
| `separator` | `string` | `'/'` | - |
| `separatorIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TopbarContent`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TopbarTrigger`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `ariaLabel` | `string` | `'Toggle sidebar'` | - |
| `disabled` | `boolean` | `false` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `className` | `string` | `''` | - |
| `onClick` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`Topbar` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Topbar className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Topbar className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
