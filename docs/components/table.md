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
| `state` | `'default' \| 'empty'` | `'default'` | default, empty |
| `columns` | `TableColumn[]` | `[]` | - |
| `rows` | `TableRowData[]` | `[]` | - |
| `caption` | `string` | `'Data table'` | - |
| `showCheckbox` | `boolean` | `false` | - |
| `showNo` | `boolean` | `false` | - |
| `showPagination` | `boolean` | `true` | - |
| `currentPage` | `number` | `2` | - |
| `totalPages` | `number` | `10` | - |
| `pageSize` | `number` | `10` | - |
| `rowsPerPageLabel` | `string` | `'Rows per page'` | - |
| `emptyTitle` | `string` | `'No Data Available'` | - |
| `emptyBody` | `string` | `"There's nothing here yet. Try adding some data or adjusting your filters."` | - |
| `emptyCtaLabel` | `string` | `'Add Data'` | - |
| `showEmptyCta` | `boolean` | `true` | - |
| `showEmptyIcon` | `boolean` | `true` | - |
| `showEmptyTitle` | `boolean` | `true` | - |
| `showEmptyDescription` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onRowSelect` | `(rowId: string, checked: boolean) => void` | `-` | - |
| `onSelectAll` | `(checked: boolean) => void` | `-` | - |
| `onPageChange` | `(page: number) => void` | `-` | - |
| `onPageSizeChange` | `(pageSize: number) => void` | `-` | - |
| `onEmptyCtaClick` | `() => void` | `-` | - |
