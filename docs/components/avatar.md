# Avatar

Avatar component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="Avatar" />

---


## Code Examples

::: code-group

```tsx [React]
import { Avatar } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Avatar from '@dwlhm/ui-svelte/Avatar.svelte'
```

```vue [Vue 3]
<template>
  <Avatar />
</template>

<script setup lang="ts">
import { Avatar } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Avatar />
</template>

<script>
import { Avatar } from '@dwlhm/ui-vue2'

export default {
  components: { Avatar }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showStatus` | `boolean` | `-` | - |
| `initialsText` | `string` | `-` | - |
| `size` | `"mini" \| "small" \| "regular" \| "large" \| "x-large"` | `-` | - |
| `type` | `"image" \| "initials" \| "icon"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Avatar } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Avatar from '@dwlhm/ui-svelte/Avatar.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Avatar } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Avatar } from '@dwlhm/ui-vue2'

export default {
  components: {
    Avatar
  }
}
</script>
```
