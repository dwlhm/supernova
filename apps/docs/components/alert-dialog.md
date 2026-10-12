# AlertDialog

Alert dialog asks users to explicitly confirm an important, risky, or difficult-to-reverse action before it is performed.


When to use
Before destructive actions such as deleting an account, data, or access.
When an action is permanent or may affect multiple people.
When users need to understand the consequences before proceeding.


Usage guidelines
Use a clear heading that states the decision the user must make.
Keep the description concise and explain the consequence and affected item.
Use specific action labels; avoid ambiguous labels such as “OK”.
Place the safe or cancel action first and the primary action on the right.
Hide the description only when the heading provides sufficient context. Keep it visible for high-risk actions.
Use a destructive button style when the confirmed action is destructive.


Properties
Show description — Shows or hides the supporting description.
Heading content — Sets the dialog heading.
Description content — Sets the supporting explanation or consequence.
Cancel button — Controls the content and configuration of the safe action.
Continue button — Controls the content and configuration of the primary action.

## Usage

::: code-group

```tsx [React]
import { AlertDialog } from './AlertDialog';

export default function Example() {
  return (
    <AlertDialog>
      AlertDialog
    </AlertDialog>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { AlertDialog } from './AlertDialog';
</script>

<template>
  <AlertDialog>
    AlertDialog
  </AlertDialog>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';
</script>

<AlertDialog>
  AlertDialog
</AlertDialog>
```

```ts [Angular]
import { Component } from '@angular/core';
import { AlertDialogComponent } from './alert-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlertDialogComponent],
  template: `
    <app-alert-dialog>
      AlertDialog
    </app-alert-dialog>
  `,
})
export class AppComponent {}
```

:::

## Props & Variants

This component has no configurable variant properties.

## Accessibility (a11y)

- **Role & Modal Scope**: Container must declare `role="dialog"` and `aria-modal="true"`.
- **Focus Trap**: Traps keyboard focus within the dialog until dismissed via <kbd>Esc</kbd> or close button.
- **Accessible Title**: Tagged with `aria-labelledby` referencing the dialog heading.
