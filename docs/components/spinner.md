# Spinner

Spinner component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Spinner" />

---

## Code Examples

::: code-group

```tsx [React]
import { Spinner } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Spinner from '@dwlhm/ui-svelte/Spinner.svelte'
```

```vue [Vue 3]
<template>
  <Spinner />
</template>

<script setup lang="ts">
import { Spinner } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Spinner />
</template>

<script>
import { Spinner } from '@dwlhm/ui-vue2'

export default {
  components: { Spinner }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `"12" \| "16" \| "24" \| "32"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Spinner } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Spinner from '@dwlhm/ui-svelte/Spinner.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Spinner } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Spinner } from '@dwlhm/ui-vue2'

export default {
  components: {
    Spinner
  }
}
</script>
```
