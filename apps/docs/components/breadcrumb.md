# Breadcrumb

A breadcrumb navigation component that communicates the user's current location within a hierarchical structure and provides a clear path back to higher levels.

## When to Use

- Use on pages that are nested within a clear hierarchy.
- Use when users may need to move quickly to a parent level.
- Use in content-heavy products, settings, catalogs, or multi-level navigation.
- Do not use as a replacement for primary navigation or for flat page structures.

## Usage Guidelines

- Keep labels concise, recognizable, and consistent with page titles.
- Arrange items from the highest level to the current page.
- Treat the final item as the current location; it should not navigate to itself.
- Use the shortest variant that accurately represents the hierarchy.
- For long paths, use the deep variant with an ellipsis to collapse intermediate levels.
- Keep separators visually consistent and ensure interactive items have clear hover and focus states.

## Live Preview & Usage

<ComponentPreview name="Breadcrumb" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `ariaLabel` | `string` | `'Breadcrumb'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `BreadcrumbEllipsis`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `isLast` | `boolean` | `false` | - |
| `separator` | `string` | `'/'` | - |
| `separatorIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `ariaLabel` | `string` | `'More pages'` | - |
| `className` | `string` | `''` | - |
| `onClick` | `() => void` | `-` | - |

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

## Design Tokens & Color Customization

`Breadcrumb` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Breadcrumb className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Breadcrumb className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
