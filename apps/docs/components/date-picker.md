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

## Headless Form & Dynamic Callback Formatting (`DatePickerFormatArg`)

`DatePicker` integrates plug-and-play with [`createFormController` (`form.bindField`)](/core/headless-form) and [Date & Calendar Primitives (`parseDateInput`, `buildCalendarPanel`)](/core/headless-primitives). Both `hint` and `displayValue` accept a standard callback function `(date: DatePickerFormatArg) => string` where `date` is a native `Date` instance enriched with `{ year, month, day, iso, formatted, time, startDate, endDate, range, mode, hasValue }`:

```tsx
<DatePicker
  mode="single"
  editable={true}
  showTime={true}
  showHint={true}
  hint={(date) =>
    date.hasValue
      ? `Jadwal pengiriman: ${date.toLocaleDateString('id-ID', { dateStyle: 'long' })} pukul ${date.time}`
      : 'Ketik ekspresi seperti "besok", "3 hari lagi", atau pilih tanggal'
  }
  {...form.bindField('deliveryDate')}
/>
```

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'date-picker'` | - |
| `name` | `string` | `'date'` | - |
| `mode` | `'single' \| 'range' \| 'month' \| 'year'` | `'single'` | single, range, month, year |
| `editable` | `boolean` | `false` | - |
| `open` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `viewMode` | `string` | `''` | - |
| `value` | `number \| string` | `0` | - |
| `month` | `number` | `6` | - |
| `year` | `number` | `2025` | - |
| `selectedMonth` | `number` | `0` | - |
| `selectedYear` | `number` | `0` | - |
| `startMonth` | `number` | `0` | - |
| `startYear` | `number` | `0` | - |
| `endValue` | `number` | `9` | - |
| `endMonth` | `number` | `0` | - |
| `endYear` | `number` | `0` | - |
| `hoverValue` | `number` | `0` | - |
| `hoverMonth` | `number` | `0` | - |
| `hoverYear` | `number` | `0` | - |
| `yearGridTitle` | `string` | `'Select Year'` | - |
| `inputText` | `string` | `''` | - |
| `label` | `string` | `''` | - |
| `placeholder` | `string` | `'Select a date'` | - |
| `hint` | `string \| ((date: DatePickerFormatArg) => string)` | `''` | - |
| `displayValue` | `string \| ((date: DatePickerFormatArg) => string)` | `''` | - |
| `className` | `string` | `''` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onBlur` | `(event?: unknown) => void` | `-` | - |
| `onSelect` | `(val: number \| { year: number; month: number; day: number }) => void` | `-` | - |
| `onHoverDate` | `(val: { year: number; month: number; day: number }) => void` | `-` | - |
| `onOpenChange` | `(open: boolean) => void` | `-` | - |
| `onMonthStep` | `(delta: number) => void` | `-` | - |
| `onGridSelect` | `(value: number) => void` | `-` | - |
| `onViewModeChange` | `(mode: 'days' \| 'months' \| 'years') => void` | `-` | (mode: 'days, months, years') => void |
| `onInputChange` | `(text: string) => void` | `-` | - |

## Design Tokens & Color Customization

`DatePicker` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-background-subtle` | `--color-background-subtle` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `bg-primary-subtle` | `--color-primary-subtle` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-border-subtle` | `--color-border-subtle` | Border / Divider stroke |
| `border-destructive-border` | `--color-destructive-border` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-destructive-default` | `--color-destructive-default` | Text / Foreground color |
| `text-destructive-foreground` | `--color-destructive-foreground` | Text / Foreground color |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<DatePicker className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<DatePicker className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
