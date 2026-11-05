# InputTextArea

A multi-line text input for collecting longer free-form content such as messages, comments, notes, feedback, or descriptions.

## When to Use

- Use when the expected response may span multiple lines.
- Use for open-ended input that benefits from a larger writing area.
- Use a single-line text input for short, predictable values.

## Usage Guidelines

- Keep the label visible and specific.
- Use placeholder text only as a short example, never as a replacement for the label.
- Show helper text for useful context and a specific corrective message for errors.
- Use a character count when a limit matters.
- Preserve entered content between states and use Disabled sparingly.

## Live Preview & Usage

<ComponentPreview name="InputTextArea" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | - |
| `name` | `string` | `'input-textarea'` | - |
| `id` | `string` | `'input-textarea'` | - |
| `label` | `string` | `'Your message'` | - |
| `placeholder` | `string` | `'Type your message here.'` | - |
| `hint` | `string` | `'Your message will be copied to the support team.'` | - |
| `errorMessage` | `string` | `''` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `rows` | `number` | `4` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `showCharacterCount` | `boolean` | `true` | - |
| `maxLength` | `number` | `200` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
