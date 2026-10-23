# Checkbox

A checkbox lets users select or clear one or more independent options. It supports selected and unselected states, three sizes, disabled states, and optional labels on either side.


When to use
Use for optional, independent choices where more than one option may be selected.
Use for confirmations, consent, preferences, and multi-select lists.
Use when the result is applied after a user action such as Save or Submit.
Do not use for mutually exclusive choices; use radio buttons instead.
Do not use for an action that takes effect immediately; use a switch instead.


Usage guidelines
Pair the checkbox with a short, clear label that describes the choice.
Prefer a right-side label for left-to-right interfaces; use a left-side label only when the layout requires it.
Use only one label position at a time.
Keep related checkboxes vertically aligned and group them under a clear heading when needed.
Avoid preselecting an option unless it is safe, expected, and easy to reverse.
Use the disabled state only when the option is unavailable, and explain why when the reason is not obvious.


Properties
State: off (unselected) or on (selected).
Size: Small, Medium, or Large. Match the surrounding control density and touch-target requirements.
Disabled: false for interactive use or true when the control is unavailable.
leftLabel: Shows or hides the label on the left side.
rightLabel: Shows or hides the label on the right side.

## Live Preview

<FrameworkPreview name="Checkbox" />

## Usage

::: code-group

```tsx [React]
import { Checkbox } from './Checkbox';

export default function Example() {
  return (
    <Checkbox disabled="false" size="Small">
      Checkbox
    </Checkbox>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Checkbox } from './Checkbox';
</script>

<template>
  <Checkbox disabled="false" size="Small">
    Checkbox
  </Checkbox>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Checkbox from './Checkbox.svelte';
</script>

<Checkbox disabled="false" size="Small">
  Checkbox
</Checkbox>
```

```ts [Angular]
import { Component } from '@angular/core';
import { CheckboxComponent } from './checkbox.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <app-checkbox disabled="false" size="Small">
      Checkbox
    </app-checkbox>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Disabled` | ``false` \| `true`` | `false` | - |
| `Size` | ``Medium` \| `Small` \| `Large`` | `Small` | - |
| `State` | ``off` \| `on`` | `off` | - |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
