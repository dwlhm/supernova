# Tabs

A horizontal tab bar composed of Tab Item instances. It provides up to eight tabs for switching between related content views or categories.

## When to Use

- Use Tabs when users need to move between peer views within the same context without leaving the page. Do not use it for sequential steps or primary site navigation.

## Usage Guidelines

- Use two to eight tabs with concise, parallel labels.
- Keep one tab active and ensure its content is visible.
- Order tabs by importance, frequency, or a natural sequence.
- Hide unused tabs instead of leaving empty labels.
- Avoid overcrowding; use another navigation pattern if labels no longer fit clearly.

## Live Preview & Usage

<ComponentPreview name="Tabs" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `ariaLabel` | `string` | `'Tabs'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TabItem`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `active` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `state` | `'default' \| 'active'` | `'default'` | default, active |
| `showIcon` | `boolean` | `false` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `showNum` | `boolean` | `false` | - |
| `num` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`Tabs` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

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
<Tabs className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Tabs className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
