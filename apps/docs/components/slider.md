# Slider

A slider allows users to select a single value from a defined range by moving a thumb along a track. The filled bar communicates the current value relative to the available range.


When to use
Use for bounded numeric settings where users benefit from seeing the value in context, such as volume, brightness, price, or intensity.
Use when an approximate or quickly adjustable value is more important than exact text entry.
Avoid using a slider when users must enter a precise value; use a numeric input instead.
Avoid using a slider for very small option sets; use radio buttons or a segmented control instead.


Usage guidelines
Pair the slider with a clear label that describes the setting.
Show the current value when precision or confirmation is important.
Communicate the minimum and maximum values when the range is not obvious.
Use a meaningful step increment and keep it consistent with the displayed value format.
Ensure the control supports keyboard interaction and exposes an accessible name and value in implementation.
Provide visible hover, focus, active, and disabled states when those states are added.


Variant
Default — A single-thumb horizontal slider with a filled value bar. This is the current standalone component; it is not yet part of a component set and has no additional Figma variants.


Properties
Value — The current selected position represented by the filled bar and thumb.
Minimum / Maximum — The lower and upper bounds of the range; defined in implementation.
Step — The increment between selectable values; defined in implementation.
State — Default, hover, focus, active, or disabled; interaction states are not currently exposed as Figma variants.
Label / Value display — Optional supporting content that should be composed outside this component.


Current Figma component properties: None exposed.

## Usage

::: code-group

```tsx [React]
import { Slider } from './Slider';

export default function Example() {
  return (
    <Slider>
      Slider
    </Slider>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Slider } from './Slider';
</script>

<template>
  <Slider>
    Slider
  </Slider>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Slider from './Slider.svelte';
</script>

<Slider>
  Slider
</Slider>
```

```ts [Angular]
import { Component } from '@angular/core';
import { SliderComponent } from './slider.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SliderComponent],
  template: `
    <app-slider>
      Slider
    </app-slider>
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
