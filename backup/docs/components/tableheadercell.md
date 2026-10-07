# TableHeaderCell

Composable part of TableHeaderRow. Consumer owns content, order and repetition.
## Composition

Root: `TableHeaderRow`. Parts: `TableHeaderRow`, `TableHeaderCell`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { TableHeaderCell } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import TableHeaderCell from '@dwlhm/ui-svelte/TableHeaderCell.svelte'
```

```vue [Vue 3]
<template>
  <TableHeaderCell />
</template>

<script setup lang="ts">
import { TableHeaderCell } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <TableHeaderCell />
</template>

<script>
import { TableHeaderCell } from '@dwlhm/ui-vue2'

export default {
  components: { TableHeaderCell }
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
import { TableHeaderCell } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import TableHeaderCell from '@dwlhm/ui-svelte/TableHeaderCell.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { TableHeaderCell } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { TableHeaderCell } from '@dwlhm/ui-vue2'

export default {
  components: {
    TableHeaderCell
  }
}
</script>
```
