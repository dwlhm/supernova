# Tabs

A horizontal tab bar composed of Tab Item instances. It provides up to eight tabs for switching between related content views or categories.

When to use
Use Tabs when users need to move between peer views within the same context without leaving the page. Do not use it for sequential steps or primary site navigation.

Usage guidelines
• Use two to eight tabs with concise, parallel labels.
• Keep one tab active and ensure its content is visible.
• Order tabs by importance, frequency, or a natural sequence.
• Hide unused tabs instead of leaving empty labels.
• Avoid overcrowding; use another navigation pattern if labels no longer fit clearly.

Properties
• Tab 3–Tab 8 — Show or hide the corresponding optional tab.
• Tab 1 and Tab 2 are always visible.
• Configure each nested Tab Item instance to set its label, icon, numeric value, and state.

## Live Preview

<FrameworkPreview name="Tabs" />

## Usage

::: code-group

```tsx [React]
import { Tabs } from './Tabs';

export default function Example() {
  return (
    <Tabs>
      Tabs
    </Tabs>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Tabs } from './Tabs';
</script>

<template>
  <Tabs>
    Tabs
  </Tabs>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Tabs from './Tabs.svelte';
</script>

<Tabs>
  Tabs
</Tabs>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TabsComponent],
  template: `
    <app-tabs>
      Tabs
    </app-tabs>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
