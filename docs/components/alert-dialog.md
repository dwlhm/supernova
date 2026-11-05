# AlertDialog

Alert dialog asks users to explicitly confirm an important, risky, or difficult-to-reverse action before it is performed.

## When to Use

- Before destructive actions such as deleting an account, data, or access.
- When an action is permanent or may affect multiple people.
- When users need to understand the consequences before proceeding.

## Usage Guidelines

- Use a clear heading that states the decision the user must make.
- Keep the description concise and explain the consequence and affected item.
- Use specific action labels; avoid ambiguous labels such as “OK”.
- Place the safe or cancel action first and the primary action on the right.
- Hide the description only when the heading provides sufficient context. Keep it visible for high-risk actions.
- Use a destructive button style when the confirmed action is destructive.

## Live Preview & Usage

<ComponentPreview name="AlertDialog" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `true` | - |
| `inline` | `boolean` | `false` | - |
| `heading` | `string` | `'Are you absolutely sure?'` | - |
| `description` | `string` | `'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'` | - |
| `showDescription` | `boolean` | `true` | - |
| `showCloseButton` | `boolean` | `true` | - |
| `cancelLabel` | `string` | `'Cancel'` | - |
| `confirmLabel` | `string` | `'Continue'` | - |
| `destructive` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onCancel` | `() => void` | `-` | - |
| `onConfirm` | `() => void` | `-` | - |
