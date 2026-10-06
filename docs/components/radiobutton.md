# RadioButton

RadioButton component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="RadioButton" />

---

## Code Examples

::: code-group

```tsx [React]
import { RadioButton } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import RadioButton from '@dwlhm/ui-svelte/RadioButton.svelte'
```

```vue [Vue 3]
<template>
  <RadioButton />
</template>

<script setup lang="ts">
import { RadioButton } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <RadioButton />
</template>

<script>
import { RadioButton } from '@dwlhm/ui-vue2'

export default {
  components: { RadioButton }
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
| `state` | `"off" \| "on" \| "Disabled"` | `-` | - |
| `disabled` | `boolean` | `-` | - |
| `size` | `"Medium" \| "Small" \| "Large"` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `ariaLabel` | `string` | `-` | - |
| `ariaLabelledby` | `string` | `-` | - |
| `leftLabelContent` | `string` | `-` | - |
| `rightLabelContent` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { RadioButton } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import RadioButton from '@dwlhm/ui-svelte/RadioButton.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { RadioButton } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { RadioButton } from '@dwlhm/ui-vue2'

export default {
  components: {
    RadioButton
  }
}
</script>
```
