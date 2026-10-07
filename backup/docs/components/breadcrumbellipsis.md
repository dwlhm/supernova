# BreadcrumbEllipsis

Composable part of Breadcrumb. Consumer owns content, order and repetition.
## Composition

Root: `Breadcrumb`. Parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.

The default slot uses "…" when no content is supplied. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { BreadcrumbEllipsis } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import BreadcrumbEllipsis from '@dwlhm/ui-svelte/BreadcrumbEllipsis.svelte'
```

```vue [Vue 3]
<template>
  <BreadcrumbEllipsis />
</template>

<script setup lang="ts">
import { BreadcrumbEllipsis } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <BreadcrumbEllipsis />
</template>

<script>
import { BreadcrumbEllipsis } from '@dwlhm/ui-vue2'

export default {
  components: { BreadcrumbEllipsis }
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
import { BreadcrumbEllipsis } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import BreadcrumbEllipsis from '@dwlhm/ui-svelte/BreadcrumbEllipsis.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { BreadcrumbEllipsis } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { BreadcrumbEllipsis } from '@dwlhm/ui-vue2'

export default {
  components: {
    BreadcrumbEllipsis
  }
}
</script>
```
