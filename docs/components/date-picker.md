# DatePicker

A date-selection component for choosing a single date, a date and time, a date range, a year, or a date expressed in natural language.

## When to Use

- Use Date Picker when users need a structured and validated way to enter date-related information. Choose the Type that matches the task and the State that reflects whether the picker surface is visible.

## Usage Guidelines

- Provide a persistent, specific field label; do not rely on placeholder text alone.
- Use Date of Birth Picker for birth dates, Picker with Input for typed or calendar-based dates, Date and Time Picker when both values are required, Natural Language Picker for relative expressions, Range Picker for start/end dates, and Year Picker when month and day are unnecessary.
- Apply reasonable minimum and maximum dates and clearly communicate unavailable dates.
- Preserve the user's locale for date order, month names, time format, and the first day of the week.
- Keep the entered value when switching between Closed and Open states.
- Ensure keyboard navigation, visible focus, and an accessible label are available in implementation.

## Interactive Preview

<ComponentPreview name="DatePicker" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `type` | `DatePickerType` | `'Date of Birth Picker'` | - |
| `pickerState` | `DatePickerVisibility` | `'Closed'` | - |
| `hintText` | `boolean` | `false` | - |
| `open` | `boolean` | `false` | - |
| `value` | `number` | `0` | - |
| `rangeEnd` | `number` | `0` | - |
| `selectedYear` | `number` | `0` | - |
| `time` | `string` | `''` | - |
| `month` | `number` | `1` | - |
| `year` | `number` | `2025` | - |
| `minDay` | `number` | `0` | - |
| `maxDay` | `number` | `0` | - |
| `minYear` | `number` | `0` | - |
| `maxYear` | `number` | `0` | - |
| `firstDayOfWeek` | `number` | `0` | - |
| `label` | `string` | `'Date'` | - |
| `placeholder` | `string` | `'Select a date'` | - |
| `hint` | `string` | `''` | - |
| `timeLabel` | `string` | `'Time'` | - |
| `showLabel` | `boolean` | `true` | - |
| `displayValue` | `string` | `''` | - |
| `typedValue` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `onSelect` | `(day: number) => void` | `-` | - |
| `onRangeEndSelect` | `(day: number) => void` | `-` | - |
| `onYearSelect` | `(year: number) => void` | `-` | - |
| `onTimeChange` | `(time: string) => void` | `-` | - |
| `onTypedInput` | `(value: string) => void` | `-` | - |
| `onOpenChange` | `(open: boolean) => void` | `-` | - |
| `onMonthChange` | `(month: number, year: number) => void` | `-` | - |

## Usage

::: code-group

```tsx [React]
import { DatePicker } from '@supernova/design-system/react';

export default function App() {
  return <DatePicker type="Date of Birth Picker" pickerState="Closed" hintText={false} />;
}
```

```vue [Vue 3]
<script setup lang="ts">
import { DatePicker } from '@supernova/design-system/vue3';
</script>

<template>
  <DatePicker type="Date of Birth Picker" pickerState="Closed" :hintText="false" />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { DatePicker } from '@supernova/design-system/svelte';
</script>

<DatePicker type="Date of Birth Picker" pickerState="Closed" hintText={false} />
```

:::
