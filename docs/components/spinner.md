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
| `size` | `'12' \| '16' \| '24' \| '32'` | `'12'` | 12, 16, 24, 32 |
| `label` | `string` | `'Loading'` | - |
| `className` | `string` | `''` | - |
