# TablerTruckDelivery

Tabler Icons — truck-delivery

## Live Preview

<FrameworkPreview name="IconTruckDelivery" />

## Usage

::: code-group

```tsx [React]
import { TablerTruckDelivery } from './TablerTruckDelivery';

export default function Example() {
  return (
    <TablerTruckDelivery>
      TablerTruckDelivery
    </TablerTruckDelivery>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { TablerTruckDelivery } from './TablerTruckDelivery';
</script>

<template>
  <TablerTruckDelivery>
    TablerTruckDelivery
  </TablerTruckDelivery>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import TablerTruckDelivery from './TablerTruckDelivery.svelte';
</script>

<TablerTruckDelivery>
  TablerTruckDelivery
</TablerTruckDelivery>
```

```ts [Angular]
import { Component } from '@angular/core';
import { TablerTruckDeliveryComponent } from './tabler-truck-delivery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TablerTruckDeliveryComponent],
  template: `
    <app-tabler-truck-delivery>
      TablerTruckDelivery
    </app-tabler-truck-delivery>
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
