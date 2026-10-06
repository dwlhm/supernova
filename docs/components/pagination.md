# Pagination

Pagination component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Pagination" />

---


## Code Examples

::: code-group

```tsx [React]
import { Pagination } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Pagination from '@dwlhm/ui-svelte/Pagination.svelte'
```

```vue [Vue 3]
<template>
  <Pagination />
</template>

<script setup lang="ts">
import { Pagination } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Pagination />
</template>

<script>
import { Pagination } from '@dwlhm/ui-vue2'

export default {
  components: { Pagination }
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
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `previous` | `string` | `-` | - |
| `text` | `string` | `-` | - |
| `text2` | `string` | `-` | - |
| `text3` | `string` | `-` | - |
| `next` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Pagination } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Pagination from '@dwlhm/ui-svelte/Pagination.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Pagination } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Pagination } from '@dwlhm/ui-vue2'

export default {
  components: {
    Pagination
  }
}
</script>
```
