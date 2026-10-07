# TableCell

Composable part of TableBodyRow. Consumer owns content, order and repetition.
## Composition

Root: `TableBodyRow`. Parts: `TableBodyRow`, `TableCell`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { TableCell } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import TableCell from '@dwlhm/ui-svelte/TableCell.svelte'
```

```vue [Vue 3]
<template>
  <TableCell />
</template>

<script setup lang="ts">
import { TableCell } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <TableCell />
</template>

<script>
import { TableCell } from '@dwlhm/ui-vue2'

export default {
  components: { TableCell }
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
import { TableCell } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import TableCell from '@dwlhm/ui-svelte/TableCell.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { TableCell } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { TableCell } from '@dwlhm/ui-vue2'

export default {
  components: {
    TableCell
  }
}
</script>
```
