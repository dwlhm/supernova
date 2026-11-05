# InputFileInput

A compact file input that lets users browse for and select a single file from their device.

WHEN TO USE
• Use when a form requires one document or attachment.
• Use when upload is secondary to the main task and a compact control is preferred.
• Use a drop zone when uploading is a primary task or benefits from a larger target.

USAGE GUIDELINES
• State accepted formats and maximum size before selection.
• Display the selected file name clearly.
• Allow users to replace or remove the selected file.
• Validate type and size with a specific error message.
• Keep the browse action keyboard accessible.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Button text — Label for the file-selection action.
• File name — Empty-state or selected-file text.
• Hint/Error text — Format guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.

## Live Preview & Usage

<FrameworkPreview name="InputFileInput" />

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Button text` | `text` | `Choose File` | - |
| `File name` | `text` | `No file chosen` | - |
| `Hint/Error text` | `text` | `Supported formats: PNG, JPG, or PDF.` | - |
| `Label text` | `text` | `Picture` | - |
| `Show hint` | `boolean` | `true` | - |
| `Show label` | `boolean` | `true` | - |
| `Show required` | `boolean` | `false` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
