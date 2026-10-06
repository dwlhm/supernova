# Breadcrumb

Composable part of Breadcrumb. Consumer owns content, order and repetition.
## Composition

Root: `Breadcrumb`. Parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.

The default slot replaces all design example children. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.

### Static composition

```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbPage>Products</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Consumer loop

```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';

// The consumer supplies paths, including stable IDs and link destinations.
<Breadcrumb>
  <BreadcrumbList>
    {paths.map((path, index) => (
      <BreadcrumbItem key={path.id}>
        {index > 0 && <BreadcrumbSeparator />}
        {index === paths.length - 1
          ? <BreadcrumbPage>{path.label}</BreadcrumbPage>
          : <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>}
      </BreadcrumbItem>
    ))}
  </BreadcrumbList>
</Breadcrumb>
```


---

Interactive preview is not available for composition parts; use the examples below.

## Code Examples

::: code-group

```tsx [React]
import { Breadcrumb } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import Breadcrumb from '@dwlhm/ui-svelte/Breadcrumb.svelte'
```

```vue [Vue 3]
<template>
  <Breadcrumb />
</template>

<script setup lang="ts">
import { Breadcrumb } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Breadcrumb />
</template>

<script>
import { Breadcrumb } from '@dwlhm/ui-vue2'

export default {
  components: { Breadcrumb }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { Breadcrumb } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Breadcrumb from '@dwlhm/ui-svelte/Breadcrumb.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Breadcrumb } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Breadcrumb } from '@dwlhm/ui-vue2'

export default {
  components: {
    Breadcrumb
  }
}
</script>
```
