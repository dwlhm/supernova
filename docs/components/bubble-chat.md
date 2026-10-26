# BubbleChat

Bubble Chat displays a message inside a conversation thread. It supports incoming and outgoing messages with text, file, image, or video content, including delivery-error states.

## When to Use

- Use in chat, support, inbox, messaging, and collaboration experiences.
- Use Incoming for messages received from another participant.
- Use Outgoing for messages created by the current user.
- Use attachment types only when the message contains the corresponding media.
- Use Error only when sending or uploading has failed.

## Usage Guidelines

- Keep message copy concise and conversational.
- Choose the Type that matches the primary content.
- Keep timestamps consistent within a conversation.
- Show delivery status only when it provides useful feedback.
- Use Custom text for optional supporting information, not the primary message.
- Error messages should explain the failure and, when possible, support a retry action nearby.

## Interactive Preview

<ComponentPreview name="BubbleChat" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `direction` | `'Incoming' \| 'Outgoing'` | `'Incoming'` | Incoming, Outgoing |
| `type` | `'Text' \| 'File' \| 'Image' \| 'Video'` | `'Text'` | Text, File, Image, Video |
| `messageState` | `'Default' \| 'Error'` | `'Default'` | Default, Error |
| `showTime` | `boolean` | `true` | - |
| `showStatus` | `boolean` | `false` | - |
| `showCustomText` | `boolean` | `false` | - |
| `customText` | `string` | `'Additional information'` | - |
| `textMessage` | `string` | `'Message'` | - |
| `fileName` | `string` | `'document.pdf'` | - |
| `fileMetadata` | `string` | `'2.4 MB'` | - |
| `imageName` | `string` | `'image.jpg'` | - |
| `imageMetadata` | `string` | `'3.4 MB'` | - |
| `videoName` | `string` | `'video.mp4'` | - |
| `videoMetadata` | `string` | `'24.8 MB • 01:08'` | - |
| `incomingStatusText` | `string` | `'Received'` | - |
| `outgoingStatusText` | `string` | `'Delivered'` | - |
| `errorStatusText` | `string` | `'Failed to send'` | - |
| `incomingTimeText` | `string` | `'10:24 AM'` | - |
| `outgoingTimeText` | `string` | `'10:26 AM'` | - |
| `className` | `string` | `''` | - |
| `children` | `any` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { BubbleChat } from '@supernova/design-system/react';

export default function App() {
  return <BubbleChat direction="Incoming" type="Text" messageState="Default" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { BubbleChat } from '@supernova/design-system/vue3';
</script>

<template>
  <BubbleChat direction="Incoming" type="Text" messageState="Default" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { BubbleChat } from '@supernova/design-system/svelte';
</script>

<BubbleChat direction="Incoming" type="Text" messageState="Default" />
```

:::
