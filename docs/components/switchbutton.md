# SwitchButton

SwitchButton component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="SwitchButton" />

---

## Code Examples

::: code-group

```tsx [React]
import { SwitchButton } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import SwitchButton from '@dwlhm/ui-svelte/SwitchButton.svelte'
```

```vue [Vue 3]
<template>
  <SwitchButton />
</template>

<script setup lang="ts">
import { SwitchButton } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <SwitchButton />
</template>

<script>
import { SwitchButton } from '@dwlhm/ui-vue2'

export default {
  components: { SwitchButton }
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
| `state` | `"Off" \| "On" \| "Disabled"` | `-` | - |
| `disabled` | `boolean` | `-` | - |
| `size` | `"Medium" \| "Small" \| "Large"` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `label` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `ariaLabel` | `string` | `-` | - |
| `ariaLabelledby` | `string` | `-` | - |
| `airplaneMode` | `string` | `-` | - |
| `airplaneMode2` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { SwitchButton } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import SwitchButton from '@dwlhm/ui-svelte/SwitchButton.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { SwitchButton } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { SwitchButton } from '@dwlhm/ui-vue2'

export default {
  components: {
    SwitchButton
  }
}
</script>
```
