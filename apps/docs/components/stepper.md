# Stepper

Description
A progress indicator that communicates a user’s position within a four-step process. It supports horizontal and vertical orientations. Completed steps use a check icon, the current step is highlighted, and upcoming steps remain neutral.

When to use
• Use for linear, multi-step flows where users should understand their current position and remaining steps.
• Use Horizontal when sufficient width is available and the flow is short.
• Use Vertical in narrow layouts, side panels, mobile screens, or when labels need more horizontal room.
• Suitable for onboarding, checkout, setup, application, and form workflows.
• Do not use for non-linear navigation, tabs, or processes with frequent branching.

Usage guidelines
• Keep step labels short, clear, and action-oriented.
• Present steps in the exact order users will complete them.
• Use the Current property to match the active screen or task.
• Mark a step as completed only after its required action succeeds.
• Keep the orientation and total number of steps stable during a flow.
• Pair the Stepper with explicit Back and Continue actions.

Properties
• Type: Selects Horizontal or Vertical orientation.
• Current: Selects the active step (1–4). Earlier steps appear completed and later steps appear upcoming.
• Step 1 label: Sets the first step label. Default: Cart.
• Step 2 label: Sets the second step label. Default: Shipping.
• Step 3 label: Sets the third step label. Default: Payment.
• Step 4 label: Sets the fourth step label. Default: Review.

## Usage

::: code-group

```tsx [React]
import { Stepper } from './Stepper';

export default function Example() {
  return (
    <Stepper current="1" step 1 label="Cart">
      Stepper
    </Stepper>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Stepper } from './Stepper';
</script>

<template>
  <Stepper current="1" step 1 label="Cart">
    Stepper
  </Stepper>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Stepper from './Stepper.svelte';
</script>

<Stepper current="1" step 1 label="Cart">
  Stepper
</Stepper>
```

```ts [Angular]
import { Component } from '@angular/core';
import { StepperComponent } from './stepper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StepperComponent],
  template: `
    <app-stepper current="1" step 1 label="Cart">
      Stepper
    </app-stepper>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Current` | ``1` \| `2` \| `3` \| `4`` | `1` | - |
| `Step 1 label` | `text` | `Cart` | - |
| `Step 2 label` | `text` | `Shipping` | - |
| `Step 3 label` | `text` | `Payment` | - |
| `Step 4 label` | `text` | `Review` | - |
| `Type` | ``Horizontal` \| `Vertical`` | `Horizontal` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
