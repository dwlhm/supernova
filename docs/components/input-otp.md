# InputOTP

A one-time password input for entering short verification or authentication codes.

## When to Use

- Use in sign-in, account recovery, transaction approval, or identity-verification flows.
- Use only for temporary codes sent through a trusted channel.
- Use a standard text input for permanent passwords or recovery keys.

## Usage Guidelines

- State where the code was sent without exposing sensitive contact details.
- Allow paste and automatic code retrieval when supported.
- Move focus naturally between cells and support keyboard correction.
- Show expiration and resend guidance near the input.
- Use a clear error message for incomplete, expired, or incorrect codes.

## Interactive Preview

<ComponentPreview name="InputOTP" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `labelText` | `string` | `'Label'` | - |
| `hintErrorText` | `string` | `'Please enter the one-time password sent to your phone.'` | - |
| `showRequired` | `boolean` | `false` | - |
| `showHint` | `boolean` | `true` | - |
| `showLabel` | `boolean` | `true` | - |
| `variant` | `'Default' \| 'Focus' \| 'Filled' \| 'Error' \| 'Disabled'` | `'Default'` | Default, Focus, Filled, Error, Disabled |
| `length` | `number` | `6` | - |
| `value` | `string` | `''` | - |
| `id` | `string` | `'input-otp'` | - |
| `name` | `string` | `'one-time-password'` | - |
| `disabled` | `boolean` | `false` | - |
| `error` | `boolean` | `false` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onComplete` | `(value: string) => void` | `-` | - |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { InputOTP } from '@supernova/design-system/react';

export default function App() {
  return <InputOTP labelText="Label" hintErrorText="Please enter the one-time password sent to your phone." showRequired={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { InputOTP } from '@supernova/design-system/vue3';
</script>

<template>
  <InputOTP labelText="Label" hintErrorText="Please enter the one-time password sent to your phone." :showRequired="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { InputOTP } from '@supernova/design-system/svelte';
</script>

<InputOTP labelText="Label" hintErrorText="Please enter the one-time password sent to your phone." showRequired={false} />
```

:::
