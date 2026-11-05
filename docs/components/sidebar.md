# Sidebar

A persistent vertical navigation shell that organizes brand, primary navigation, and account-related content. It supports expanded and collapsed layouts so the navigation can adapt to the available workspace.

## When to Use

- Use as the primary navigation container for desktop application layouts.
- Use the collapsed variant when horizontal space is limited or users need more room for page content.

## Usage Guidelines

- Place product identity or a logo in Brand content.
- Place the primary menu structure in Navigation content.
- Place profile, workspace, or account controls in Account content.
- Keep navigation order and icon meaning consistent between expanded and collapsed states.
- Provide accessible labels or tooltips when labels are hidden.

## Live Preview & Usage

<ComponentPreview name="Sidebar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `expanded` | `boolean` | `false` | - |
| `brand` | `string` | `'Komerce'` | - |
| `accountLabel` | `string` | `'Lionel Messi'` | - |
| `accountMeta` | `string` | `'messi@gmail.com'` | - |
| `accountInitials` | `string` | `'LM'` | - |
| `brandInitials` | `string` | `'K'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
