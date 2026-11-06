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
| `layout` | `'row' \| 'stacked'` | `'row'` | row, stacked |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `status` | `'none' \| 'success' \| 'warning' \| 'destructive' \| 'info'` | `'none'` | none, success, warning, destructive, info |
| `imageSrc` | `string` | `''` | - |
| `imageAlt` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
