# TableBodyCell

A reusable body cell container for table rows. It hosts a selectable Table Cell Value component so each column can display the appropriate content type while preserving consistent spacing and alignment.

## When to Use

- Use inside Table Body Row when building data rows with text, badges, actions, status, product, or other supported cell content.

## Usage Guidelines

- Keep one content type per cell.
- Choose a cell-value variant that matches the data semantics.
- Keep content concise; use truncation or a wider column for long values.
- Maintain consistent alignment for cells in the same column.

## Live Preview & Usage

<ComponentPreview name="TableBodyCell" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
