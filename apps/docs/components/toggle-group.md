# ToggleGroup

Description
A toggle group organizes several related switch controls into one scannable settings section. Each switch remains independent, while the shared layout and optional group label communicate their relationship.

When to use
Use when two to five related settings should be presented together.
Use when each option can be enabled or disabled independently.
Use in settings pages, preference panels, filters, or configuration forms.
Do not use when users must choose only one option; use a radio group or segmented control instead.

Usage guidelines
Give the group a concise label when the relationship between options is not self-evident.
Write each toggle label as a clear setting name with an unambiguous on state.
Show only the number of toggle rows needed; hide unused rows.
Keep the size consistent with surrounding controls and interface density.
Order options logically, placing the most common or important settings first.
Explain unavailable options near the affected toggle rather than at the group level.

Properties
Size: Small, Medium, or Large. Use Medium for most standard layouts.
Show Label: Shows or hides the group label.
Show Toggle 1: Shows or hides the first toggle row.
Show Toggle 2: Shows or hides the second toggle row.
Show Toggle 3: Shows or hides the third toggle row.
Show Toggle 4: Shows or hides the fourth toggle row.
Show Toggle 5: Shows or hides the fifth toggle row.

## Usage

::: code-group

```tsx [React]
import { ToggleGroup } from './ToggleGroup';

export default function Example() {
  return (
    <ToggleGroup show Toggle 1 show Toggle 2>
      ToggleGroup
    </ToggleGroup>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { ToggleGroup } from './ToggleGroup';
</script>

<template>
  <ToggleGroup show Toggle 1 show Toggle 2>
    ToggleGroup
  </ToggleGroup>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import ToggleGroup from './ToggleGroup.svelte';
</script>

<ToggleGroup show Toggle 1 show Toggle 2>
  ToggleGroup
</ToggleGroup>
```

```ts [Angular]
import { Component } from '@angular/core';
import { ToggleGroupComponent } from './toggle-group.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToggleGroupComponent],
  template: `
    <app-toggle-group show Toggle 1 show Toggle 2>
      ToggleGroup
    </app-toggle-group>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Show Toggle 1` | `boolean` | `true` | - |
| `Show Toggle 2` | `boolean` | `true` | - |
| `Show Toggle 3` | `boolean` | `true` | - |
| `Show Toggle 4` | `boolean` | `true` | - |
| `Show Toggle 5` | `boolean` | `true` | - |
| `Size` | ``Medium` \| `Small` \| `Large`` | `Small` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
