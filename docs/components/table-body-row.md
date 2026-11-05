# TableBodyRow

A reusable table body row with up to ten configurable data columns.

## When to Use

- Use for each data record in the default table state.

## Usage Guidelines

- Keep the visible columns synchronized with Table Header Row.
- Use the same cell-value type and alignment throughout each column.
- Preserve a consistent row height across a table.
- Place row-level actions in the designated actions column.

## Live Preview & Usage

<ComponentPreview name="TableBodyRow" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `rowId` | `string` | `''` | - |
| `cells` | `TableCellInput[]` | `[]` | - |
| `columns` | `TableColItem[]` | `[]` | - |
| `no` | `number` | `1` | - |
| `showNo` | `boolean` | `false` | - |
| `showCheckbox` | `boolean` | `false` | - |
| `checked` | `boolean` | `false` | - |
| `checkboxAriaLabel` | `string` | `'Select row'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onSelect` | `(rowId: string, checked: boolean) => void` | `-` | - |
