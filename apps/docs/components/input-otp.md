# InputOTP

A one-time password input for entering short verification or authentication codes.

WHEN TO USE
• Use in sign-in, account recovery, transaction approval, or identity-verification flows.
• Use only for temporary codes sent through a trusted channel.
• Use a standard text input for permanent passwords or recovery keys.

USAGE GUIDELINES
• State where the code was sent without exposing sensitive contact details.
• Allow paste and automatic code retrieval when supported.
• Move focus naturally between cells and support keyboard correction.
• Show expiration and resend guidance near the input.
• Use a clear error message for incomplete, expired, or incorrect codes.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.

## Live Preview & Usage

<FrameworkPreview name="InputOTP" />

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Hint/Error text` | `text` | `Please enter the one-time password sent to your phone.` | - |
| `Label text` | `text` | `Label` | - |
| `Show hint` | `boolean` | `true` | - |
| `Show label` | `boolean` | `true` | - |
| `Show required` | `boolean` | `false` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
