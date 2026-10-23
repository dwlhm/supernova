# Toggle

Toggle lets users switch a single setting between off and on, with the change taking effect immediately.

When to use
• Use for binary preferences or settings with an immediate result.
• Use when users can clearly understand the effect of turning the option on or off.
• Do not use for multiple-choice decisions, required acknowledgements, or actions that need confirmation.

Usage guidelines
• Pair the toggle with a clear, concise label that describes the enabled state.
• Keep the current state visually clear and avoid relying on color alone.
• Use one size consistently within the same interface area.
• Use supporting text when the outcome may not be obvious.
• Keep disabled controls visible only when their context is useful, and explain why they are unavailable when needed.

Properties
• State — Default: off; Active: on; Disabled: unavailable for interaction.
• Size — Small: compact layouts; Medium: standard interfaces; Large: prominent or touch-focused layouts.
• Show Text — Shows or hides the accompanying text label.

## Live Preview

<FrameworkPreview name="Toggle" />

## Usage

::: code-group

```tsx [React]
import { Toggle } from './Toggle';

export default function Example() {
  return (
    <Toggle show Text={false} size="Small">
      Toggle
    </Toggle>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Toggle } from './Toggle';
</script>

<template>
  <Toggle show Text={false} size="Small">
    Toggle
  </Toggle>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Toggle from './Toggle.svelte';
</script>

<Toggle show Text={false} size="Small">
  Toggle
</Toggle>
```

```ts [Angular]
import { Component } from '@angular/core';
import { ToggleComponent } from './toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToggleComponent],
  template: `
    <app-toggle show Text={false} size="Small">
      Toggle
    </app-toggle>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Show Text` | `boolean` | `false` | - |
| `Size` | ``Medium` \| `Large` \| `Small`` | `Small` | - |
| `State` | ``Default` \| `Active` \| `Disabled`` | `Default` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
