# BreadcrumbSeparator

Composable part of Breadcrumb. Consumer owns content, order and repetition.
## Composition

Root: `Breadcrumb`. Parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.

The default slot uses "/" when no content is supplied. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { BreadcrumbSeparator } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import BreadcrumbSeparator from '@dwlhm/ui-svelte/BreadcrumbSeparator.svelte'
```

```vue [Vue 3]
<template>
  <BreadcrumbSeparator />
</template>

<script setup lang="ts">
import { BreadcrumbSeparator } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <BreadcrumbSeparator />
</template>

<script>
import { BreadcrumbSeparator } from '@dwlhm/ui-vue2'

export default {
  components: { BreadcrumbSeparator }
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
import { BreadcrumbSeparator } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import BreadcrumbSeparator from '@dwlhm/ui-svelte/BreadcrumbSeparator.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { BreadcrumbSeparator } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { BreadcrumbSeparator } from '@dwlhm/ui-vue2'

export default {
  components: {
    BreadcrumbSeparator
  }
}
</script>
```
