# Badge

A compact label used to communicate status, category, or supporting metadata without interrupting the main content.

## When to Use

- Show a concise status, classification, or attribute.
- Help users scan and compare items quickly.
- Use alongside primary content, not as a replacement for buttons or alerts.

## Usage Guidelines

- Keep labels short, clear, and sentence case.
- Choose the variant by meaning, not decoration.
- Use one semantic meaning consistently across the product.
- Avoid placing several high-emphasis badges next to each other.
- Do not use a Badge for interactive actions.

## Live Preview & Usage

<ComponentPreview name="Badge" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'success' \| 'warning' \| 'info' \| 'outline'` | `'primary'` | primary, secondary, destructive, success, warning, info, outline |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

## Design Tokens & Color Customization

`Badge` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-destructive-subtle` | `--color-destructive-subtle` | Background / Surface fill |
| `bg-info-subtle` | `--color-info-subtle` | Background / Surface fill |
| `bg-primary-subtle` | `--color-primary-subtle` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `bg-success-subtle` | `--color-success-subtle` | Background / Surface fill |
| `bg-warning-subtle` | `--color-warning-subtle` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-info-foreground` | `--color-info-foreground` | Text / Foreground color |
| `text-primary-subtle-foreground` | `--color-primary-subtle-foreground` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |
| `text-success-foreground` | `--color-success-foreground` | Text / Foreground color |
| `text-warning-foreground` | `--color-warning-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Badge className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Badge className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
