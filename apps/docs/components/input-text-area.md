# InputTextArea

A multi-line text input for collecting longer free-form content such as messages, comments, notes, feedback, or descriptions.

WHEN TO USE
• Use when the expected response may span multiple lines.
• Use for open-ended input that benefits from a larger writing area.
• Use a single-line text input for short, predictable values.

USAGE GUIDELINES
• Keep the label visible and specific.
• Use placeholder text only as a short example, never as a replacement for the label.
• Show helper text for useful context and a specific corrective message for errors.
• Use a character count when a limit matters.
• Preserve entered content between states and use Disabled sparingly.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Placeholder text — Example shown while empty.
• Hint/Error text — Supporting guidance or validation message.
• Character Count — Current and maximum character count.
• Show required — Toggles the required indicator.
• Icon — Selects the icon used in the icon slot.
• Show Character Count — Toggles the character count.
• Show hint — Toggles supporting or error text.
• Show left icon / Show right icon — Toggles leading and trailing icons.

## Live Preview

<FrameworkPreview name="InputTextArea" />

## Usage

::: code-group

```tsx [React]
import { InputTextArea } from './InputTextArea';

export default function Example() {
  return (
    <InputTextArea character Count="0 / 200" hint/Error text="Your message will be copied to the support team.">
      InputTextArea
    </InputTextArea>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputTextArea } from './InputTextArea';
</script>

<template>
  <InputTextArea character Count="0 / 200" hint/Error text="Your message will be copied to the support team.">
    InputTextArea
  </InputTextArea>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import InputTextArea from './InputTextArea.svelte';
</script>

<InputTextArea character Count="0 / 200" hint/Error text="Your message will be copied to the support team.">
  InputTextArea
</InputTextArea>
```

```ts [Angular]
import { Component } from '@angular/core';
import { InputTextAreaComponent } from './input-text-area.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputTextAreaComponent],
  template: `
    <app-input-text-area character Count="0 / 200" hint/Error text="Your message will be copied to the support team.">
      InputTextArea
    </app-input-text-area>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Character Count` | `text` | `0 / 200` | - |
| `Hint/Error text` | `text` | `Your message will be copied to the support team.` | - |
| `Icon` | `instance_swap` | `2375:99747` | - |
| `Label text` | `text` | `Your message` | - |
| `Placeholder text` | `text` | `Type your message here.` | - |
| `Show Character Count` | `boolean` | `true` | - |
| `Show hint` | `boolean` | `true` | - |
| `Show label` | `boolean` | `true` | - |
| `Show left icon` | `boolean` | `false` | - |
| `Show required` | `boolean` | `false` | - |
| `Show right icon` | `boolean` | `false` | - |
| `State` | ``Default` \| `Focus` \| `Filled` \| `Error` \| `Disabled`` | `Default` | - |

## Accessibility (a11y)

- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.
- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.
- **Required & Disabled States**: Reflect state with `aria-required="true"` and `aria-invalid` when inputs fail validation.
