# TableCheckboxHeaderCell

Description
A compact header cell containing the table's selection checkbox.


When to use
Use when the table supports selecting all visible or eligible rows.


Usage guidelines
Pair with Table Checkbox Body Cell in selectable rows.
Use an indeterminate state when only some eligible rows are selected.
Disable or omit it when bulk selection is unavailable.


Properties
Checkbox state — Configure the nested checkbox instance.

## Usage

::: code-group

```tsx [React]
import { TableCheckboxHeaderCell } from './TableCheckboxHeaderCell';

export default function Example() {
  return (
    <TableCheckboxHeaderCell>
      TableCheckboxHeaderCell
    </TableCheckboxHeaderCell>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableCheckboxHeaderCell } from './TableCheckboxHeaderCell';
</script>

<template>
  <TableCheckboxHeaderCell>
    TableCheckboxHeaderCell
  </TableCheckboxHeaderCell>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import TableCheckboxHeaderCell from './TableCheckboxHeaderCell.svelte';
</script>

<TableCheckboxHeaderCell>
  TableCheckboxHeaderCell
</TableCheckboxHeaderCell>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TableCheckboxHeaderCellComponent } from './table-checkbox-header-cell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableCheckboxHeaderCellComponent],
  template: `
    <app-table-checkbox-header-cell>
      TableCheckboxHeaderCell
    </app-table-checkbox-header-cell>
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
