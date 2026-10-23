# FAB

Floating Action Button (FAB)

A Floating Action Button represents the most important action on a screen, such as creating, adding, composing, or starting a new task.


When to use
Use for one high-priority action that should remain easy to access.
Use only when the action is relevant to most of the screen's content.
Do not use for destructive, ambiguous, or low-frequency actions.
Avoid showing more than one prominent FAB on the same screen.


Usage guidelines
Use a clear, action-oriented icon. Add a short label when the icon alone may be unclear.
Keep placement consistent and preserve safe spacing from screen edges and other controls.
Ensure the FAB does not cover essential content, navigation, or system controls.
Use the Primary variant for the highest emphasis, Secondary for reduced emphasis, and Outline on visually dense or contrasting surfaces.
Provide an accessible name and maintain a logical focus order.
Use interaction states as specified; do not use Disabled when the action can remain available with validation or guidance.


Properties
Variant: Primary, Secondary, Outline
Size: Small (40×40), Regular (56×56), Large (96×96), Extended (120×56)
State: Default, Hover, Focus, Disabled
Label: Editable text shown only in the Extended size

## Live Preview

<FrameworkPreview name="FAB" />

## Usage

::: code-group

```tsx [React]
import { FAB } from './FAB';

export default function Example() {
  return (
    <FAB label="Label" size="Small">
      FAB
    </FAB>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { FAB } from './FAB';
</script>

<template>
  <FAB label="Label" size="Small">
    FAB
  </FAB>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import FAB from './FAB.svelte';
</script>

<FAB label="Label" size="Small">
  FAB
</FAB>
```

```ts [Angular]
import { Component } from '@angular/core';
import { FABComponent } from './fab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FABComponent],
  template: `
    <app-fab label="Label" size="Small">
      Fab
    </app-fab>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Label` | `text` | `Label` | - |
| `Size` | ``Small` \| `Regular` \| `Large` \| `Extended`` | `Small` | - |
| `State` | ``Default` \| `Hover` \| `Focus` \| `Disabled`` | `Default` | - |
| `Variant` | ``Primary` \| `Secondary` \| `Outline`` | `Primary` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
