# Stepper

Description
A progress indicator that communicates a user’s position within a four-step process. It supports horizontal and vertical orientations. Completed steps use a check icon, the current step is highlighted, and upcoming steps remain neutral.

## When to Use

- Use for linear, multi-step flows where users should understand their current position and remaining steps.
- Use Horizontal when sufficient width is available and the flow is short.
- Use Vertical in narrow layouts, side panels, mobile screens, or when labels need more horizontal room.
- Suitable for onboarding, checkout, setup, application, and form workflows.
- Do not use for non-linear navigation, tabs, or processes with frequent branching.

## Usage Guidelines

- Keep step labels short, clear, and action-oriented.
- Present steps in the exact order users will complete them.
- Use the Current property to match the active screen or task.
- Mark a step as completed only after its required action succeeds.
- Keep the orientation and total number of steps stable during a flow.
- Pair the Stepper with explicit Back and Continue actions.

## Interactive Preview

<ComponentPreview name="Stepper" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Horizontal, Vertical |
| `current` | `'1' \| '2' \| '3' \| '4'` | `'1'` | 1, 2, 3, 4 |
| `step1Label` | `string` | `'Cart'` | - |
| `step2Label` | `string` | `'Shipping'` | - |
| `step3Label` | `string` | `'Payment'` | - |
| `step4Label` | `string` | `'Review'` | - |
| `className` | `string` | `''` | - |

## Usage

::: code-group

```tsx [React]
import { Stepper } from '@supernova/design-system/react';

export default function App() {
  return <Stepper type="Horizontal" current="1" step1Label="Cart" />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Stepper } from '@supernova/design-system/vue3';
</script>

<template>
  <Stepper type="Horizontal" current="1" step1Label="Cart" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Stepper } from '@supernova/design-system/svelte';
</script>

<Stepper type="Horizontal" current="1" step1Label="Cart" />
```

:::
