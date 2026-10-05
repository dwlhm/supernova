# Typography

Standardized typography component for headings, body copy, and caption text with consistent font scale and weight.

---

## Interactive Preview

<ComponentSandbox name="Typography" />

---

## Code Examples

::: code-group

```tsx [React]
import { Typography } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <div>
      <Typography variant="h2" weight="bold">
        Design Tokens & Components
      </Typography>
      <Typography variant="body" weight="normal" color="text-slate-600">
        Consistent design tokens guarantee cohesion across multi-framework applications.
      </Typography>
    </div>
  )
}
```

```svelte [Svelte]
<script>
  import Typography from '@dwlhm/ui-svelte/Typography.svelte'
</script>

<div>
  <Typography variant="h2" weight="bold">
    Design Tokens & Components
  </Typography>
  <Typography variant="body" weight="normal" color="text-slate-600">
    Consistent design tokens guarantee cohesion across multi-framework applications.
  </Typography>
</div>
```

```vue [Vue 3]
<template>
  <Typography />
</template>

<script setup lang="ts">
import { Typography } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Typography />
</template>

<script>
import { Typography } from '@dwlhm/ui-vue2'

export default {
  components: { Typography }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `any` | `-` | Text content to display |
| `variant` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "body" \| "body-sm" \| "caption"` | `'body'` | Typography scale preset (h1-h6, body, body-sm, caption) |
| `color` | `string` | `-` | Custom text color CSS class or style |
| `align` | `"left" \| "center" \| "right"` | `'left'` | Horizontal text alignment (left, center, right) |
| `weight` | `"normal" \| "medium" \| "semibold" \| "bold"` | `'normal'` | Font weight (normal, medium, semibold, bold) |


---

## Framework Integration

### React

```tsx
import { Typography } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Typography from '@dwlhm/ui-svelte/Typography.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Typography } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Typography } from '@dwlhm/ui-vue2'

export default {
  components: {
    Typography
  }
}
</script>
```
