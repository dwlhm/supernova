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

## Live Preview & Usage

<ComponentPreview name="DatePicker" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `false` | - |
| `value` | `number` | `0` | - |
| `month` | `number` | `1` | - |
| `year` | `number` | `2025` | - |
| `label` | `string` | `'Date of Birth'` | - |
| `placeholder` | `string` | `'Select a date'` | - |
| `hint` | `string` | `'Choose a date from the calendar.'` | - |
| `showHint` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `displayValue` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `onSelect` | `(day: number) => void` | `-` | - |
| `onOpenChange` | `(open: boolean) => void` | `-` | - |
| `onMonthStep` | `(delta: number) => void` | `-` | - |
