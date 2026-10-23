# Toast

A brief, non-intrusive notification that communicates the status of an action or process without interrupting the user’s workflow.

WHEN TO USE
• Confirm that an action completed successfully.
• Report an error or warn about a condition that may require attention.
• Provide short, time-sensitive system information.
• Use for feedback that does not require an immediate decision. For blocking or complex messages, use an alert or dialog instead.

USAGE GUIDELINES
• Keep the title concise and action-oriented; add a description only when extra context is necessary.
• Choose the Type that matches the message intent, not its visual prominence.
• Use one optional action for a clear, reversible, or follow-up task.
• Show the close button when users may need to dismiss a persistent toast.
• Show the timestamp only when message recency is useful.
• Avoid stacking many toasts, duplicating inline validation, or using toasts for critical information that must remain visible.

PROPERTIES
• Type — Default, Success, Error, Warning, or Info.
• State — Default, Hover, or Pressed.
• Toast Text — Primary message.
• Description Text — Supporting details.
• Action Text — Label for the optional action.
• Show Description — Shows or hides supporting text.
• Show Action Button — Shows or hides the action.
• Show Close Button — Shows or hides dismiss control.
• clock — Shows or hides the timestamp.

## Live Preview

<FrameworkPreview name="Toast" />

## Usage

::: code-group

```tsx [React]
import { Toast } from './Toast';

export default function Example() {
  return (
    <Toast action Text="Undo" description Text="Toast description text here">
      Toast
    </Toast>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Toast } from './Toast';
</script>

<template>
  <Toast action Text="Undo" description Text="Toast description text here">
    Toast
  </Toast>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Toast from './Toast.svelte';
</script>

<Toast action Text="Undo" description Text="Toast description text here">
  Toast
</Toast>
```

```ts [Angular]
import { Component } from '@angular/core';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastComponent],
  template: `
    <app-toast action Text="Undo" description Text="Toast description text here">
      Toast
    </app-toast>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Action Text` | `text` | `Undo` | - |
| `Description Text` | `text` | `Toast description text here` | - |
| `Show Action Button` | `boolean` | `false` | - |
| `Show Close Button` | `boolean` | `false` | - |
| `Show Description` | `boolean` | `false` | - |
| `State` | ``Default` \| `Hover` \| `Pressed`` | `Default` | - |
| `Toast Text` | `text` | `Toast Text` | - |
| `Type` | ``Default` \| `Success` \| `Error` \| `Warning` \| `Info`` | `Default` | - |
| `clock` | `boolean` | `true` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
