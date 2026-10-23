# Sidebar

A persistent vertical navigation shell that organizes brand, primary navigation, and account-related content. It supports expanded and collapsed layouts so the navigation can adapt to the available workspace.


When to use
Use as the primary navigation container for desktop application layouts.
Use the collapsed variant when horizontal space is limited or users need more room for page content.


Usage guidelines
Place product identity or a logo in Brand content.
Place the primary menu structure in Navigation content.
Place profile, workspace, or account controls in Account content.
Keep navigation order and icon meaning consistent between expanded and collapsed states.
Provide accessible labels or tooltips when labels are hidden.


Properties
Expanded — Controls the layout: True shows the full sidebar; False shows the compact sidebar.
Brand content — Slot for product or workspace identity.
Navigation content — Slot for the main navigation menu.
Account content — Slot for user and account controls.

## Live Preview

<FrameworkPreview name="Sidebar" />

## Usage

::: code-group

```tsx [React]
import { Sidebar } from './Sidebar';

export default function Example() {
  return (
    <Sidebar account content="default" brand content="default">
      Sidebar
    </Sidebar>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Sidebar } from './Sidebar';
</script>

<template>
  <Sidebar account content="default" brand content="default">
    Sidebar
  </Sidebar>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Sidebar from './Sidebar.svelte';
</script>

<Sidebar account content="default" brand content="default">
  Sidebar
</Sidebar>
```

```ts [Angular]
import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <app-sidebar account content="default" brand content="default">
      Sidebar
    </app-sidebar>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Account content` | `slot` | - | Replace the footer account or profile content. |
| `Brand content` | `slot` | - | Replace the sidebar brand or logo content. |
| `Expanded` | ``True` \| `False`` | `True` | - |
| `Navigation content` | `slot` | - | Replace the complete navigation content while retaining the sidebar shell. |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
