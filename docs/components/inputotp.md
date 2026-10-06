# InputOTP

InputOTP component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="InputOTP" />

---

## Code Examples

::: code-group

```tsx [React]
import { InputOTP } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import InputOTP from '@dwlhm/ui-svelte/InputOTP.svelte'
```

```vue [Vue 3]
<template>
  <InputOTP />
</template>

<script setup lang="ts">
import { InputOTP } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <InputOTP />
</template>

<script>
import { InputOTP } from '@dwlhm/ui-vue2'

export default {
  components: { InputOTP }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `labelText` | `string` | `-` | - |
| `hintErrorText` | `string` | `-` | - |
| `showRequired` | `boolean` | `-` | - |
| `showHint` | `boolean` | `-` | - |
| `showLabel` | `boolean` | `-` | - |
| `state` | `"Default" \| "Focus" \| "Filled" \| "Error" \| "Disabled"` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `showLeftIcon` | `boolean` | `-` | - |
| `label` | `string` | `-` | - |
| `showRightIcon` | `boolean` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `requiredIndicator` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { InputOTP } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import InputOTP from '@dwlhm/ui-svelte/InputOTP.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { InputOTP } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { InputOTP } from '@dwlhm/ui-vue2'

export default {
  components: {
    InputOTP
  }
}
</script>
```
