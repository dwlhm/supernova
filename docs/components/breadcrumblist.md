# BreadcrumbList

Composable part of Breadcrumb. Consumer owns content, order and repetition.
## Composition

Root: `Breadcrumb`. Parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { BreadcrumbList } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import BreadcrumbList from '@dwlhm/ui-svelte/BreadcrumbList.svelte'
```

```vue [Vue 3]
<template>
  <BreadcrumbList />
</template>

<script setup lang="ts">
import { BreadcrumbList } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <BreadcrumbList />
</template>

<script>
import { BreadcrumbList } from '@dwlhm/ui-vue2'

export default {
  components: { BreadcrumbList }
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
import { BreadcrumbList } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import BreadcrumbList from '@dwlhm/ui-svelte/BreadcrumbList.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { BreadcrumbList } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { BreadcrumbList } from '@dwlhm/ui-vue2'

export default {
  components: {
    BreadcrumbList
  }
}
</script>
```
