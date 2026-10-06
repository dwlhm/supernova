# InputFileDropZone

InputFileDropZone component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="InputFileDropZone" />

---


## Code Examples

::: code-group

```tsx [React]
import { InputFileDropZone } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import InputFileDropZone from '@dwlhm/ui-svelte/InputFileDropZone.svelte'
```

```vue [Vue 3]
<template>
  <InputFileDropZone />
</template>

<script setup lang="ts">
import { InputFileDropZone } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <InputFileDropZone />
</template>

<script>
import { InputFileDropZone } from '@dwlhm/ui-vue2'

export default {
  components: { InputFileDropZone }
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
import { InputFileDropZone } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import InputFileDropZone from '@dwlhm/ui-svelte/InputFileDropZone.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { InputFileDropZone } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { InputFileDropZone } from '@dwlhm/ui-vue2'

export default {
  components: {
    InputFileDropZone
  }
}
</script>
```
