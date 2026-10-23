# Spinner

Spinner

An indeterminate loading indicator that communicates an ongoing process when progress cannot be measured. Available in four sizes for different interface densities.

When to use
• Use while content, data, or an action is processing and the completion percentage is unknown.
• Use inside buttons or controls to confirm that an action has started.
• Use in content regions to indicate that information is being fetched or refreshed.
• For measurable or long-running tasks, use a progress indicator with explicit progress instead.

Usage guidelines
• Choose the smallest size that remains clear in its context; Size 24 is the default recommendation.
• Keep the spinner centered within its container and preserve the container dimensions to avoid layout shifts.
• Maintain sufficient contrast against the background.
• When replacing button content, preserve the button width and accessible label.
• Add concise supporting text when the loading context is not obvious or the wait may be prolonged.
• Do not use multiple prominent spinners in the same region.

Properties
• Size: 12, 16, 24, or 32
• Color: inherits the Spinner icon stroke token
• State: indeterminate
• Content: icon only

## Live Preview

<FrameworkPreview name="Spinner" />

## Usage

::: code-group

```tsx [React]
import { Spinner } from './Spinner';

export default function Example() {
  return (
    <Spinner size="12">
      Spinner
    </Spinner>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Spinner } from './Spinner';
</script>

<template>
  <Spinner size="12">
    Spinner
  </Spinner>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Spinner from './Spinner.svelte';
</script>

<Spinner size="12">
  Spinner
</Spinner>
```

```ts [Angular]
import { Component } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    <app-spinner size="12">
      Spinner
    </app-spinner>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Size` | ``12` \| `16` \| `24` \| `32`` | `12` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
