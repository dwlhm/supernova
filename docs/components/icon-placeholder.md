# IconPlaceholder

Placeholder icon used as the default content for an instance-swap icon property.

## When to Use

- Use this component while configuring or previewing an icon slot before replacing it with the intended icon. It is not intended to appear in production UI.

## Usage Guidelines

- Replace it with an icon that matches the action or content.
- Keep the icon size and alignment defined by the parent component.
- Avoid using the placeholder as a meaningful visual indicator.

## Live Preview & Usage

<ComponentPreview name="IconPlaceholder" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `number` | `12` | - |
| `ariaLabel` | `string` | `'Placeholder icon'` | - |
| `className` | `string` | `''` | - |
