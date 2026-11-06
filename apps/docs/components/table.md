# Table

A configurable data-table component with populated and empty states, optional row selection, and optional row numbering.

## When to Use

- Use to present structured records that users need to scan and compare across consistent columns. Use the Empty state when no records are available.

## Usage Guidelines

- Use clear column labels and keep cell content consistent by column.
- Show only the columns required for the task.
- Enable checkboxes only when bulk selection or row selection is supported.
- Enable row numbers only when sequential references are useful.
- Use the Empty state for true no-data outcomes and provide a relevant next action when possible.
- For complex sorting, filtering, pagination, or responsive behavior, pair this component with the appropriate surrounding controls and patterns.

## Live Preview & Usage

<ComponentPreview name="Table" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `caption` | `string` | `'Data table'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TableEmpty`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `''` | - |
| `description` | `string` | `''` | - |
| `ctaLabel` | `string` | `''` | - |
| `showIcon` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onCtaClick` | `() => void` | `-` | - |

### `TableHeaderCell`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
