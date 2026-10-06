# Tooltip

Tooltip component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Tooltip" />

---

## Code Examples

::: code-group

```tsx [React]
import { Tooltip } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Tooltip from '@dwlhm/ui-svelte/Tooltip.svelte'
```

```vue [Vue 3]
<template>
  <Tooltip />
</template>

<script setup lang="ts">
import { Tooltip } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Tooltip />
</template>

<script>
import { Tooltip } from '@dwlhm/ui-vue2'

export default {
  components: { Tooltip }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `textContent` | `string` | `-` | - |
| `position` | `"Top" \| "Bottom" \| "Left" \| "Right"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Tooltip } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Tooltip from '@dwlhm/ui-svelte/Tooltip.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Tooltip } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Tooltip } from '@dwlhm/ui-vue2'

export default {
  components: {
    Tooltip
  }
}
</script>
```
