# Toast

A brief, non-intrusive notification that communicates the status of an action or process without interrupting the user’s workflow.

## When to Use

- Confirm that an action completed successfully.
- Report an error or warn about a condition that may require attention.
- Provide short, time-sensitive system information.
- Use for feedback that does not require an immediate decision. For blocking or complex messages, use an alert or dialog instead.

## Usage Guidelines

- Keep the title concise and action-oriented; add a description only when extra context is necessary.
- Choose the Type that matches the message intent, not its visual prominence.
- Use one optional action for a clear, reversible, or follow-up task.
- Show the close button when users may need to dismiss a persistent toast.
- Show the timestamp only when message recency is useful.
- Avoid stacking many toasts, duplicating inline validation, or using toasts for critical information that must remain visible.

## Live Preview & Usage

<ComponentPreview name="Toast" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `'default' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'default'` | default, success, error, warning, info |
| `title` | `string` | `'Toast Text'` | - |
| `description` | `string` | `'Toast description text here'` | - |
| `showDescription` | `boolean` | `false` | - |
| `actionText` | `string` | `'Undo'` | - |
| `showAction` | `boolean` | `false` | - |
| `showClose` | `boolean` | `false` | - |
| `timestamp` | `string` | `'11.29.45 AM'` | - |
| `showTimestamp` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onAction` | `() => void` | `-` | - |
| `onClose` | `() => void` | `-` | - |
