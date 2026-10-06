# TableHeaderRow

Composable part of TableHeaderRow. Consumer owns content, order and repetition.
## Composition

Root: `TableHeaderRow`. Parts: `TableHeaderRow`, `TableHeaderCell`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { TableHeaderRow } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import TableHeaderRow from '@dwlhm/ui-svelte/TableHeaderRow.svelte'
```

```vue [Vue 3]
<template>
  <TableHeaderRow />
</template>

<script setup lang="ts">
import { TableHeaderRow } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <TableHeaderRow />
</template>

<script>
import { TableHeaderRow } from '@dwlhm/ui-vue2'

export default {
  components: { TableHeaderRow }
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
import { TableHeaderRow } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import TableHeaderRow from '@dwlhm/ui-svelte/TableHeaderRow.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { TableHeaderRow } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { TableHeaderRow } from '@dwlhm/ui-vue2'

export default {
  components: {
    TableHeaderRow
  }
}
</script>
```
