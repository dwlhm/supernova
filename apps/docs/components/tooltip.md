# Tooltip

Tooltip provides brief contextual information about a UI element without interrupting the user’s workflow.

WHEN TO USE
• Explain unfamiliar icons, controls, or abbreviated labels.
• Add helpful context that is useful but not essential to completing a task.
• Reveal supporting information on hover, keyboard focus, or a short press.
• Do not use for critical instructions, validation errors, or content users must remember.

USAGE GUIDELINES
• Keep the message concise—prefer a short phrase or one sentence.
• Place the tooltip close to its trigger without covering important content.
• Choose the position with the most available space; avoid clipping at viewport edges.
• Keep terminology direct and consistent with the trigger label.
• Avoid interactive controls, links, or long-form content inside a tooltip.
• Ensure the same information is available to keyboard and touch users.

PROPERTIES
• Position: Top, Bottom, Left, or Right. Controls where the tooltip appears relative to its trigger.
• Text content: Overrides the tooltip message for the instance.

## Live Preview

<FrameworkPreview name="Tooltip" />

## Usage

::: code-group

```tsx [React]
import { Tooltip } from './Tooltip';

export default function Example() {
  return (
    <Tooltip position="Top" text content="Label">
      Tooltip
    </Tooltip>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Tooltip } from './Tooltip';
</script>

<template>
  <Tooltip position="Top" text content="Label">
    Tooltip
  </Tooltip>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Tooltip from './Tooltip.svelte';
</script>

<Tooltip position="Top" text content="Label">
  Tooltip
</Tooltip>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TooltipComponent],
  template: `
    <app-tooltip position="Top" text content="Label">
      Tooltip
    </app-tooltip>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Position` | ``Top` \| `Bottom` \| `Left` \| `Right`` | `Top` | - |
| `Text content` | `text` | `Label` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
