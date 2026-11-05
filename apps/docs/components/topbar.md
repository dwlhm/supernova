# Topbar

A horizontal application header that provides a consistent area for page-level or global controls through a flexible content slot.


When to use
Use at the top of authenticated application screens that require persistent global or contextual actions.
Use to host content such as page context, search, notifications, help, or account actions when those controls need consistent placement.


Usage guidelines
Place content in Topbar Content and prioritize the most important actions.
Keep the bar concise; move infrequent actions into menus when space is limited.
Maintain predictable control order across screens.
Avoid duplicating navigation or actions already provided by the sidebar or page header.


Properties
Topbar Content — Slot for contextual or global header content.

## Live Preview & Usage

<FrameworkPreview name="Topbar" />

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
