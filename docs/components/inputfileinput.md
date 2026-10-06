# InputFileInput

InputFileInput component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="InputFileInput" />

---

## Code Examples

::: code-group

```tsx [React]
import { InputFileInput } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import InputFileInput from '@dwlhm/ui-svelte/InputFileInput.svelte'
```

```vue [Vue 3]
<template>
  <InputFileInput />
</template>

<script setup lang="ts">
import { InputFileInput } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <InputFileInput />
</template>

<script>
import { InputFileInput } from '@dwlhm/ui-vue2'

export default {
  components: { InputFileInput }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `labelText` | `string` | `-` | - |
| `buttonText` | `string` | `-` | - |
| `fileName` | `string` | `-` | - |
| `hintErrorText` | `string` | `-` | - |
| `showRequired` | `boolean` | `-` | - |
| `showHint` | `boolean` | `-` | - |
| `showLabel` | `boolean` | `-` | - |
| `state` | `"Default" \| "Focus" \| "Filled" \| "Error" \| "Disabled"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `requiredIndicator` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { InputFileInput } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import InputFileInput from '@dwlhm/ui-svelte/InputFileInput.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { InputFileInput } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { InputFileInput } from '@dwlhm/ui-vue2'

export default {
  components: {
    InputFileInput
  }
}
</script>
```
