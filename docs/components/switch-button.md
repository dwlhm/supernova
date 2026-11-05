# SwitchButton

A switch lets users turn one setting on or off. It communicates a binary state and should apply the change immediately.

## When to Use

- Use for settings or preferences with two mutually exclusive states.
- Use when turning a feature on or off takes effect immediately.
- Use in forms, lists, and settings panels for independent binary controls.
- Do not use for mutually exclusive choices in a group; use radio buttons instead.
- Do not use when the change requires a separate Submit or Confirm action; use a checkbox instead.

## Usage Guidelines

- Pair the switch with a clear label that describes the setting, not the action.
- Keep labels positive and consistent so the on state is easy to understand.
- Use Medium by default, Small in dense layouts, and Large for prominent or touch-focused contexts.
- Preserve clear hover, focus, pressed, and state feedback in implementation.
- Use the disabled state only when the setting is temporarily unavailable.
- Explain why a switch is disabled when the reason is not obvious.

## Live Preview & Usage

<ComponentPreview name="SwitchButton" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'switch-button'` | - |
| `name` | `string` | `'switch'` | - |
| `value` | `string` | `'on'` | - |
| `checked` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `label` | `string` | `'Label'` | - |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |
