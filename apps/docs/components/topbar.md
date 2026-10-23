# Topbar

A horizontal application header that provides a consistent area for page-level or global controls through a flexible content slot.


When to use
Use at the top of authenticated application screens that require persistent global or contextual actions.
Use to host content such as page context, search, notifications, help, or account actions when those controls need consistent placement.


Usage guidelines
Place content in Topbar Content and prioritize the most important actions.
Keep the bar concise; move infrequent actions into menus when space is limited.
Maintain predictable control order across screens.
Avoid duplicating navigation or actions already provided by the sidebar or page header.


Properties
Topbar Content — Slot for contextual or global header content.

## Live Preview

<FrameworkPreview name="Topbar" />

## Usage

::: code-group

```tsx [React]
import { Topbar } from './Topbar';

export default function Example() {
  return (
    <Topbar>
      Topbar
    </Topbar>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Topbar } from './Topbar';
</script>

<template>
  <Topbar>
    Topbar
  </Topbar>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Topbar from './Topbar.svelte';
</script>

<Topbar>
  Topbar
</Topbar>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TopbarComponent } from './topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopbarComponent],
  template: `
    <app-topbar>
      Topbar
    </app-topbar>
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
