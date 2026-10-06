# FAB

FAB component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="FAB" />

---


## Code Examples

::: code-group

```tsx [React]
import { FAB } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import FAB from '@dwlhm/ui-svelte/FAB.svelte'
```

```vue [Vue 3]
<template>
  <FAB />
</template>

<script setup lang="ts">
import { FAB } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <FAB />
</template>

<script>
import { FAB } from '@dwlhm/ui-vue2'

export default {
  components: { FAB }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `-` | - |
| `variant` | `"Primary" \| "Secondary" \| "Outline"` | `-` | - |
| `size` | `"Small" \| "Regular" \| "Large" \| "Extended"` | `-` | - |
| `state` | `"Default" \| "Hover" \| "Focus" \| "Disabled"` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `disabled` | `boolean` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `ariaLabel` | `string` | `-` | - |
| `ariaLabelledby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { FAB } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import FAB from '@dwlhm/ui-svelte/FAB.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { FAB } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { FAB } from '@dwlhm/ui-vue2'

export default {
  components: {
    FAB
  }
}
</script>
```
