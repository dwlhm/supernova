# MainMenu

A primary navigation item used for top-level destinations in the sidebar. It supports interaction and selection states, optional leading and trailing icons, and an optional status badge.


When to use
Use for primary sections or destinations in the application's main navigation.
Use Active for the current destination and interaction states only while the related interaction occurs.


Usage guidelines
Keep labels short, specific, and action-oriented where appropriate.
Use only one active item within the same navigation level.
Use badges sparingly for meaningful status or newly introduced content.
Show a trailing icon only when it communicates disclosure, navigation, or a relevant action.
Do not use hover as the only indication that an item is interactive.


Properties
State — Default, Hover, Pressed, Active, or Active-Hover.
Label — Sets the menu item text.
Show label — Shows or hides the text label.
Leading icon — Replaces the leading icon instance.
Show leading icon — Shows or hides the leading icon.
Show trailing icon — Shows or hides the trailing icon.
Show badge — Shows or hides the badge.
Badge label — Sets the badge text.

## Live Preview

<FrameworkPreview name="MainMenu" />

## Usage

::: code-group

```tsx [React]
import { MainMenu } from './MainMenu';

export default function Example() {
  return (
    <MainMenu badge label="New" label="Menu">
      MainMenu
    </MainMenu>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { MainMenu } from './MainMenu';
</script>

<template>
  <MainMenu badge label="New" label="Menu">
    MainMenu
  </MainMenu>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import MainMenu from './MainMenu.svelte';
</script>

<MainMenu badge label="New" label="Menu">
  MainMenu
</MainMenu>
```

```ts [Angular]
import { Component } from '@angular/core';
import { MainMenuComponent } from './main-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainMenuComponent],
  template: `
    <app-main-menu badge label="New" label="Menu">
      MainMenu
    </app-main-menu>
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
| `State` | ``Default` \| `Hover` \| `Pressed` \| `Active` \| `Active-Hover`` | `Default` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
