# InputText

InputText component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="InputText" />

---


## Code Examples

::: code-group

```tsx [React]
import { InputText } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import InputText from '@dwlhm/ui-svelte/InputText.svelte'
```

```vue [Vue 3]
<template>
  <InputText />
</template>

<script setup lang="ts">
import { InputText } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <InputText />
</template>

<script>
import { InputText } from '@dwlhm/ui-vue2'

export default {
  components: { InputText }
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
import { InputText } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import InputText from '@dwlhm/ui-svelte/InputText.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { InputText } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { InputText } from '@dwlhm/ui-vue2'

export default {
  components: {
    InputText
  }
}
</script>
```
