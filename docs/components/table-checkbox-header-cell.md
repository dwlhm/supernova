# TableCheckboxHeaderCell

A compact header cell containing the table's selection checkbox.

## When to Use

- Use when the table supports selecting all visible or eligible rows.

## Usage Guidelines

- Pair with Table Checkbox Body Cell in selectable rows.
- Use an indeterminate state when only some eligible rows are selected.
- Disable or omit it when bulk selection is unavailable.

## Live Preview & Usage

<ComponentPreview name="TableCheckboxHeaderCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `false` | - |
| `indeterminate` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `'Select all rows'` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |
