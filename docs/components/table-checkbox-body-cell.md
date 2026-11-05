# TableCheckboxBodyCell

A compact body cell containing a row-selection checkbox.

## When to Use

- Use when users can select individual rows for bulk actions or comparison.

## Usage Guidelines

- Place it consistently at the leading edge of each selectable row.
- Keep selection state synchronized with the header checkbox.
- Do not use it for an editable boolean data field.

## Live Preview & Usage

<ComponentPreview name="TableCheckboxBodyCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `false` | - |
| `rowId` | `string` | `''` | - |
| `ariaLabel` | `string` | `'Select row'` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(rowId: string, checked: boolean) => void` | `-` | - |
