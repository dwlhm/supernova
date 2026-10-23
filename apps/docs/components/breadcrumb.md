# Breadcrumb

Description
A breadcrumb navigation component that communicates the user's current location within a hierarchical structure and provides a clear path back to higher levels.


When to use
Use on pages that are nested within a clear hierarchy.
Use when users may need to move quickly to a parent level.
Use in content-heavy products, settings, catalogs, or multi-level navigation.
Do not use as a replacement for primary navigation or for flat page structures.


Usage guidelines
Keep labels concise, recognizable, and consistent with page titles.
Arrange items from the highest level to the current page.
Treat the final item as the current location; it should not navigate to itself.
Use the shortest variant that accurately represents the hierarchy.
For long paths, use the deep variant with an ellipsis to collapse intermediate levels.
Keep separators visually consistent and ensure interactive items have clear hover and focus states.


Properties
Type — Controls the hierarchy depth: 1, 2, or deep.
Show Ellipsis — Shows or hides the collapsed-path indicator. Use primarily with Type=deep when intermediate levels are omitted.

## Live Preview

<FrameworkPreview name="Breadcrumb" />

## Usage

::: code-group

```tsx [React]
import { Breadcrumb } from './Breadcrumb';

export default function Example() {
  return (
    <Breadcrumb show Ellipsis type="2">
      Breadcrumb
    </Breadcrumb>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Breadcrumb } from './Breadcrumb';
</script>

<template>
  <Breadcrumb show Ellipsis type="2">
    Breadcrumb
  </Breadcrumb>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Breadcrumb from './Breadcrumb.svelte';
</script>

<Breadcrumb show Ellipsis type="2">
  Breadcrumb
</Breadcrumb>
```

```ts [Angular]
import { Component } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <app-breadcrumb show Ellipsis type="2">
      Breadcrumb
    </app-breadcrumb>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Show Ellipsis` | `boolean` | `true` | - |
| `Type` | ``2` \| `deep` \| `1`` | `2` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
