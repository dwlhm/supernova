# InputDropdown

A selection input that lets users choose one option from a predefined list while keeping the form compact.

WHEN TO USE
• Use when available values are known in advance.
• Use when displaying all choices at once would take too much space.
• Use radio buttons for a small set of choices that should remain visible.

USAGE GUIDELINES
• Use a clear label and a meaningful placeholder such as “Choose department.”
• Order options logically and keep labels concise.
• Enable search for long or difficult-to-scan lists.
• Show the selected option in the Filled state.
• Provide specific error guidance and never rely on color alone.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Placeholder text — Prompt shown before selection.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Icon — Selects the icon used in the icon slot.
• Show hint — Toggles supporting or error text.
• Show left icon / Show right icon — Toggles leading and trailing icons.
• List Value — Slot for dropdown options.
• Show Search Input — Toggles search within the option list.

## Live Preview & Usage

<FrameworkPreview name="InputDropdown" />

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Hint/Error text` | `text` | `Select your department or area of work.` | - |
| `Icon` | `instance_swap` | `2487:55330` | - |
| `Label text` | `text` | `Department` | - |
| `List Value` | `slot` | - | Slot for the dropdown option list. Insert option items in a logical order and keep labels concise. |
| `Placeholder text` | `text` | `Choose department` | - |
| `Show Character Count` | `boolean` | `true` | - |
| `Show Search Input` | `boolean` | `true` | - |
| `Show hint` | `boolean` | `false` | - |
| `Show label` | `boolean` | `true` | - |
| `Show left icon` | `boolean` | `false` | - |
| `Show required` | `boolean` | `false` | - |
| `Show right icon` | `boolean` | `true` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
