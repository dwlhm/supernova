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
| `text` | `string` | `'Label'` | - |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | top, bottom, left, right |
| `trigger` | `'hover' \| 'click'` | `'hover'` | hover, click |
| `open` | `boolean` | `-` | - |
| `onOpenChange` | `(open: boolean) => void` | `-` | - |
| `id` | `string` | `'tooltip'` | - |
| `contentClassName` | `string` | `''` | - |
| `dotClassName` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

## Design Tokens & Color Customization

`Tooltip` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `contentClassName` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via contentClassName
<Tooltip contentClassName="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Tooltip contentClassName="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
