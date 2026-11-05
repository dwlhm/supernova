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
| `disabled` | `boolean` | `false` | - |
| `label` | `string` | `'Slider'` | - |
| `showValue` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: number) => void` | `-` | - |
