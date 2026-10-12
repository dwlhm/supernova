# Avatar

A circular identity component used to represent a person, account, or entity. It supports profile images, initials, and a generic icon fallback across five sizes, with an optional presence indicator.


When to use
Identify a user in navigation, lists, messages, cards, profiles, and collaborative experiences.
Use image when a recognizable profile photo is available.
Use initials when no image is available but a meaningful name is known.
Use icon as the final fallback when neither an image nor initials are available.


Usage guidelines
Use regular as the default size for most product interfaces.
Choose smaller sizes for dense or inline contexts, and larger sizes for profile-focused or high-emphasis layouts.
Keep the image crop centered and use a clear, recognizable subject.
Use no more than two initials. Prefer the first letters of the person’s first and last names.
Show the status indicator only when presence information is current and meaningful.
Pair the avatar with a visible name or accessible label when identity cannot be inferred from surrounding content.
Do not use decorative imagery, logos, or status colors that conflict with the avatar’s identity purpose.


Properties
| Property | Type | Values / default | Usage |
| --- | --- | --- | --- |
| size | Variant | mini, small, regular, large, x-large | Controls visual prominence and layout density. |
| type | Variant | image, initials, icon | Selects the identity source or fallback treatment. |
| showStatus | Boolean | true | Shows or hides the presence indicator. Enable only when live status is relevant. |
| initialsText | Text | AB | Sets the initials shown by the initials variant. Use one or two uppercase characters. |

## Usage

::: code-group

```tsx [React]
import { Avatar } from './Avatar';

export default function Example() {
  return (
    <Avatar initialsText="AB" showStatus>
      Avatar
    </Avatar>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Avatar } from './Avatar';
</script>

<template>
  <Avatar initialsText="AB" showStatus>
    Avatar
  </Avatar>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Avatar from './Avatar.svelte';
</script>

<Avatar initialsText="AB" showStatus>
  Avatar
</Avatar>
```

```ts [Angular]
import { Component } from '@angular/core';
import { AvatarComponent } from './avatar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <app-avatar initialsText="AB" showStatus>
      Avatar
    </app-avatar>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialsText` | `text` | `AB` | - |
| `showStatus` | `boolean` | `true` | - |
| `size` | ``mini` \| `small` \| `regular` \| `large` \| `x-large`` | `mini` | - |
| `type` | ``image` \| `initials` \| `icon`` | `image` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
