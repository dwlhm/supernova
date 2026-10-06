# InputTextArea

InputTextArea component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="InputTextArea" />

---


## Code Examples

::: code-group

```tsx [React]
import { InputTextArea } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import InputTextArea from '@dwlhm/ui-svelte/InputTextArea.svelte'
```

```vue [Vue 3]
<template>
  <InputTextArea />
</template>

<script setup lang="ts">
import { InputTextArea } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <InputTextArea />
</template>

<script>
import { InputTextArea } from '@dwlhm/ui-vue2'

export default {
  components: { InputTextArea }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `labelText` | `string` | `-` | - |
| `placeholderText` | `string` | `-` | - |
| `hintErrorText` | `string` | `-` | - |
| `characterCount` | `string` | `-` | - |
| `showRequired` | `boolean` | `-` | - |
| `icon` | `any` | `-` | - |
| `showCharacterCount` | `boolean` | `-` | - |
| `showHint` | `boolean` | `-` | - |
| `showLeftIcon` | `boolean` | `-` | - |
| `showRightIcon` | `boolean` | `-` | - |
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
import { InputTextArea } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import InputTextArea from '@dwlhm/ui-svelte/InputTextArea.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { InputTextArea } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { InputTextArea } from '@dwlhm/ui-vue2'

export default {
  components: {
    InputTextArea
  }
}
</script>
```
