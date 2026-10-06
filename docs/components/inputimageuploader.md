# InputImageUploader

InputImageUploader component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="InputImageUploader" />

---


## Code Examples

::: code-group

```tsx [React]
import { InputImageUploader } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import InputImageUploader from '@dwlhm/ui-svelte/InputImageUploader.svelte'
```

```vue [Vue 3]
<template>
  <InputImageUploader />
</template>

<script setup lang="ts">
import { InputImageUploader } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <InputImageUploader />
</template>

<script>
import { InputImageUploader } from '@dwlhm/ui-vue2'

export default {
  components: { InputImageUploader }
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
| `primaryText` | `string` | `-` | - |
| `supportingText` | `string` | `-` | - |
| `fileName` | `string` | `-` | - |
| `fileMetadata` | `string` | `-` | - |
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
import { InputImageUploader } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import InputImageUploader from '@dwlhm/ui-svelte/InputImageUploader.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { InputImageUploader } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { InputImageUploader } from '@dwlhm/ui-vue2'

export default {
  components: {
    InputImageUploader
  }
}
</script>
```
