# InputDropdown

A selection input that lets users choose one option from a predefined list while keeping the form compact.

## When to Use

- Use when available values are known in advance.
- Use when displaying all choices at once would take too much space.
- Use radio buttons for a small set of choices that should remain visible.

## Usage Guidelines

- Use a clear label and a meaningful placeholder such as “Choose department.”
- Order options logically and keep labels concise.
- Enable search for long or difficult-to-scan lists.
- Show the selected option in the Filled state.
- Provide specific error guidance and never rely on color alone.

## Live Preview & Usage

<ComponentPreview name="InputDropdown" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `false` | - |
| `value` | `string` | `''` | - |
| `displayValue` | `string \| ((value: string) => string)` | `''` | - |
| `searchQuery` | `string` | `''` | - |
| `searchPlaceholder` | `string` | `'Search'` | - |
| `id` | `string` | `'input-dropdown'` | - |
| `name` | `string` | `'dropdown'` | - |
| `label` | `string` | `''` | - |
| `placeholder` | `string` | `'Select option'` | - |
| `hint` | `string \| ((value: string) => string)` | `''` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `false` | - |
| `showSearch` | `boolean` | `true` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `true` | - |
| `leftIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `rightIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `state` | `'default' \| 'focus' \| 'filled' \| 'error' \| 'disabled'` | `'default'` | default, focus, filled, error, disabled |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onSearchChange` | `(value: string) => void` | `-` | - |
| `onOpenChange` | `(open: boolean) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

### `InputDropdownItem`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | - |
| `selected` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |
| `onSelect` | `(value: string) => void` | `-` | - |

## Design Tokens & Color Customization

`InputDropdown` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-background-subtle` | `--color-background-subtle` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `border-primary-border-emphasis` | `--color-primary-border-emphasis` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-foreground-subtle` | `--color-foreground-subtle` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<InputDropdown className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<InputDropdown className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
