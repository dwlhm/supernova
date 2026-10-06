# TableBodyRow

Composable part of TableBodyRow. Consumer owns content, order and repetition.
## Composition

Root: `TableBodyRow`. Parts: `TableBodyRow`, `TableCell`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { TableBodyRow } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import TableBodyRow from '@dwlhm/ui-svelte/TableBodyRow.svelte'
```

```vue [Vue 3]
<template>
  <TableBodyRow />
</template>

<script setup lang="ts">
import { TableBodyRow } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <TableBodyRow />
</template>

<script>
import { TableBodyRow } from '@dwlhm/ui-vue2'

export default {
  components: { TableBodyRow }
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
import { TableBodyRow } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import TableBodyRow from '@dwlhm/ui-svelte/TableBodyRow.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { TableBodyRow } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { TableBodyRow } from '@dwlhm/ui-vue2'

export default {
  components: {
    TableBodyRow
  }
}
</script>
```
