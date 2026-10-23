# Button

A versatile interactive component for user actions and link-styled navigation. It supports multiple emphasis levels, sizes, corner treatments, interaction states, optional leading and trailing icons, and an editable label.

WHEN TO USE
• Use for actions such as submitting a form, confirming a decision, starting a workflow, or performing an operation.
• Use one clear Primary button for the preferred action at each decision point.
• Use Secondary, Outline, or Ghost for supporting actions.
• Use Destructive for dangerous or irreversible actions.
• Use Style=Link for navigation to another destination and implement it semantically as a hyperlink.

USAGE GUIDELINES
• Use a clear, concise, action-oriented label that ideally begins with a verb.
• Match visual emphasis to the importance of the action.
• Keep icon usage purposeful: leading icons can reinforce meaning, while trailing icons can indicate direction or continuation.
• Keep the label visible unless the icon is universally understood and has an accessible name.
• Use Disabled sparingly and explain why an action is unavailable when needed.
• Do not use Hover, Focus, or Pressed as resting states; they communicate interaction feedback or progress.
• Keep button hierarchy and sizing consistent within the same action group.

PROPERTIES
• Style — Primary, Secondary, Outline, Ghost, Destructive, or Link. Controls visual emphasis and semantic intent.
• Size — Large, Regular, Small, or Mini. Controls dimensions and density.
• Roundness — Default or Round. Controls corner treatment.
• State — Default, Hover, Focus, Pressed, or Disabled. Represents interaction and availability.
• Label — Changes the button text.
• Show Label — Shows or hides the text label.
• Show left icon / Show right icon — Toggles the leading or trailing icon.
• Left icon / Right icon — Swaps the icon shown in the corresponding position.

## Live Preview

<FrameworkPreview name="Button" />

## Usage

::: code-group

```tsx [React]
import { Button } from './Button';

export default function Example() {
  return (
    <Button label="Label" roundness="Default">
      Button
    </Button>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Button } from './Button';
</script>

<template>
  <Button label="Label" roundness="Default">
    Button
  </Button>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Button from './Button.svelte';
</script>

<Button label="Label" roundness="Default">
  Button
</Button>
```

```ts [Angular]
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button label="Label" roundness="Default">
      Button
    </app-button>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Label` | `text` | `Label` | - |
| `Roundness` | ``Default` \| `Round`` | `Default` | - |
| `Show Label` | `boolean` | `true` | - |
| `Show left icon` | `boolean` | `false` | - |
| `Show right icon` | `boolean` | `false` | - |
| `Size` | ``Regular` \| `Large` \| `Small` \| `Mini`` | `Regular` | - |
| `State` | ``Default` \| `Focus` \| `Disabled` \| `Pressed`` | `Default` | - |
| `Style` | ``Primary` \| `Secondary` \| `Outline` \| `Destructive` \| `Link`` | `Primary` | - |
| `⮑ Left icon` | `instance_swap` | `2367:20856` | - |
| `⮑ Right icon` | `instance_swap` | `2367:20856` | - |

## Accessibility (a11y)

- **Native Semantics**: Renders a semantic `<button>` element with built-in accessibility semantics.
- **Keyboard Activation**: Fully operable using both the <kbd>Enter</kbd> and <kbd>Space</kbd> keys.
- **Focus Indicator**: Visible `:focus-visible` outline must not be suppressed without providing an accessible alternative.
- **State Announcement**: Use `aria-disabled="true"` or native `disabled` attribute to convey unclickable states to screen readers.
