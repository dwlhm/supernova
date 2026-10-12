# MenuItem

A secondary or expandable navigation item used within a menu hierarchy. It supports optional icons and badges, plus a submenu content slot for nested destinations.


When to use
Use for secondary destinations or parent items that reveal nested navigation.
Use Active when the item is selected or its submenu is expanded.


Usage guidelines
Keep labels concise and clearly related to their parent section.
Use the trailing icon to communicate expansion when submenu content is available.
Keep nesting shallow and preserve a clear visual relationship between parent and submenu items.
Use badges only for meaningful, concise status information.


Properties
State — Default, Hover, or Active.
Label — Sets the menu item text.
Show label — Shows or hides the text label.
Leading icon — Replaces the leading icon instance.
Show leading icon — Shows or hides the leading icon.
Show trailing icon — Shows or hides the trailing icon.
Show badge — Shows or hides the badge.
Badge label — Sets the badge text.
Submenu content — Slot for nested navigation content.

## Usage

::: code-group

```tsx [React]
import { MenuItem } from './MenuItem';

export default function Example() {
  return (
    <MenuItem badge label="New" label="Menu">
      MenuItem
    </MenuItem>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { MenuItem } from './MenuItem';
</script>

<template>
  <MenuItem badge label="New" label="Menu">
    MenuItem
  </MenuItem>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import MenuItem from './MenuItem.svelte';
</script>

<MenuItem badge label="New" label="Menu">
  MenuItem
</MenuItem>
```

```ts [Angular]
import { Component } from '@angular/core';
import { MenuItemComponent } from './menu-item.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuItemComponent],
  template: `
    <app-menu-item badge label="New" label="Menu">
      MenuItem
    </app-menu-item>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Badge label` | `text` | `New` | - |
| `Label` | `text` | `Menu` | - |
| `Leading icon` | `instance_swap` | `2410:29475` | - |
| `Show badge` | `boolean` | `false` | - |
| `Show label` | `boolean` | `true` | - |
| `Show leading icon` | `boolean` | `true` | - |
| `Show trailing icon` | `boolean` | `true` | - |
| `State` | ``Default` \| `Hover` \| `Active`` | `Default` | - |
| `Submenu content` | `slot` | - | Replace the submenu list. |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
