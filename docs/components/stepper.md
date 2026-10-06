# Stepper

Stepper component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Stepper" />

---


## Code Examples

::: code-group

```tsx [React]
import { Stepper } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Stepper from '@dwlhm/ui-svelte/Stepper.svelte'
```

```vue [Vue 3]
<template>
  <Stepper />
</template>

<script setup lang="ts">
import { Stepper } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Stepper />
</template>

<script>
import { Stepper } from '@dwlhm/ui-vue2'

export default {
  components: { Stepper }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `step1Label` | `string` | `-` | - |
| `step2Label` | `string` | `-` | - |
| `step3Label` | `string` | `-` | - |
| `step4Label` | `string` | `-` | - |
| `type` | `"Horizontal" \| "Vertical"` | `-` | - |
| `current` | `"1" \| "2" \| "3" \| "4"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `stepNumber` | `string` | `-` | - |
| `stepNumber2` | `string` | `-` | - |
| `stepNumber3` | `string` | `-` | - |
| `stepNumber4` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Stepper } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Stepper from '@dwlhm/ui-svelte/Stepper.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Stepper } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Stepper } from '@dwlhm/ui-vue2'

export default {
  components: {
    Stepper
  }
}
</script>
```
