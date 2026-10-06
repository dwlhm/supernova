# MenuItem

MenuItem component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="MenuItem" />

---


## Code Examples

::: code-group

```tsx [React]
import { MenuItem } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import MenuItem from '@dwlhm/ui-svelte/MenuItem.svelte'
```

```vue [Vue 3]
<template>
  <MenuItem />
</template>

<script setup lang="ts">
import { MenuItem } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <MenuItem />
</template>

<script>
import { MenuItem } from '@dwlhm/ui-vue2'

export default {
  components: { MenuItem }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `-` | - |
| `badgeLabel` | `string` | `-` | - |
| `submenuContent` | `any` | `-` | - |
| `showBadge` | `boolean` | `-` | - |
| `showLabel` | `boolean` | `-` | - |
| `showTrailingIcon` | `boolean` | `-` | - |
| `showLeadingIcon` | `boolean` | `-` | - |
| `leadingIcon` | `any` | `-` | - |
| `state` | `"Default" \| "Hover" \| "Active"` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { MenuItem } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import MenuItem from '@dwlhm/ui-svelte/MenuItem.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { MenuItem } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { MenuItem } from '@dwlhm/ui-vue2'

export default {
  components: {
    MenuItem
  }
}
</script>
```
