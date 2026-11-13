# Sidebar

A persistent vertical navigation shell that organizes brand, primary navigation, and account-related content. It supports expanded and collapsed layouts so the navigation can adapt to the available workspace.

## When to Use

- Use as the primary navigation container for desktop application layouts.
- Use the collapsed variant when horizontal space is limited or users need more room for page content.

## Usage Guidelines

- Place product identity or a logo in Brand content.
- Place the primary menu structure in Navigation content.
- Place profile, workspace, or account controls in Account content.
- Keep navigation order and icon meaning consistent between expanded and collapsed states.
- Provide accessible labels or tooltips when labels are hidden.

## Live Preview & Usage

<ComponentPreview name="Sidebar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `expanded` | `boolean` | `true` | - |
| `ariaLabel` | `string` | `'Sidebar'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `SidebarAccount`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `expanded` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `SidebarBrand`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `expanded` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `SidebarNav`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `expanded` | `boolean` | `true` | - |
| `ariaLabel` | `string` | `'Main'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `SidebarSection`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `''` | - |
| `expanded` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

## Design Tokens & Color Customization

`Sidebar` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Sidebar className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Sidebar className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
