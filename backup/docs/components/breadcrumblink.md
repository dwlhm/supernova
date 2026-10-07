# BreadcrumbLink

Composable part of Breadcrumb. Consumer owns content, order and repetition.
## Composition

Root: `Breadcrumb`. Parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { BreadcrumbLink } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import BreadcrumbLink from '@dwlhm/ui-svelte/BreadcrumbLink.svelte'
```

```vue [Vue 3]
<template>
  <BreadcrumbLink />
</template>

<script setup lang="ts">
import { BreadcrumbLink } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <BreadcrumbLink />
</template>

<script>
import { BreadcrumbLink } from '@dwlhm/ui-vue2'

export default {
  components: { BreadcrumbLink }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `href` | `string` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { BreadcrumbLink } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import BreadcrumbLink from '@dwlhm/ui-svelte/BreadcrumbLink.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { BreadcrumbLink } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { BreadcrumbLink } from '@dwlhm/ui-vue2'

export default {
  components: {
    BreadcrumbLink
  }
}
</script>
```
