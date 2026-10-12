# Table

Description
A configurable data-table component with populated and empty states, up to ten columns and ten rows, optional row selection, and optional row numbering.


When to use
Use to present structured records that users need to scan and compare across consistent columns. Use the Empty state when no records are available.


Usage guidelines
Use clear column labels and keep cell content consistent by column.
Show only the columns required for the task.
Enable checkboxes only when bulk selection or row selection is supported.
Enable row numbers only when sequential references are useful.
Use the Empty state for true no-data outcomes and provide a relevant next action when possible.
For complex sorting, filtering, pagination, or responsive behavior, pair this component with the appropriate surrounding controls and patterns.


Properties
State — Switches between Default and Empty.
Show Column 1–10 — Shows or hides table columns.
Show Row 1–10 — Shows or hides data rows.
Show Checkbox — Shows or hides the selection column.
Show No — Shows or hides the row-number column.
Title — Sets the empty-state heading.
Body — Sets the empty-state supporting text.
CTA Label — Sets the empty-state action label.
Show Icon — Shows or hides the empty-state icon.
Show Title — Shows or hides the empty-state heading.
Show Description — Shows or hides the empty-state supporting text.
Show CTA — Shows or hides the empty-state action.
Icon — Swaps the empty-state icon.

## Usage

::: code-group

```tsx [React]
import { Table } from './Table';

export default function Example() {
  return (
    <Table body="There's nothing here yet. Try adding some data or adjusting your filters." cTA Label="Add Data">
      Table
    </Table>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Table } from './Table';
</script>

<template>
  <Table body="There's nothing here yet. Try adding some data or adjusting your filters." cTA Label="Add Data">
    Table
  </Table>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Table from './Table.svelte';
</script>

<Table body="There's nothing here yet. Try adding some data or adjusting your filters." cTA Label="Add Data">
  Table
</Table>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TableComponent } from './table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableComponent],
  template: `
    <app-table body="There's nothing here yet. Try adding some data or adjusting your filters." cTA Label="Add Data">
      Table
    </app-table>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Body` | `text` | `There's nothing here yet. Try adding some data or adjusting your filters.` | - |
| `CTA Label` | `text` | `Add Data` | - |
| `Icon` | `instance_swap` | `2375:103015` | - |
| `Show CTA` | `boolean` | `true` | - |
| `Show Checkbox` | `boolean` | `false` | - |
| `Show Column 1` | `boolean` | `true` | - |
| `Show Column 10` | `boolean` | `false` | - |
| `Show Column 2` | `boolean` | `true` | - |
| `Show Column 3` | `boolean` | `true` | - |
| `Show Column 4` | `boolean` | `true` | - |
| `Show Column 5` | `boolean` | `true` | - |
| `Show Column 6` | `boolean` | `false` | - |
| `Show Column 7` | `boolean` | `false` | - |
| `Show Column 8` | `boolean` | `false` | - |
| `Show Column 9` | `boolean` | `false` | - |
| `Show Description` | `boolean` | `true` | - |
| `Show Icon` | `boolean` | `true` | - |
| `Show No` | `boolean` | `false` | - |
| `Show Row 1` | `boolean` | `true` | - |
| `Show Row 10` | `boolean` | `true` | - |
| `Show Row 2` | `boolean` | `true` | - |
| `Show Row 3` | `boolean` | `true` | - |
| `Show Row 4` | `boolean` | `true` | - |
| `Show Row 5` | `boolean` | `true` | - |
| `Show Row 6` | `boolean` | `false` | - |
| `Show Row 7` | `boolean` | `true` | - |
| `Show Row 8` | `boolean` | `true` | - |
| `Show Row 9` | `boolean` | `true` | - |
| `Show Title` | `boolean` | `true` | - |
| `State` | ``Default` \| `Empty`` | `Default` | - |
| `Title` | `text` | `No Data Available` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
