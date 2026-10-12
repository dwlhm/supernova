# TableNoHeaderCell

Description
A compact header cell for the row-number column.


When to use
Use above Table No Body Cell when the table displays numbered rows.


Usage guidelines
Keep the column narrow and aligned with row numbers.
Use consistently with the table's Show No option.


Properties
No exposed properties.

## Usage

::: code-group

```tsx [React]
import { TableNoHeaderCell } from './TableNoHeaderCell';

export default function Example() {
  return (
    <TableNoHeaderCell>
      TableNoHeaderCell
    </TableNoHeaderCell>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableNoHeaderCell } from './TableNoHeaderCell';
</script>

<template>
  <TableNoHeaderCell>
    TableNoHeaderCell
  </TableNoHeaderCell>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import TableNoHeaderCell from './TableNoHeaderCell.svelte';
</script>

<TableNoHeaderCell>
  TableNoHeaderCell
</TableNoHeaderCell>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TableNoHeaderCellComponent } from './table-no-header-cell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableNoHeaderCellComponent],
  template: `
    <app-table-no-header-cell>
      TableNoHeaderCell
    </app-table-no-header-cell>
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
