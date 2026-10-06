# Breadcrumb

Breadcrumb component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Breadcrumb" />

---


## Code Examples

::: code-group

```tsx [React]
import { Breadcrumb } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Breadcrumb from '@dwlhm/ui-svelte/Breadcrumb.svelte'
```

```vue [Vue 3]
<template>
  <Breadcrumb />
</template>

<script setup lang="ts">
import { Breadcrumb } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Breadcrumb />
</template>

<script>
import { Breadcrumb } from '@dwlhm/ui-vue2'

export default {
  components: { Breadcrumb }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `"1" \| "2" \| "deep"` | `-` | - |
| `showEllipsis` | `boolean` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `home` | `string` | `-` | - |
| `separator` | `string` | `-` | - |
| `current` | `string` | `-` | - |
| `ellipsis` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Breadcrumb } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Breadcrumb from '@dwlhm/ui-svelte/Breadcrumb.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Breadcrumb } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Breadcrumb } from '@dwlhm/ui-vue2'

export default {
  components: {
    Breadcrumb
  }
}
</script>
```
