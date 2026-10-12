# Pagination

Description
Pagination lets users navigate through content or data that is divided across multiple pages. This component includes Previous and Next controls, individual page numbers, and an ellipsis for skipped page ranges.

Variant
Default — Use the standard pagination layout when users need sequential navigation and direct access to nearby pages.

When to use
• Use for long lists, tables, search results, or collections that are split into pages.
• Use when users need to understand their current position and move to a specific page.
• Avoid pagination when all content can be displayed clearly on one page or when continuous loading is more appropriate.

Usage guidelines
• Place pagination directly below the content it controls.
• Clearly distinguish the current page from available pages.
• Disable Previous on the first page and Next on the last page.
• Use an ellipsis to compress long page ranges while keeping the first, last, current, and nearby pages accessible.
• Preserve sorting, filters, and item order when users move between pages.
• Provide accessible labels for navigation controls and indicate the current page to assistive technologies.

Properties
• No configurable component properties are currently exposed.
• The current page numbers and Previous/Next labels are defined by the component’s internal layers.

## Usage

::: code-group

```tsx [React]
import { Pagination } from './Pagination';

export default function Example() {
  return (
    <Pagination>
      Pagination
    </Pagination>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Pagination } from './Pagination';
</script>

<template>
  <Pagination>
    Pagination
  </Pagination>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import Pagination from './Pagination.svelte';
</script>

<Pagination>
  Pagination
</Pagination>
```

```ts [Angular]
import { Component } from '@angular/core';
import { PaginationComponent } from './pagination.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <app-pagination>
      Pagination
    </app-pagination>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
