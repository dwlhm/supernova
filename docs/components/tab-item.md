# TabItem

A single tab item used inside the Tabs component. It supports a text label, an optional leading icon, an optional numeric value, and Default or Active states.

When to use
Use Tab Item to represent one destination, content view, or category within a tab bar. Use it as part of Tabs rather than as a standalone control.

Usage guidelines
• Use short, distinct labels that clearly describe each destination.
• Keep only one tab active within a tab group.
• Show an icon only when it improves recognition; use icons consistently across sibling tabs.
• Use the numeric value for concise counts, such as unread or filtered items.

Properties
• Label — Sets the tab label.
• Show icon — Shows or hides the leading icon.
• Custom icon — Replaces the leading icon.
• Show num — Shows or hides the numeric value.
• Num — Sets the displayed numeric value.
• State — Selects Default or Active.

## Usage

::: code-group

```tsx [React]
import { TabItem } from './TabItem';

export default function Example() {
  return (
    <TabItem icon="3760:33" label="Label">
      TabItem
    </TabItem>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TabItem } from './TabItem';
</script>

<template>
  <TabItem icon="3760:33" label="Label">
    TabItem
  </TabItem>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import TabItem from './TabItem.svelte';
</script>

<TabItem icon="3760:33" label="Label">
  TabItem
</TabItem>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TabItemComponent } from './tab-item.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TabItemComponent],
  template: `
    <app-tab-item icon="3760:33" label="Label">
      TabItem
    </app-tab-item>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Icon` | `instance_swap` | `3760:33` | - |
| `Label` | `text` | `Label` | - |
| `Num` | `text` | `1` | - |
| `Show icon` | `boolean` | `false` | - |
| `Show num` | `boolean` | `false` | - |
| `State` | ``Active` \| `Default`` | `Default` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
