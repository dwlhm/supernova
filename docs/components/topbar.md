# Topbar

Topbar component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Topbar" />

---

## Code Examples

::: code-group

```tsx [React]
import { Topbar } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Topbar from '@dwlhm/ui-svelte/Topbar.svelte'
```

```vue [Vue 3]
<template>
  <Topbar />
</template>

<script setup lang="ts">
import { Topbar } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Topbar />
</template>

<script>
import { Topbar } from '@dwlhm/ui-vue2'

export default {
  components: { Topbar }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `topbarContent` | `any` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `home` | `string` | `-` | - |
| `separator` | `string` | `-` | - |
| `breadcrumb` | `string` | `-` | - |
| `typeToSearch` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Topbar } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Topbar from '@dwlhm/ui-svelte/Topbar.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Topbar } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Topbar } from '@dwlhm/ui-vue2'

export default {
  components: {
    Topbar
  }
}
</script>
```
