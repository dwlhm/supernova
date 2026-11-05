# TableCheckboxBodyCell

Description
A compact body cell containing a row-selection checkbox.


When to use
Use when users can select individual rows for bulk actions or comparison.


Usage guidelines
Place it consistently at the leading edge of each selectable row.
Keep selection state synchronized with the header checkbox.
Do not use it for an editable boolean data field.


Properties
Checkbox state — Configure the nested checkbox instance.

## Live Preview & Usage

<FrameworkPreview name="TableCheckboxBodyCell" />

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
