# TabItem

A single tab item used inside the Tabs component. It supports a text label, an optional leading icon, an optional numeric value, and Default or Active states.

## When to Use

- Use Tab Item to represent one destination, content view, or category within a tab bar. Use it as part of Tabs rather than as a standalone control.

## Usage Guidelines

- Use short, distinct labels that clearly describe each destination.
- Keep only one tab active within a tab group.
- Show an icon only when it improves recognition; use icons consistently across sibling tabs.
- Use the numeric value for concise counts, such as unread or filtered items.

## Interactive Preview

<ComponentPreview name="TabItem" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Label'` | - |
| `showIcon` | `boolean` | `false` | - |
| `showNum` | `boolean` | `false` | - |
| `num` | `string` | `'1'` | - |
| `active` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `id` | `string` | `-` | - |
| `controlsId` | `string` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { TabItem } from '@supernova/design-system/react';

export default function App() {
  return <TabItem label="Label" showIcon={false} showNum={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TabItem } from '@supernova/design-system/vue3';
</script>

<template>
  <TabItem label="Label" :showIcon="false" :showNum="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { TabItem } from '@supernova/design-system/svelte';
</script>

<TabItem label="Label" showIcon={false} showNum={false} />
```

:::
