# Toast

Toast component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Toast" />

---


## Code Examples

::: code-group

```tsx [React]
import { Toast } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Toast from '@dwlhm/ui-svelte/Toast.svelte'
```

```vue [Vue 3]
<template>
  <Toast />
</template>

<script setup lang="ts">
import { Toast } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Toast />
</template>

<script>
import { Toast } from '@dwlhm/ui-vue2'

export default {
  components: { Toast }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `descriptionText` | `string` | `-` | - |
| `actionText` | `string` | `-` | - |
| `showDescription` | `boolean` | `-` | - |
| `showActionButton` | `boolean` | `-` | - |
| `showCloseButton` | `boolean` | `-` | - |
| `toastText` | `string` | `-` | - |
| `clock` | `boolean` | `-` | - |
| `type` | `"Default" \| "Success" \| "Error" \| "Warning" \| "Info"` | `-` | - |
| `state` | `"Default" \| "Hover" \| "Pressed"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `close` | `string` | `-` | - |
| `timestamp` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Toast } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Toast from '@dwlhm/ui-svelte/Toast.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Toast } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Toast } from '@dwlhm/ui-vue2'

export default {
  components: {
    Toast
  }
}
</script>
```
