# AlertDialog

AlertDialog component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="AlertDialog" />

---

## Code Examples

::: code-group

```tsx [React]
import { AlertDialog } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import AlertDialog from '@dwlhm/ui-svelte/AlertDialog.svelte'
```

```vue [Vue 3]
<template>
  <AlertDialog />
</template>

<script setup lang="ts">
import { AlertDialog } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <AlertDialog />
</template>

<script>
import { AlertDialog } from '@dwlhm/ui-vue2'

export default {
  components: { AlertDialog }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `-` | - |
| `description` | `string` | `-` | - |
| `showIcon` | `boolean` | `-` | - |
| `variant` | `"default" \| "danger" \| "warning"` | `-` | - |
| `confirmText` | `string` | `-` | - |
| `cancelText` | `string` | `-` | - |
| `onCancel` | `() => void` | `-` | - |
| `onConfirm` | `() => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { AlertDialog } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import AlertDialog from '@dwlhm/ui-svelte/AlertDialog.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { AlertDialog } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { AlertDialog } from '@dwlhm/ui-vue2'

export default {
  components: {
    AlertDialog
  }
}
</script>
```
