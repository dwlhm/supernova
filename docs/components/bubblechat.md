# BubbleChat

BubbleChat component generated from Supernova.

---

## Interactive Preview

<ComponentSandbox name="BubbleChat" />

---

## Code Examples

::: code-group

```tsx [React]
import { BubbleChat } from '@dwlhm/ui-react'
```

```svelte [Svelte]
import BubbleChat from '@dwlhm/ui-svelte/BubbleChat.svelte'
```

```vue [Vue 3]
<template>
  <BubbleChat />
</template>

<script setup lang="ts">
import { BubbleChat } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <BubbleChat />
</template>

<script>
import { BubbleChat } from '@dwlhm/ui-vue2'

export default {
  components: { BubbleChat }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showTime` | `boolean` | `-` | - |
| `showStatus` | `boolean` | `-` | - |
| `showCustomText` | `boolean` | `-` | - |
| `customText` | `string` | `-` | - |
| `textMessage` | `string` | `-` | - |
| `fileName` | `string` | `-` | - |
| `fileMetadata` | `string` | `-` | - |
| `imageName` | `string` | `-` | - |
| `imageMetadata` | `string` | `-` | - |
| `videoName` | `string` | `-` | - |
| `videoMetadata` | `string` | `-` | - |
| `incomingStatusText` | `string` | `-` | - |
| `outgoingStatusText` | `string` | `-` | - |
| `errorStatusText` | `string` | `-` | - |
| `incomingTimeText` | `string` | `-` | - |
| `outgoingTimeText` | `string` | `-` | - |
| `direction` | `"Incoming" \| "Outgoing"` | `-` | - |
| `type` | `"Text" \| "File" \| "Image" \| "Video"` | `-` | - |
| `state` | `"Default" \| "Error"` | `-` | - |
| `children` | `any` | `-` | - |
| `className` | `string` | `-` | - |
| `id` | `string` | `-` | - |
| `ariaDescribedby` | `string` | `-` | - |


---

## Framework Integration

### React

```tsx
import { BubbleChat } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import BubbleChat from '@dwlhm/ui-svelte/BubbleChat.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { BubbleChat } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { BubbleChat } from '@dwlhm/ui-vue2'

export default {
  components: {
    BubbleChat
  }
}
</script>
```
