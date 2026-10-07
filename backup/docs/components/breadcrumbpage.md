# BreadcrumbPage

Composable part of Breadcrumb. Consumer owns content, order and repetition.
## Composition

Root: `Breadcrumb`. Parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { BreadcrumbPage } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import BreadcrumbPage from '@dwlhm/ui-svelte/BreadcrumbPage.svelte'
```

```vue [Vue 3]
<template>
  <BreadcrumbPage />
</template>

<script setup lang="ts">
import { BreadcrumbPage } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <BreadcrumbPage />
</template>

<script>
import { BreadcrumbPage } from '@dwlhm/ui-vue2'

export default {
  components: { BreadcrumbPage }
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
import { BreadcrumbPage } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import BreadcrumbPage from '@dwlhm/ui-svelte/BreadcrumbPage.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { BreadcrumbPage } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { BreadcrumbPage } from '@dwlhm/ui-vue2'

export default {
  components: {
    BreadcrumbPage
  }
}
</script>
```
