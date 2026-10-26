# Avatar

A circular identity component used to represent a person, account, or entity. It supports profile images, initials, and a generic icon fallback across five sizes, with an optional presence indicator.

## When to Use

- Identify a user in navigation, lists, messages, cards, profiles, and collaborative experiences.
- Use image when a recognizable profile photo is available.
- Use initials when no image is available but a meaningful name is known.
- Use icon as the final fallback when neither an image nor initials are available.

## Usage Guidelines

- Use regular as the default size for most product interfaces.
- Choose smaller sizes for dense or inline contexts, and larger sizes for profile-focused or high-emphasis layouts.
- Keep the image crop centered and use a clear, recognizable subject.
- Use no more than two initials. Prefer the first letters of the person’s first and last names.
- Show the status indicator only when presence information is current and meaningful.
- Pair the avatar with a visible name or accessible label when identity cannot be inferred from surrounding content.
- Do not use decorative imagery, logos, or status colors that conflict with the avatar’s identity purpose.

## Interactive Preview

<ComponentPreview name="Avatar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'mini' \| 'small' \| 'regular' \| 'large' \| 'x-large'` | `'mini'` | mini, small, regular, large, x-large |
| `type` | `'image' \| 'initials' \| 'icon'` | `'image'` | image, initials, icon |
| `showStatus` | `boolean` | `true` | - |
| `initialsText` | `string` | `'AB'` | - |
| `src` | `string` | `''` | - |
| `alt` | `string` | `''` | - |
| `name` | `string` | `''` | - |
| `statusLabel` | `string` | `'Online'` | - |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { Avatar } from '@supernova/design-system/react';

export default function App() {
  return <Avatar size="mini" type="image" showStatus />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Avatar } from '@supernova/design-system/vue3';
</script>

<template>
  <Avatar size="mini" type="image" showStatus />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Avatar } from '@supernova/design-system/svelte';
</script>

<Avatar size="mini" type="image" showStatus />
```

:::
