# Checkbox

Checkbox component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Checkbox" />

---

## Code Examples

::: code-group

```tsx [React]
import { Checkbox } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Checkbox from '@dwlhm/ui-svelte/Checkbox.svelte'
```

```vue [Vue 3]
<template>
  <Checkbox />
</template>

<script setup lang="ts">
import { Checkbox } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Checkbox />
</template>

<script>
import { Checkbox } from '@dwlhm/ui-vue2'

export default {
  components: { Checkbox }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `leftLabel` | `boolean` | `-` | - |
| `rightLabel` | `boolean` | `-` | - |
| `state` | `"off" \| "on"` | `-` | - |
| `State` | `"off" \| "on"` | `-` | - |
| `size` | `"Medium" \| "Small" \| "Large"` | `-` | - |
| `Size` | `"Medium" \| "Small" \| "Large"` | `-` | - |
| `disabled` | `"false" \| "true"` | `-` | - |
| `Disabled` | `"false" \| "true"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Checkbox } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Checkbox from '@dwlhm/ui-svelte/Checkbox.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Checkbox } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Checkbox } from '@dwlhm/ui-vue2'

export default {
  components: {
    Checkbox
  }
}
</script>
```
