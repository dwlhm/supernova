# Badge

Compact status badge indicator used for categorization, counters, and highlights.

---

## Interactive Preview

<ComponentSandbox name="Badge" />

---


## Code Examples

::: code-group

```tsx [React]
import { Badge } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge variant="primary">New</Badge>
      <Badge variant="success" rounded>Completed</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
    </div>
  )
}
```

```svelte [Svelte]
<script>
  import Badge from '@dwlhm/ui-svelte/Badge.svelte'
</script>

<div style="display: flex; gap: 8px; align-items: center;">
  <Badge variant="primary">New</Badge>
  <Badge variant="success" rounded={true}>Completed</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="danger">Failed</Badge>
</div>
```

```vue [Vue 3]
<template>
  <Badge />
</template>

<script setup lang="ts">
import { Badge } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Badge />
</template>

<script>
import { Badge } from '@dwlhm/ui-vue2'

export default {
  components: { Badge }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `-` | - |
| `Label` | `string` | `-` | - |
| `variant` | `"primary" \| "secondary" \| "destructive" \| "success" \| "warning" \| "info" \| "outline"` | `'primary'` | Color tone indicating status or category |
| `Variant` | `"primary" \| "secondary" \| "destructive" \| "success" \| "warning" \| "info" \| "outline"` | `-` | - |
| `children` | `any` | `-` | Text content or indicator symbol |
| `className` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Badge } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Badge from '@dwlhm/ui-svelte/Badge.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Badge } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Badge } from '@dwlhm/ui-vue2'

export default {
  components: {
    Badge
  }
}
</script>
```
