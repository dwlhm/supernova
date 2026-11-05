# TableNoBodyCell

Description
A compact body cell that displays a row number.


When to use
Use when rows need a visible sequential reference independent of the record's data.


Usage guidelines
Keep numbering sequential after sorting, filtering, or pagination according to product requirements.
Align values consistently in the number column.
Use with Table No Header Cell.


Properties
No — Sets the displayed row number.

## Live Preview & Usage

<FrameworkPreview name="TableNoBodyCell" />

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
