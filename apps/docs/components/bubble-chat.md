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
| `state` | `'default' \| 'error'` | `'default'` | default, error |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |

### `BubbleChatFile`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |

### `BubbleChatFooter`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `align` | `'end' \| 'between'` | `'end'` | end, between |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |

### `BubbleChatMedia`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `kind` | `'image' \| 'video'` | `'image'` | image, video |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |

## Design Tokens & Color Customization

`BubbleChat` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-background-subtle` | `--color-background-subtle` | Background / Surface fill |
| `bg-destructive-subtle` | `--color-destructive-subtle` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<BubbleChat className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<BubbleChat className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
