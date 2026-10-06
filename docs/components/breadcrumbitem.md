# BreadcrumbItem

Composable part of Breadcrumb. Consumer owns content, order and repetition.
## Composition

Root: `Breadcrumb`. Parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { BreadcrumbItem } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import BreadcrumbItem from '@dwlhm/ui-svelte/BreadcrumbItem.svelte'
```

```vue [Vue 3]
<template>
  <BreadcrumbItem />
</template>

<script setup lang="ts">
import { BreadcrumbItem } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <BreadcrumbItem />
</template>

<script>
import { BreadcrumbItem } from '@dwlhm/ui-vue2'

export default {
  components: { BreadcrumbItem }
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
import { BreadcrumbItem } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import BreadcrumbItem from '@dwlhm/ui-svelte/BreadcrumbItem.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { BreadcrumbItem } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { BreadcrumbItem } from '@dwlhm/ui-vue2'

export default {
  components: {
    BreadcrumbItem
  }
}
</script>
```
