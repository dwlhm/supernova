# TableHeaderRow

A reusable table header row with up to ten configurable columns.

## When to Use

- Use at the top of a data table to label and align its columns. Omit it only when the surrounding context makes every column unambiguous.

## Usage Guidelines

- Match visible header columns to the visible columns in every body row.
- Use short, descriptive labels.
- Keep column order and widths consistent with the body rows.
- Avoid wrapping header labels when a shorter label is available.

## Live Preview & Usage

<ComponentPreview name="TableHeaderRow" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `columns` | `TableHeaderColumn[]` | `[]` | - |
| `showCheckbox` | `boolean` | `false` | - |
| `showNo` | `boolean` | `false` | - |
| `allSelected` | `boolean` | `false` | - |
| `checkboxAriaLabel` | `string` | `'Select all rows'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onSelectAll` | `(checked: boolean) => void` | `-` | - |
