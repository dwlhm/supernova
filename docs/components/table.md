# Table

Composable part of Table. Consumer owns content, order and repetition.
## Composition

Root: `Table`. Parts: `Table`, `TableHeader`, `TableBody`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.

### Static composition

```tsx
import { Table, TableHeader, TableBody, TableHeaderRow, TableHeaderCell, TableBodyRow, TableCell } from '@dwlhm/ui-react';
<Table><TableHeader><TableHeaderRow><TableHeaderCell>Name</TableHeaderCell></TableHeaderRow></TableHeader><TableBody><TableBodyRow><TableCell>Product</TableCell></TableBodyRow></TableBody></Table>
```

### Consumer loop

```tsx
import { Table, TableHeader, TableBody, TableHeaderRow, TableHeaderCell, TableBodyRow, TableCell } from '@dwlhm/ui-react';
<Table>
  <TableHeader><TableHeaderRow>{columns.map(column => <TableHeaderCell key={column.id}>{column.label}</TableHeaderCell>)}</TableHeaderRow></TableHeader>
  <TableBody>{rows.map(row => <TableBodyRow key={row.id}>{columns.map(column => <TableCell key={column.id}>{row[column.id]}</TableCell>)}</TableBodyRow>)}</TableBody>
</Table>
```


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { Table } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Table from '@dwlhm/ui-svelte/Table.svelte'
```

```vue [Vue 3]
<template>
  <Table />
</template>

<script setup lang="ts">
import { Table } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Table />
</template>

<script>
import { Table } from '@dwlhm/ui-vue2'

export default {
  components: { Table }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Table } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Table from '@dwlhm/ui-svelte/Table.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Table } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Table } from '@dwlhm/ui-vue2'

export default {
  components: {
    Table
  }
}
</script>
```
