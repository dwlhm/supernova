# Slider

Slider component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Slider" />

---

## Code Examples

::: code-group

```tsx [React]
import { Slider } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Slider from '@dwlhm/ui-svelte/Slider.svelte'
```

```vue [Vue 3]
<template>
  <Slider />
</template>

<script setup lang="ts">
import { Slider } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Slider />
</template>

<script>
import { Slider } from '@dwlhm/ui-vue2'

export default {
  components: { Slider }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onClick` | `(event?: any) => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Slider } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Slider from '@dwlhm/ui-svelte/Slider.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Slider } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Slider } from '@dwlhm/ui-vue2'

export default {
  components: {
    Slider
  }
}
</script>
```
