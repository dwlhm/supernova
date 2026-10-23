# TableCellValue

Description
A flexible set of content patterns for table cells, including text, media, selection controls, status, links, badges, actions, products, and custom slot content.


When to use
Use within Table Body Cell to represent the semantic type of data or control required by a column.


Usage guidelines
Select the Type variant based on meaning, not visual preference.
Keep repeated cells in a column consistent.
Use interactive variants only when the table supports that action.
Keep labels brief and provide accessible names for icon-only actions.
Use Slot only when none of the standard variants fit.


Properties
Type — Selects the cell-value pattern.
Value — Sets the primary displayed text where supported.
Show Affiliate, Show Komlabs, Show Raja Ongkir, Show Komads, Show Komcards, Show Komchat, Show Komclass, Show Kompack, Show Komplace, Show Komship, Show Komtim, Show Komed, Show Komstore, Show Komerce — Controls product marks in the Product variant.
Show Edit, Show Delete, Show More — Controls visible actions in Action (Icon).
Slot — Replaces the custom content in the Slot variant.

## Live Preview

<FrameworkPreview name="TableCellValue" />

## Usage

::: code-group

```tsx [React]
import { TableCellValue } from './TableCellValue';

export default function Example() {
  return (
    <TableCellValue show Affiliate show Delete>
      TableCellValue
    </TableCellValue>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TableCellValue } from './TableCellValue';
</script>

<template>
  <TableCellValue show Affiliate show Delete>
    TableCellValue
  </TableCellValue>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import TableCellValue from './TableCellValue.svelte';
</script>

<TableCellValue show Affiliate show Delete>
  TableCellValue
</TableCellValue>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TableCellValueComponent } from './table-cell-value.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableCellValueComponent],
  template: `
    <app-table-cell-value show Affiliate show Delete>
      TableCellValue
    </app-table-cell-value>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Show Affiliate` | `boolean` | `true` | - |
| `Show Delete` | `boolean` | `true` | - |
| `Show Edit` | `boolean` | `true` | - |
| `Show Komads` | `boolean` | `true` | - |
| `Show Komcards` | `boolean` | `true` | - |
| `Show Komchat` | `boolean` | `true` | - |
| `Show Komclass` | `boolean` | `true` | - |
| `Show Komed` | `boolean` | `true` | - |
| `Show Komerce` | `boolean` | `true` | - |
| `Show Komlabs` | `boolean` | `true` | - |
| `Show Kompack` | `boolean` | `true` | - |
| `Show Komplace` | `boolean` | `true` | - |
| `Show Komship` | `boolean` | `true` | - |
| `Show Komstore` | `boolean` | `true` | - |
| `Show Komtim` | `boolean` | `true` | - |
| `Show More` | `boolean` | `true` | - |
| `Show Raja Ongkir` | `boolean` | `true` | - |
| `Slot` | `slot` | - | Custom component content used by the Slot variant. Prefer a standard cell type when one is available. |
| `Type` | ``Text` \| `Image Text` \| `Image` \| `Action` \| `Badge` \| `Stacked Text` \| `Link` \| `Checkbox` \| `Toggle` \| `Avatar Text` \| `Status` \| `Number` \| `Action (Icon)` \| `Product` \| `Slot`` | `Text` | - |
| `Value` | `text` | `Cell Value` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
