# StatusBadge

StatusBadge component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="StatusBadge" />

---

## Code Examples

::: code-group

```tsx [React]
import { StatusBadge } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import StatusBadge from '@dwlhm/ui-svelte/StatusBadge.svelte'
```

```vue [Vue 3]
<template>
  <StatusBadge />
</template>

<script setup lang="ts">
import { StatusBadge } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <StatusBadge />
</template>

<script>
import { StatusBadge } from '@dwlhm/ui-vue2'

export default {
  components: { StatusBadge }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `any` | `-` | - |
| `icon` | `any` | `-` | - |
| `text` | `string` | `-` | - |
| `variant` | `"success" \| "warning" \| "danger" \| "info"` | `-` | - |
| `testId` | `string` | `-` | - |
| `onClick` | `(event: any) => void` | `-` | - |


---

## Framework Integration

### React

```tsx
import { StatusBadge } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import StatusBadge from '@dwlhm/ui-svelte/StatusBadge.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { StatusBadge } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { StatusBadge } from '@dwlhm/ui-vue2'

export default {
  components: {
    StatusBadge
  }
}
</script>
```
