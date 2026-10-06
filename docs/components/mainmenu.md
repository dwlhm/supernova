# MainMenu

MainMenu component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="MainMenu" />

---

## Code Examples

::: code-group

```tsx [React]
import { MainMenu } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import MainMenu from '@dwlhm/ui-svelte/MainMenu.svelte'
```

```vue [Vue 3]
<template>
  <MainMenu />
</template>

<script setup lang="ts">
import { MainMenu } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <MainMenu />
</template>

<script>
import { MainMenu } from '@dwlhm/ui-vue2'

export default {
  components: { MainMenu }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `badgeLabel` | `string` | `-` | - |
| `showTrailingIcon` | `boolean` | `-` | - |
| `leadingIcon` | `any` | `-` | - |
| `showLeadingIcon` | `boolean` | `-` | - |
| `label` | `string` | `-` | - |
| `showLabel` | `boolean` | `-` | - |
| `showBadge` | `boolean` | `-` | - |
| `state` | `"Default" \| "Hover" \| "Pressed" \| "Active" \| "Active-Hover"` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { MainMenu } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import MainMenu from '@dwlhm/ui-svelte/MainMenu.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { MainMenu } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { MainMenu } from '@dwlhm/ui-vue2'

export default {
  components: {
    MainMenu
  }
}
</script>
```
