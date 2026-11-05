# TableBodyRow

Description
A reusable table body row with up to ten configurable data columns.


When to use
Use for each data record in the default table state.


Usage guidelines
Keep the visible columns synchronized with Table Header Row.
Use the same cell-value type and alignment throughout each column.
Preserve a consistent row height across a table.
Place row-level actions in the designated actions column.


Properties
Show Column 1–10 — Shows or hides each data column. Columns 1–5 are visible by default; columns 6–10 are optional.

## Live Preview & Usage

<FrameworkPreview name="TableBodyRow" />

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
