# Sidebar

Sidebar component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Sidebar" />

---

## Code Examples

::: code-group

```tsx [React]
import { Sidebar } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Sidebar from '@dwlhm/ui-svelte/Sidebar.svelte'
```

```vue [Vue 3]
<template>
  <Sidebar />
</template>

<script setup lang="ts">
import { Sidebar } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Sidebar />
</template>

<script>
import { Sidebar } from '@dwlhm/ui-vue2'

export default {
  components: { Sidebar }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `brandContent` | `any` | `-` | - |
| `navigationContent` | `any` | `-` | - |
| `accountContent` | `any` | `-` | - |
| `expanded` | `boolean` | `-` | - |
| `showWordmark` | `boolean` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `showLeadingIcon` | `boolean` | `-` | - |
| `showLabel` | `boolean` | `-` | - |
| `label` | `string` | `-` | - |
| `showBadge` | `boolean` | `-` | - |
| `badgeLabel` | `string` | `-` | - |
| `showTrailingIcon` | `boolean` | `-` | - |
| `showStatus` | `boolean` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |
| `management` | `string` | `-` | - |
| `management2` | `string` | `-` | - |
| `name` | `string` | `-` | - |
| `email` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Sidebar } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Sidebar from '@dwlhm/ui-svelte/Sidebar.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Sidebar } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Sidebar } from '@dwlhm/ui-vue2'

export default {
  components: {
    Sidebar
  }
}
</script>
```
