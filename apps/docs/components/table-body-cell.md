# TableBodyCell

Description
A reusable body cell container for table rows. It hosts a selectable Table Cell Value component so each column can display the appropriate content type while preserving consistent spacing and alignment.


When to use
Use inside Table Body Row when building data rows with text, badges, actions, status, product, or other supported cell content.


Usage guidelines
Keep one content type per cell.
Choose a cell-value variant that matches the data semantics.
Keep content concise; use truncation or a wider column for long values.
Maintain consistent alignment for cells in the same column.


Properties
Cell Value — Swaps the nested Table Cell Value component used by the cell.

## Live Preview

<FrameworkPreview name="TableBodyCell" />

## Usage

::: code-group

```tsx [React]
import { TableBodyCell } from './TableBodyCell';

export default function Example() {
  return (
    <TableBodyCell>
      TableBodyCell
    </TableBodyCell>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableBodyCell } from './TableBodyCell';
</script>

<template>
  <TableBodyCell>
    TableBodyCell
  </TableBodyCell>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import TableBodyCell from './TableBodyCell.svelte';
</script>

<TableBodyCell>
  TableBodyCell
</TableBodyCell>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TableBodyCellComponent } from './table-body-cell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableBodyCellComponent],
  template: `
    <app-table-body-cell>
      TableBodyCell
    </app-table-body-cell>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
