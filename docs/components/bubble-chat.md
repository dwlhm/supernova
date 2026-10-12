# BubbleChat

Bubble Chat displays a message inside a conversation thread. It supports incoming and outgoing messages with text, file, image, or video content, including delivery-error states.

WHEN TO USE
• Use in chat, support, inbox, messaging, and collaboration experiences.
• Use Incoming for messages received from another participant.
• Use Outgoing for messages created by the current user.
• Use attachment types only when the message contains the corresponding media.
• Use Error only when sending or uploading has failed.

USAGE GUIDELINES
• Keep message copy concise and conversational.
• Choose the Type that matches the primary content.
• Keep timestamps consistent within a conversation.
• Show delivery status only when it provides useful feedback.
• Use Custom text for optional supporting information, not the primary message.
• Error messages should explain the failure and, when possible, support a retry action nearby.

PROPERTIES
• Direction: Incoming | Outgoing
• Type: Text | File | Image | Video
• State: Default | Error
• Show time: Shows or hides the timestamp.
• Show status: Shows or hides delivery status in Default state.
• Show custom text: Shows or hides supplementary copy.
• Editable text properties: Custom text, Text message, File name, File metadata, Image name, Image metadata, Video name, Video metadata, Incoming status text, Outgoing status text, Error status text, Incoming time text, Outgoing time text.

## Usage

::: code-group

```tsx [React]
import { BubbleChat } from './BubbleChat';

export default function Example() {
  return (
    <BubbleChat custom text="Additional information" direction="Incoming">
      BubbleChat
    </BubbleChat>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { BubbleChat } from './BubbleChat';
</script>

<template>
  <BubbleChat custom text="Additional information" direction="Incoming">
    BubbleChat
  </BubbleChat>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import BubbleChat from './BubbleChat.svelte';
</script>

<BubbleChat custom text="Additional information" direction="Incoming">
  BubbleChat
</BubbleChat>
```

```ts [Angular]
import { Component } from '@angular/core';
import { BubbleChatComponent } from './bubble-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BubbleChatComponent],
  template: `
    <app-bubble-chat custom text="Additional information" direction="Incoming">
      BubbleChat
    </app-bubble-chat>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Custom text` | `text` | `Additional information` | - |
| `Direction` | ``Incoming` \| `Outgoing`` | `Incoming` | - |
| `Error status text` | `text` | `Failed to send` | - |
| `File metadata` | `text` | `2.4 MB` | - |
| `File name` | `text` | `document.pdf` | - |
| `Image metadata` | `text` | `3.4 MB` | - |
| `Image name` | `text` | `image.jpg` | - |
| `Incoming status text` | `text` | `Received` | - |
| `Incoming time text` | `text` | `10:24 AM` | - |
| `Outgoing status text` | `text` | `Delivered` | - |
| `Outgoing time text` | `text` | `10:26 AM` | - |
| `Show custom text` | `boolean` | `false` | - |
| `Show status` | `boolean` | `false` | - |
| `Show time` | `boolean` | `true` | - |
| `State` | ``Default` \| `Error`` | `Default` | - |
| `Text message` | `text` | `Message` | - |
| `Type` | ``Text` \| `File` \| `Image` \| `Video`` | `Text` | - |
| `Video metadata` | `text` | `24.8 MB • 01:08` | - |
| `Video name` | `text` | `video.mp4` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
