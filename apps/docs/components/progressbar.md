# Progressbar

A horizontal progress bar that communicates how much of an ongoing process has been completed.


When to use
Use for tasks with measurable progress, such as uploads, downloads, installations, onboarding, or multi-step processing.
Use when progress can be represented as a percentage or a known fraction of completion.
Do not use for activity with an unknown duration; use an indeterminate loading indicator instead.


Usage guidelines
Keep the track width consistent within the same flow.
Update progress from left to right and avoid moving backward unless the underlying process genuinely regresses.
Pair the bar with a percentage or short status label when users need precise progress information.
Do not use color alone to communicate status; provide supporting text when status is important.
Show completion clearly at 100%, then transition to the completed state or next step.


Properties
Progress: Represented by the width of the active indicator relative to the full track.
Track: The full width that represents the total process.
Indicator: The filled portion that represents completed progress.
Component properties: No exposed component properties are currently configured.


Variants
No predefined variants are currently configured for this component.

## Usage

::: code-group

```tsx [React]
import { Progressbar } from './Progressbar';

export default function Example() {
  return (
    <Progressbar>
      Progressbar
    </Progressbar>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Progressbar } from './Progressbar';
</script>

<template>
  <Progressbar>
    Progressbar
  </Progressbar>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Progressbar from './Progressbar.svelte';
</script>

<Progressbar>
  Progressbar
</Progressbar>
```

```ts [Angular]
import { Component } from '@angular/core';
import { ProgressbarComponent } from './progressbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProgressbarComponent],
  template: `
    <app-progressbar>
      Progressbar
    </app-progressbar>
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
