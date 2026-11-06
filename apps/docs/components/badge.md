# Badge

A compact label used to communicate status, category, or supporting metadata without interrupting the main content.

## When to Use

- Show a concise status, classification, or attribute.
- Help users scan and compare items quickly.
- Use alongside primary content, not as a replacement for buttons or alerts.

## Usage Guidelines

- Keep labels short, clear, and sentence case.
- Choose the variant by meaning, not decoration.
- Use one semantic meaning consistently across the product.
- Avoid placing several high-emphasis badges next to each other.
- Do not use a Badge for interactive actions.

## Live Preview & Usage

<ComponentPreview name="Badge" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'success' \| 'warning' \| 'info' \| 'outline'` | `'primary'` | primary, secondary, destructive, success, warning, info, outline |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
