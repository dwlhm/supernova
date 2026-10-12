# RadioButton

Description
A radio button lets users select exactly one option from a set of mutually exclusive choices. Radio buttons should always appear in a group of two or more options with clear labels.

When to use
Use when users must choose one option from a visible list.
Use when seeing all available options at once supports comparison.
Use for short, stable option sets.
Use a checkbox when users may select multiple options.
Use a select or dropdown when the list is long or space is limited.

Usage guidelines
Group related radio buttons under a clear question or group label.
Keep option labels concise, specific, and grammatically parallel.
Arrange options vertically when possible for easier scanning.
Use a sensible default only when it is safe and helpful.
Treat the control and its label as one interaction target in implementation.
Never use a single radio button for an independent on/off setting.
Explain why an option is disabled when the reason is not obvious.

Properties
State: off shows an unselected option; on shows the selected option.
Disabled: false allows interaction; true makes the option unavailable.
Size: Small, Medium, or Large. Use one size consistently within a group.
leftLabel: Shows or hides the optional label on the left.
rightLabel: Shows or hides the optional label on the right. Prefer one label position at a time.

## Usage

::: code-group

```tsx [React]
import { RadioButton } from './RadioButton';

export default function Example() {
  return (
    <RadioButton disabled="false" size="Small">
      RadioButton
    </RadioButton>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { RadioButton } from './RadioButton';
</script>

<template>
  <RadioButton disabled="false" size="Small">
    RadioButton
  </RadioButton>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import RadioButton from './RadioButton.svelte';
</script>

<RadioButton disabled="false" size="Small">
  RadioButton
</RadioButton>
```

```ts [Angular]
import { Component } from '@angular/core';
import { RadioButtonComponent } from './radio-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RadioButtonComponent],
  template: `
    <app-radio-button disabled="false" size="Small">
      RadioButton
    </app-radio-button>
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

- **Native Semantics**: Renders a semantic `<button>` element with built-in accessibility semantics.
- **Keyboard Activation**: Fully operable using both the <kbd>Enter</kbd> and <kbd>Space</kbd> keys.
- **Focus Indicator**: Visible `:focus-visible` outline must not be suppressed without providing an accessible alternative.
- **State Announcement**: Use `aria-disabled="true"` or native `disabled` attribute to convey unclickable states to screen readers.
