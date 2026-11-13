# TimePicker

## Live Preview & Usage

<ComponentPreview name="TimePicker" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'time-picker'` | - |
| `name` | `string` | `'time'` | - |
| `value` | `string` | `''` | - |
| `defaultValue` | `string` | `''` | - |
| `editable` | `boolean` | `false` | - |
| `inputText` | `string` | `''` | - |
| `format` | `'HH:mm' \| 'HH:mm:ss'` | `'HH:mm'` | HH:mm, HH:mm:ss |
| `use12Hours` | `boolean` | `false` | - |
| `hourStep` | `number` | `1` | - |
| `minuteStep` | `number` | `1` | - |
| `secondStep` | `number` | `1` | - |
| `stepMinute` | `number` | `1` | - |
| `label` | `string` | `''` | - |
| `showLabel` | `boolean` | `true` | - |
| `placeholder` | `string` | `'Select time'` | - |
| `hint` | `string \| ((time: TimePickerFormatArg) => string)` | `''` | - |
| `showHint` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `error` | `boolean` | `false` | - |
| `errorMessage` | `string` | `''` | - |
| `validating` | `boolean` | `false` | - |
| `open` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `selectedHour` | `number` | `0` | - |
| `selectedMinute` | `number` | `0` | - |
| `selectedSecond` | `number` | `0` | - |
| `selectedPeriod` | `'AM' \| 'PM'` | `'AM'` | AM, PM |
| `onOpenChange` | `(open: boolean) => void` | `-` | - |
| `onValueChange` | `(value: string) => void` | `-` | - |
| `onBlur` | `(event?: unknown) => void` | `-` | - |
| `onHourSelect` | `(hour: number) => void` | `-` | - |
| `onMinuteSelect` | `(minute: number) => void` | `-` | - |
| `onSecondSelect` | `(second: number) => void` | `-` | - |
| `onPeriodSelect` | `(period: 'AM' \| 'PM') => void` | `-` | (period: 'AM, PM') => void |
| `onInputChange` | `(text: string) => void` | `-` | - |

## Design Tokens & Color Customization

`TimePicker` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-background-subtle` | `--color-background-subtle` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
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
<TimePicker className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<TimePicker className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
