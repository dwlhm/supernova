# Checkbox

A checkbox lets users select or clear one or more independent options. It supports selected and unselected states, three sizes, disabled states, and optional labels on either side.

## When to Use

- Use for optional, independent choices where more than one option may be selected.
- Use for confirmations, consent, preferences, and multi-select lists.
- Use when the result is applied after a user action such as Save or Submit.
- Do not use for mutually exclusive choices; use radio buttons instead.
- Do not use for an action that takes effect immediately; use a switch instead.

## Usage Guidelines

- Pair the checkbox with a short, clear label that describes the choice.
- Prefer a right-side label for left-to-right interfaces; use a left-side label only when the layout requires it.
- Use only one label position at a time.
- Keep related checkboxes vertically aligned and group them under a clear heading when needed.
- Avoid preselecting an option unless it is safe, expected, and easy to reverse.
- Use the disabled state only when the option is unavailable, and explain why when the reason is not obvious.

## Live Preview & Usage

<ComponentPreview name="Checkbox" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'checkbox'` | - |
| `checked` | `boolean` | `false` | - |
| `indeterminate` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `label` | `string` | `'Label'` | - |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `name` | `string` | `'checkbox'` | - |
| `value` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |
