# Tooltip

Tooltip provides brief contextual information about a UI element without interrupting the user’s workflow.

## When to Use

- Explain unfamiliar icons, controls, or abbreviated labels.
- Add helpful context that is useful but not essential to completing a task.
- Reveal supporting information on hover, keyboard focus, or a short press.
- Do not use for critical instructions, validation errors, or content users must remember.

## Usage Guidelines

- Keep the message concise—prefer a short phrase or one sentence.
- Place the tooltip close to its trigger without covering important content.
- Choose the position with the most available space; avoid clipping at viewport edges.
- Keep terminology direct and consistent with the trigger label.
- Avoid interactive controls, links, or long-form content inside a tooltip.
- Ensure the same information is available to keyboard and touch users.

## Live Preview & Usage

<ComponentPreview name="Tooltip" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `text` | `string` | `''` | - |
| `textContent` | `string` | `''` | - |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | top, bottom, left, right |
| `id` | `string` | `'tooltip'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
