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

## Live Preview & Usage

<ComponentPreview name="BubbleChat" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `direction` | `'incoming' \| 'outgoing'` | `'incoming'` | incoming, outgoing |
| `type` | `'text' \| 'file' \| 'image' \| 'video'` | `'text'` | text, file, image, video |
| `messageState` | `'default' \| 'error'` | `'default'` | default, error |
| `text` | `string` | `'Message'` | - |
| `customText` | `string` | `'Additional information'` | - |
| `showCustomText` | `boolean` | `false` | - |
| `showTime` | `boolean` | `true` | - |
| `showStatus` | `boolean` | `false` | - |
| `timeText` | `string` | `'10:24 AM'` | - |
| `statusText` | `string` | `'Received'` | - |
| `errorStatusText` | `string` | `'Failed to send'` | - |
| `fileName` | `string` | `'document.pdf'` | - |
| `fileMeta` | `string` | `'2.4 MB'` | - |
| `imageName` | `string` | `'image.jpg'` | - |
| `imageMeta` | `string` | `'3.4 MB'` | - |
| `videoName` | `string` | `'video.mp4'` | - |
| `videoMeta` | `string` | `'24.8 MB • 01:08'` | - |
| `className` | `string` | `''` | - |
