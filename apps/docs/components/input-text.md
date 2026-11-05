# InputText

A single-line input for collecting short-form information such as names, titles, email addresses, search terms, or other concise values.

WHEN TO USE
• Use when the expected value fits on one line.
• Use for short, structured, or predictable information.
• Use a text area when users may need to enter multiple lines.

USAGE GUIDELINES
• Use a persistent, descriptive label.
• Match the input type and keyboard to the expected value in implementation.
• Use placeholder text as an example only.
• Provide actionable validation feedback and preserve the entered value.
• Use leading or trailing icons only when they clarify meaning or provide a relevant action.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Placeholder text — Example shown while empty.
• Hint/Error text — Supporting guidance or validation message.
• Character Count — Current and maximum character count.
• Show required — Toggles the required indicator.
• Icon — Selects the icon used in the icon slot.
• Show Character Count — Toggles the character count.
• Show hint — Toggles supporting or error text.
• Show left icon / Show right icon — Toggles leading and trailing icons.

## Live Preview & Usage

<FrameworkPreview name="InputText" />

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Character Count` | `text` | `0 / 200` | - |
| `Hint/Error text` | `text` | `Choose a unique username for your account.` | - |
| `Icon` | `instance_swap` | `2375:99747` | - |
| `Label text` | `text` | `Username` | - |
| `Placeholder text` | `text` | `Max Leiter` | - |
| `Show Character Count` | `boolean` | `false` | - |
| `Show hint` | `boolean` | `true` | - |
| `Show label` | `boolean` | `true` | - |
| `Show left icon` | `boolean` | `false` | - |
| `Show required` | `boolean` | `true` | - |
| `Show right icon` | `boolean` | `true` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
