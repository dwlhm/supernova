# Badge

A compact label used to communicate status, category, or supporting metadata without interrupting the main content.


When to useShow a concise status, classification, or attribute.
Help users scan and compare items quickly.
Use alongside primary content, not as a replacement for buttons or alerts.


Usage guidelinesKeep labels short, clear, and sentence case.
Choose the variant by meaning, not decoration.
Use one semantic meaning consistently across the product.
Avoid placing several high-emphasis badges next to each other.
Do not use a Badge for interactive actions.


PropertiesVariant: primary, secondary, destructive, success, warning, info, or outline.
Label: Editable text displayed inside the badge.

## Live Preview & Usage

<FrameworkPreview name="Badge" />

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Label` | `text` | `Badge` | - |
| `Variant` | ``primary` \| `secondary` \| `destructive` \| `success` \| `warning` \| `info` \| `outline`` | `primary` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
