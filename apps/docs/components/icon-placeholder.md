# IconPlaceholder

Placeholder icon used as the default content for an instance-swap icon property.

When to use
Use this component while configuring or previewing an icon slot before replacing it with the intended icon. It is not intended to appear in production UI.

Usage guidelines
• Replace it with an icon that matches the action or content.
• Keep the icon size and alignment defined by the parent component.
• Avoid using the placeholder as a meaningful visual indicator.

Properties
This component has no exposed properties.

## Live Preview & Usage

<FrameworkPreview name="IconPlaceholder" />

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Decorative Icons**: When used purely for visual enhancement, apply `aria-hidden="true"` to hide from assistive technologies.
- **Standalone / Meaningful Icons**: When an icon conveys semantic meaning or triggers an action, supply an accessible name using `aria-label` or an adjacent visually hidden label.
- **Contrast**: Non-text elements must satisfy a minimum 3:1 contrast ratio against adjacent colors per WCAG 2.1 (1.4.11 Non-text Contrast).
