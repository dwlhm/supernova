# DatePicker

DatePicker component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="DatePicker" />

---


## Code Examples

::: code-group

```tsx [React]
import { DatePicker } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import DatePicker from '@dwlhm/ui-svelte/DatePicker.svelte'
```

```vue [Vue 3]
<template>
  <DatePicker />
</template>

<script setup lang="ts">
import { DatePicker } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <DatePicker />
</template>

<script>
import { DatePicker } from '@dwlhm/ui-vue2'

export default {
  components: { DatePicker }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `hintText` | `boolean` | `-` | - |
| `state` | `"Closed" \| "Open"` | `-` | - |
| `type` | `"Date of Birth Picker" \| "Picker with Input" \| "Date and Time Picker" \| "Natural Language Picker" \| "Range Picker" \| "Year Picker"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `label` | `string` | `-` | - |
| `placeholder` | `string` | `-` | - |
| `note` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { DatePicker } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import DatePicker from '@dwlhm/ui-svelte/DatePicker.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { DatePicker } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { DatePicker } from '@dwlhm/ui-vue2'

export default {
  components: {
    DatePicker
  }
}
</script>
```
