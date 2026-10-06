# TableHeader

Composable part of Table. Consumer owns content, order and repetition.
## Composition

Root: `Table`. Parts: `Table`, `TableHeader`, `TableBody`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { TableHeader } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import TableHeader from '@dwlhm/ui-svelte/TableHeader.svelte'
```

```vue [Vue 3]
<template>
  <TableHeader />
</template>

<script setup lang="ts">
import { TableHeader } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <TableHeader />
</template>

<script>
import { TableHeader } from '@dwlhm/ui-vue2'

export default {
  components: { TableHeader }
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
import { TableHeader } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import TableHeader from '@dwlhm/ui-svelte/TableHeader.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { TableHeader } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { TableHeader } from '@dwlhm/ui-vue2'

export default {
  components: {
    TableHeader
  }
}
</script>
```
