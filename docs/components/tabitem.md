# TabItem

TabItem component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="TabItem" />

---

## Code Examples

::: code-group

```tsx [React]
import { TabItem } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import TabItem from '@dwlhm/ui-svelte/TabItem.svelte'
```

```vue [Vue 3]
<template>
  <TabItem />
</template>

<script setup lang="ts">
import { TabItem } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <TabItem />
</template>

<script>
import { TabItem } from '@dwlhm/ui-vue2'

export default {
  components: { TabItem }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `-` | - |
| `showIcon` | `boolean` | `-` | - |
| `icon` | `any` | `-` | - |
| `showNum` | `boolean` | `-` | - |
| `num` | `string` | `-` | - |
| `state` | `"Active" \| "Default"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { TabItem } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import TabItem from '@dwlhm/ui-svelte/TabItem.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { TabItem } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { TabItem } from '@dwlhm/ui-vue2'

export default {
  components: {
    TabItem
  }
}
</script>
```
