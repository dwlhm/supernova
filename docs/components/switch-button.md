# SwitchButton

Description
A switch lets users turn one setting on or off. It communicates a binary state and should apply the change immediately.

When to use
Use for settings or preferences with two mutually exclusive states.
Use when turning a feature on or off takes effect immediately.
Use in forms, lists, and settings panels for independent binary controls.
Do not use for mutually exclusive choices in a group; use radio buttons instead.
Do not use when the change requires a separate Submit or Confirm action; use a checkbox instead.

Usage guidelines
Pair the switch with a clear label that describes the setting, not the action.
Keep labels positive and consistent so the on state is easy to understand.
Use Medium by default, Small in dense layouts, and Large for prominent or touch-focused contexts.
Preserve clear hover, focus, pressed, and state feedback in implementation.
Use the disabled state only when the setting is temporarily unavailable.
Explain why a switch is disabled when the reason is not obvious.

Properties
State: Off indicates an inactive setting; On indicates an active setting.
Disabled: False allows interaction; True makes the switch unavailable.
Size: Small, Medium, or Large.
leftLabel: Shows or hides the optional label on the left.
rightLabel: Shows or hides the optional label on the right. Prefer one label position at a time.

## Usage

::: code-group

```tsx [React]
import { SwitchButton } from './SwitchButton';

export default function Example() {
  return (
    <SwitchButton disabled="False" size="Small">
      SwitchButton
    </SwitchButton>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { SwitchButton } from './SwitchButton';
</script>

<template>
  <SwitchButton disabled="False" size="Small">
    SwitchButton
  </SwitchButton>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import SwitchButton from './SwitchButton.svelte';
</script>

<SwitchButton disabled="False" size="Small">
  SwitchButton
</SwitchButton>
```

```ts [Angular]
import { Component } from '@angular/core';
import { SwitchButtonComponent } from './switch-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SwitchButtonComponent],
  template: `
    <app-switch-button disabled="False" size="Small">
      SwitchButton
    </app-switch-button>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Disabled` | ``False` \| `True`` | `False` | - |
| `Size` | ``Medium` \| `Small` \| `Large`` | `Small` | - |
| `State` | ``Off` \| `On`` | `Off` | - |
| `leftLabel` | `boolean` | `false` | - |
| `rightLabel` | `boolean` | `false` | - |

## Accessibility (a11y)

- **Native Semantics**: Renders a semantic `<button>` element with built-in accessibility semantics.
- **Keyboard Activation**: Fully operable using both the <kbd>Enter</kbd> and <kbd>Space</kbd> keys.
- **Focus Indicator**: Visible `:focus-visible` outline must not be suppressed without providing an accessible alternative.
- **State Announcement**: Use `aria-disabled="true"` or native `disabled` attribute to convey unclickable states to screen readers.
