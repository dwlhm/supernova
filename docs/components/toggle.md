# Toggle

Toggle component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Toggle" />

---

## Code Examples

::: code-group

```tsx [React]
import { Toggle } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Toggle from '@dwlhm/ui-svelte/Toggle.svelte'
```

```vue [Vue 3]
<template>
  <Toggle />
</template>

<script setup lang="ts">
import { Toggle } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Toggle />
</template>

<script>
import { Toggle } from '@dwlhm/ui-vue2'

export default {
  components: { Toggle }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showText` | `boolean` | `-` | - |
| `state` | `"Default" \| "Active" \| "Disabled"` | `-` | - |
| `size` | `"Medium" \| "Large" \| "Small"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `label` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Toggle } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Toggle from '@dwlhm/ui-svelte/Toggle.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Toggle } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Toggle } from '@dwlhm/ui-vue2'

export default {
  components: {
    Toggle
  }
}
</script>
```
