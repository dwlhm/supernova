# IconPlaceholder

Placeholder icon used as the default content for an instance-swap icon property.

## When to Use

- Use this component while configuring or previewing an icon slot before replacing it with the intended icon. It is not intended to appear in production UI.

## Usage Guidelines

- Replace it with an icon that matches the action or content.
- Keep the icon size and alignment defined by the parent component.
- Avoid using the placeholder as a meaningful visual indicator.

## Interactive Preview

<ComponentPreview name="IconPlaceholder" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | sm, md, lg |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { IconPlaceholder } from '@supernova/design-system/react';

export default function App() {
  return <IconPlaceholder size="md" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { IconPlaceholder } from '@supernova/design-system/vue3';
</script>

<template>
  <IconPlaceholder size="md" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { IconPlaceholder } from '@supernova/design-system/svelte';
</script>

<IconPlaceholder size="md" />
```

:::
