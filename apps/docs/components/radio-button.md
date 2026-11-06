# RadioButton

A radio button lets users select exactly one option from a set of mutually exclusive choices. Radio buttons should always appear in a group of two or more options with clear labels.

## When to Use

- Use when users must choose one option from a visible list.
- Use when seeing all available options at once supports comparison.
- Use for short, stable option sets.
- Use a checkbox when users may select multiple options.
- Use a select or dropdown when the list is long or space is limited.

## Usage Guidelines

- Group related radio buttons under a clear question or group label.
- Keep option labels concise, specific, and grammatically parallel.
- Arrange options vertically when possible for easier scanning.
- Use a sensible default only when it is safe and helpful.
- Treat the control and its label as one interaction target in implementation.
- Never use a single radio button for an independent on/off setting.
- Explain why an option is disabled when the reason is not obvious.

## Live Preview & Usage

<ComponentPreview name="RadioButton" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'radio-button'` | - |
| `checked` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `label` | `string` | `'Label'` | - |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `name` | `string` | `'radio-group'` | - |
| `value` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `onChange` | `(value: string) => void` | `-` | - |
