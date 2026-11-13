# Toggle

Toggle lets users switch a single setting between off and on, with the change taking effect immediately.

## When to Use

- Use for binary preferences or settings with an immediate result.
- Use when users can clearly understand the effect of turning the option on or off.
- Do not use for multiple-choice decisions, required acknowledgements, or actions that need confirmation.

## Usage Guidelines

- Pair the toggle with a clear, concise label that describes the enabled state.
- Keep the current state visually clear and avoid relying on color alone.
- Use one size consistently within the same interface area.
- Use supporting text when the outcome may not be obvious.
- Keep disabled controls visible only when their context is useful, and explain why they are unavailable when needed.

## Live Preview & Usage

<ComponentPreview name="Toggle" />

## Props & Variants

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

`Toggle` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Toggle className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Toggle className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
