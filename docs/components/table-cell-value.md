# TableCellValue

A flexible set of content patterns for table cells, including text, media, selection controls, status, links, badges, actions, products, and custom slot content.

## When to Use

- Use within Table Body Cell to represent the semantic type of data or control required by a column.

## Usage Guidelines

- Compose semantic child components or pass cell values based on meaning, not visual preference.
- Keep repeated cells in a column consistent.
- Use interactive variants only when the table supports that action.
- Keep labels brief and provide accessible names for icon-only actions.
- Pass custom child components via children/slots when needed.

## Live Preview & Usage

<ComponentPreview name="TableCellValue" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `'Cell Value'` | - |
| `secondaryValue` | `string` | `''` | - |
| `badgeLabel` | `string` | `''` | - |
| `buttonLabel` | `string` | `''` | - |
| `statusLabel` | `string` | `''` | - |
| `imageSrc` | `string` | `''` | - |
| `avatarInitials` | `string` | `''` | - |
| `href` | `string` | `''` | - |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
