# InputText

A single-line input for collecting short-form information such as names, titles, email addresses, search terms, or other concise values.

## When to Use

- Use when the expected value fits on one line.
- Use for short, structured, or predictable information.
- Use a text area when users may need to enter multiple lines.

## Usage Guidelines

- Use a persistent, descriptive label.
- Match the input type and keyboard to the expected value in implementation.
- Use placeholder text as an example only.
- Provide actionable validation feedback and preserve the entered value.
- Use leading or trailing icons only when they clarify meaning or provide a relevant action.

## Live Preview & Usage

<ComponentPreview name="InputText" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | - |
| `name` | `string` | `'input-text'` | - |
| `id` | `string` | `'input-text'` | - |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'number'` | `'text'` | text, email, password, search, tel, url, number |
| `label` | `string` | `'Username'` | - |
| `placeholder` | `string` | `'Max Leiter'` | - |
| `hint` | `string` | `'Choose a unique username for your account.'` | - |
| `errorMessage` | `string` | `''` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `showCharacterCount` | `boolean` | `false` | - |
| `maxLength` | `number` | `200` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
