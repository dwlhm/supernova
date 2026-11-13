# Slider

A slider allows users to select a single value from a defined range by moving a thumb along a track. The filled bar communicates the current value relative to the available range.

## When to Use

- Use for bounded numeric settings where users benefit from seeing the value in context, such as volume, brightness, price, or intensity.
- Use when an approximate or quickly adjustable value is more important than exact text entry.
- Avoid using a slider when users must enter a precise value; use a numeric input instead.
- Avoid using a slider for very small option sets; use radio buttons or a segmented control instead.

## Usage Guidelines

- Pair the slider with a clear label that describes the setting.
- Show the current value when precision or confirmation is important.
- Communicate the minimum and maximum values when the range is not obvious.
- Use a meaningful step increment and keep it consistent with the displayed value format.
- Ensure the control supports keyboard interaction and exposes an accessible name and value in implementation.
- Provide visible hover, focus, active, and disabled states when those states are added.
- ### Variants
- Default — A single-thumb horizontal slider with a filled value bar. This is the current standalone component; it is not yet part of a component set and has no additional Figma variants.

## Live Preview & Usage

<ComponentPreview name="Slider" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'slider'` | - |
| `name` | `string` | `'slider'` | - |
| `value` | `number` | `0` | - |
| `min` | `number` | `0` | - |
| `max` | `number` | `100` | - |
| `step` | `number` | `1` | - |
| `label` | `string \| ((value: number) => string)` | `''` | - |
| `showLabel` | `boolean` | `true` | - |
| `showValue` | `boolean` | `false` | - |
| `formatValue` | `(value: number) => string` | `-` | - |
| `hint` | `string \| ((value: number) => string)` | `''` | - |
| `showHint` | `boolean` | `true` | - |
| `required` | `boolean` | `false` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `'Slider'` | - |
| `trackClassName` | `string` | `''` | - |
| `indicatorClassName` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: number) => void` | `-` | - |
| `onBlur` | `(event: unknown) => void` | `-` | - |

## Design Tokens & Color Customization

`Slider` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `indicatorClassName` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `border-primary-default` | `--color-primary-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |

```tsx
// 1. Direct token override via indicatorClassName
<Slider indicatorClassName="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Slider indicatorClassName="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
