# Button

Interactive button component with support for multiple visual variants, sizes, full-width layouts, and disabled states.

---

## Interactive Preview

<ComponentSandbox name="Button" />

---

## Code Examples

::: code-group

```tsx [React]
import { Button } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
        Primary Button
      </Button>
      <Button variant="secondary" size="md">
        Secondary
      </Button>
      <Button variant="outline" size="md">
        Outline
      </Button>
    </div>
  )
}
```

```svelte [Svelte]
<script>
  import Button from '@dwlhm/ui-svelte/Button.svelte'
</script>

<div style="display: flex; gap: 12px;">
  <Button variant="primary" size="md" on:click={() => alert('Clicked!')}>
    Primary Button
  </Button>
  <Button variant="secondary" size="md">
    Secondary
  </Button>
  <Button variant="outline" size="md">
    Outline
  </Button>
</div>
```

```vue [Vue 3]
<template>
  <div style="display: flex; gap: 12px;">
    <Button variant="primary" size="md" :onClick="() => alert('Clicked!')">
      Primary Button
    </Button>
    <Button variant="secondary" size="md">
      Secondary
    </Button>
    <Button variant="outline" size="md">
      Outline
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <div style="display: flex; gap: 12px;">
    <Button variant="primary" size="md" :onClick="() => alert('Clicked!')">
      Primary Button
    </Button>
    <Button variant="secondary" size="md">
      Secondary
    </Button>
    <Button variant="outline" size="md">
      Outline
    </Button>
  </div>
</template>

<script>
import { Button } from '@dwlhm/ui-vue2'

export default {
  components: { Button }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showLeftIcon` | `boolean` | `-` | - |
| `Showlefticon` | `boolean` | `-` | - |
| `showRightIcon` | `boolean` | `-` | - |
| `Showrighticon` | `boolean` | `-` | - |
| `leftIcon` | `any` | `-` | - |
| `Lefticon` | `any` | `-` | - |
| `rightIcon` | `any` | `-` | - |
| `Righticon` | `any` | `-` | - |
| `label` | `string` | `-` | - |
| `Label` | `string` | `-` | - |
| `showLabel` | `boolean` | `-` | - |
| `ShowLabel` | `boolean` | `-` | - |
| `roundness` | `"Default" \| "Round"` | `-` | - |
| `Roundness` | `"Default" \| "Round"` | `-` | - |
| `variant` | `"Primary" \| "Secondary" \| "Outline" \| "Destructive" \| "Link"` | `'primary'` | Visual appearance variant |
| `Style` | `"Primary" \| "Secondary" \| "Outline" \| "Destructive" \| "Link"` | `-` | - |
| `size` | `"Regular" \| "Large" \| "Small" \| "Mini"` | `'md'` | Button dimensions and padding |
| `Size` | `"Regular" \| "Large" \| "Small" \| "Mini"` | `-` | - |
| `state` | `"Default" \| "Focus" \| "Disabled" \| "Pressed"` | `-` | - |
| `State` | `"Default" \| "Focus" \| "Disabled" \| "Pressed"` | `-` | - |
| `onClick` | `(event?: any) => void` | `-` | Callback fired on click event |
| `children` | `any` | `-` | Content or label to render inside button |
| `className` | `string` | `-` | - |
| `disabled` | `boolean` | `false` | Whether the button is interactive |


---

## Framework Integration

### React

```tsx
import { Button } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Button from '@dwlhm/ui-svelte/Button.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Button } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Button } from '@dwlhm/ui-vue2'

export default {
  components: {
    Button
  }
}
</script>
```
