# TableHeaderRow

Description
A reusable table header row with up to ten configurable columns.


When to use
Use at the top of a data table to label and align its columns. Omit it only when the surrounding context makes every column unambiguous.


Usage guidelines
Match visible header columns to the visible columns in every body row.
Use short, descriptive labels.
Keep column order and widths consistent with the body rows.
Avoid wrapping header labels when a shorter label is available.


Properties
Show Column 1–10 — Shows or hides each header column. Columns 1–5 are visible by default; columns 6–10 are optional.

## Live Preview & Usage

<FrameworkPreview name="TableHeaderRow" />

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
