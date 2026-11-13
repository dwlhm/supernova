# Spinner

Spinner

An indeterminate loading indicator that communicates an ongoing process when progress cannot be measured. Available in four sizes for different interface densities.

## When to Use

- Use while content, data, or an action is processing and the completion percentage is unknown.
- Use inside buttons or controls to confirm that an action has started.
- Use in content regions to indicate that information is being fetched or refreshed.
- For measurable or long-running tasks, use a progress indicator with explicit progress instead.

## Usage Guidelines

- Choose the smallest size that remains clear in its context; Size 24 is the default recommendation.
- Keep the spinner centered within its container and preserve the container dimensions to avoid layout shifts.
- Maintain sufficient contrast against the background.
- When replacing button content, preserve the button width and accessible label.
- Add concise supporting text when the loading context is not obvious or the wait may be prolonged.
- Do not use multiple prominent spinners in the same region.

## Live Preview & Usage

<ComponentPreview name="Spinner" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'12' \| '16' \| '24' \| '32'` | `'24'` | 12, 16, 24, 32 |
| `ariaLabel` | `string` | `'Loading'` | - |
| `className` | `string` | `''` | - |

## Design Tokens & Color Customization

`Spinner` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `text-primary-default` | `--color-primary-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Spinner className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Spinner className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
