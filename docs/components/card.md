# Card

Container element for organizing related content with optional title, subtitle, elevation shadow, and borders.

---

## Interactive Preview

<ComponentSandbox name="Card" />

---

## Code Examples

::: code-group

```tsx [React]
import { Card, Button } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <Card
      title="Project Overview"
      subtitle="Supernova design system compilation"
      bordered
      shadow="md"
      padding="lg"
    >
      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569' }}>
        Mitosis compiles source components directly to React, Svelte, and more.
      </p>
      <Button variant="primary" size="sm">Explore Docs</Button>
    </Card>
  )
}
```

```svelte [Svelte]
<script>
  import Card from '@dwlhm/ui-svelte/Card.svelte'
  import Button from '@dwlhm/ui-svelte/Button.svelte'
</script>

<Card
  title="Project Overview"
  subtitle="Supernova design system compilation"
  bordered={true}
  shadow="md"
  padding="lg"
>
  <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
    Mitosis compiles source components directly to React, Svelte, and more.
  </p>
  <Button variant="primary" size="sm">Explore Docs</Button>
</Card>
```

```vue [Vue 3]
<template>
  <Card />
</template>

<script setup lang="ts">
import { Card } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Card />
</template>

<script>
import { Card } from '@dwlhm/ui-vue2'

export default {
  components: { Card }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `any` | `-` | Main card body content |
| `title` | `string` | `-` | Header title text |
| `subtitle` | `string` | `-` | Secondary supporting description text |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `'md'` | Internal container spacing |
| `shadow` | `"none" \| "sm" \| "md" \| "lg"` | `'md'` | Elevation drop shadow level |
| `bordered` | `boolean` | `false` | Adds outline border if true |
| `testId` | `string` | `-` | - |
| `onClick` | `(event: any) => void` | `-` | Optional click handler making the card interactive |


---

## Framework Integration

### React

```tsx
import { Card } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Card from '@dwlhm/ui-svelte/Card.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Card } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Card } from '@dwlhm/ui-vue2'

export default {
  components: {
    Card
  }
}
</script>
```
