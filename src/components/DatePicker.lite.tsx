import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export type DatePickerType =
  | 'Date of Birth Picker'
  | 'Picker with Input'
  | 'Date and Time Picker'
  | 'Natural Language Picker'
  | 'Range Picker'
  | 'Year Picker';

export type DatePickerVisibility = 'Closed' | 'Open';

export interface DatePickerCell {
  key: string;
  day: number;
  label: string;
  isBlank: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isDisabled: boolean;
  ariaLabel: string;
}

export interface DatePickerYearCell {
  key: string;
  year: number;
  label: string;
  isSelected: boolean;
}

export interface DatePickerOption {
  value: number;
  label: string;
}

export interface DatePickerProps {
  /** Picker flavour: date of birth, typed, date and time, natural language, range or year. */
  type?: DatePickerType;
  /** Visibility of the selection surface. */
  pickerState?: DatePickerVisibility;
  /** Shows supporting guidance beneath the field. */
  hintText?: boolean;
  /** Imperative open state, OR-ed with pickerState. */
  open?: boolean;
  /** Selected day; also the range start for the Range Picker. */
  value?: number;
  /** Range end day for the Range Picker. */
  rangeEnd?: number;
  /** Selected year for the Year Picker. */
  selectedYear?: number;
  /** Selected time for the Date and Time Picker, e.g. 09:30. */
  time?: string;
  /** Visible month, 1-12. */
  month?: number;
  /** Visible year. */
  year?: number;
  /** First selectable day of the visible month (dates below are unavailable). */
  minDay?: number;
  /** Last selectable day of the visible month (dates above are unavailable). */
  maxDay?: number;
  /** Lower bound of the year list. */
  minYear?: number;
  /** Upper bound of the year list. */
  maxYear?: number;
  /** Locale first day of week: 0 = Sunday ... 6 = Saturday. */
  firstDayOfWeek?: number;
  /** Persistent field label. */
  label?: string;
  /** Placeholder shown while no value is present. */
  placeholder?: string;
  /** Supporting guidance rendered when hintText is true. */
  hint?: string;
  /** Label for the time field. */
  timeLabel?: string;
  /** Whether the field label renders. */
  showLabel?: boolean;
  /** Overrides the formatted value text. */
  displayValue?: string;
  /** Typed value for the Natural Language and Picker with Input variants. */
  typedValue?: string;
  className?: string;
  onSelect?: (day: number) => void;
  onRangeEndSelect?: (day: number) => void;
  onYearSelect?: (year: number) => void;
  onTimeChange?: (time: string) => void;
  onTypedInput?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onMonthChange?: (month: number, year: number) => void;
}

const WEEKDAY_BASE = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_BASE = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function DatePicker(props: DatePickerProps) {
  useDefaultProps({
    type: 'Date of Birth Picker',
    pickerState: 'Closed',
    hintText: false,
    open: false,
    value: 0,
    rangeEnd: 0,
    selectedYear: 0,
    time: '',
    month: 1,
    year: 2025,
    minDay: 0,
    maxDay: 0,
    minYear: 0,
    maxYear: 0,
    firstDayOfWeek: 0,
    label: 'Date',
    placeholder: 'Select a date',
    hint: '',
    timeLabel: 'Time',
    showLabel: true,
    displayValue: '',
    typedValue: '',
    className: '',
  });

  const state = useStore({
    visibleMonth: props.month,
    visibleYear: props.year,
    yearPage: 0,

    get weekStart() {
      return props.firstDayOfWeek >= 0 && props.firstDayOfWeek < 7 ? props.firstDayOfWeek : 0;
    },
    get weekdays() {
      const start = state.weekStart;
      const output: string[] = [];
      for (let i = 0; i < 7; i++) {
        output.push(WEEKDAY_BASE[(start + i) % 7]);
      }
      return output;
    },
    get monthOptions() {
      const output: DatePickerOption[] = [];
      for (let i = 0; i < 12; i++) {
        output.push({ value: i + 1, label: MONTH_BASE[i] });
      }
      return output;
    },
    get yearOptions() {
      const output: DatePickerOption[] = [];
      const startYear = props.minYear > 0 ? props.minYear : state.visibleYear - 100;
      const endYear = props.maxYear > 0 ? props.maxYear : state.visibleYear;
      for (let y = endYear; y >= startYear; y--) {
        output.push({ value: y, label: String(y) });
      }
      return output;
    },
    get isOpen() {
      return props.open || props.pickerState === 'Open';
    },
    get usesDropdownHeader() {
      return props.type === 'Date of Birth Picker' || props.type === 'Picker with Input';
    },
    get showsCalendar() {
      return props.type !== 'Natural Language Picker' && props.type !== 'Year Picker';
    },
    get showsTriggerButton() {
      return (
        props.type === 'Date of Birth Picker' ||
        props.type === 'Date and Time Picker' ||
        props.type === 'Year Picker'
      );
    },
    get monthLabel() {
      const index = state.visibleMonth > 0 && state.visibleMonth < 13 ? state.visibleMonth - 1 : 0;
      return MONTH_BASE[index] + ' ' + state.visibleYear;
    },
    get yearBlockStart() {
      const anchor = props.selectedYear > 0 ? props.selectedYear : state.visibleYear;
      return Math.floor(anchor / 12) * 12 + state.yearPage * 12;
    },
    get headerLabel() {
      if (props.type === 'Year Picker') {
        const blockStart = state.yearBlockStart;
        return blockStart + ' – ' + (blockStart + 11);
      }
      return state.monthLabel;
    },
    get panelLabel() {
      return props.type === 'Year Picker' ? 'Select year' : state.monthLabel;
    },
    get cells() {
      const output: DatePickerCell[] = [];
      const totalDays = new Date(state.visibleYear, state.visibleMonth, 0).getDate();
      const rawLead = new Date(state.visibleYear, state.visibleMonth - 1, 1).getDay();
      const lead = (rawLead - state.weekStart + 7) % 7;
      for (let i = 0; i < lead; i++) {
        output.push({
          key: 'lead-' + i,
          day: 0,
          label: '',
          isBlank: true,
          isSelected: false,
          isInRange: false,
          isDisabled: false,
          ariaLabel: '',
        });
      }
      for (let day = 1; day <= totalDays; day++) {
        const inRange =
          props.type === 'Range Picker' &&
          props.value > 0 &&
          props.rangeEnd > props.value &&
          day > props.value &&
          day < props.rangeEnd;
        output.push({
          key: 'day-' + day,
          day: day,
          label: String(day),
          isBlank: false,
          isSelected: props.value === day || props.rangeEnd === day,
          isInRange: inRange,
          isDisabled:
            (props.minDay > 0 && day < props.minDay) || (props.maxDay > 0 && day > props.maxDay),
          ariaLabel: state.monthLabel + ' ' + day,
        });
      }
      return output;
    },
    get yearCells() {
      const output: DatePickerYearCell[] = [];
      const blockStart = state.yearBlockStart;
      const active = props.selectedYear > 0 ? props.selectedYear : state.visibleYear;
      for (let i = 0; i < 12; i++) {
        const candidate = blockStart + i;
        output.push({
          key: 'year-' + candidate,
          year: candidate,
          label: String(candidate),
          isSelected: candidate === active,
        });
      }
      return output;
    },
    get hasValue() {
      if (props.displayValue !== '') {
        return true;
      }
      if (props.type === 'Natural Language Picker' || props.type === 'Picker with Input') {
        return props.typedValue !== '';
      }
      if (props.type === 'Year Picker') {
        return props.selectedYear > 0;
      }
      return props.value > 0;
    },
    get typedPlaceholder() {
      return props.type === 'Natural Language Picker' ? 'e.g. next Friday' : props.placeholder;
    },
    get displayText() {
      if (props.displayValue !== '') {
        return props.displayValue;
      }
      const index = state.visibleMonth > 0 && state.visibleMonth < 13 ? state.visibleMonth - 1 : 0;
      const monthName = MONTH_BASE[index];
      if (props.type === 'Natural Language Picker') {
        return props.typedValue !== '' ? props.typedValue : props.placeholder;
      }
      if (props.type === 'Picker with Input') {
        return props.typedValue !== '' ? props.typedValue : props.placeholder;
      }
      if (props.type === 'Year Picker') {
        return props.selectedYear > 0 ? String(props.selectedYear) : props.placeholder;
      }
      if (props.type === 'Range Picker') {
        if (props.value > 0 && props.rangeEnd > 0) {
          return monthName + ' ' + props.value + ' – ' + monthName + ' ' + props.rangeEnd;
        }
        if (props.value > 0) {
          return monthName + ' ' + props.value + ' – …';
        }
        return props.placeholder;
      }
      if (props.value > 0) {
        return monthName + ' ' + props.value + ', ' + state.visibleYear;
      }
      return props.placeholder;
    },
    get endDisplayText() {
      const index = state.visibleMonth > 0 && state.visibleMonth < 13 ? state.visibleMonth - 1 : 0;
      return props.rangeEnd > 0 ? MONTH_BASE[index] + ' ' + props.rangeEnd : 'End date';
    },
    get rangeSummary() {
      const index = state.visibleMonth > 0 && state.visibleMonth < 13 ? state.visibleMonth - 1 : 0;
      const monthName = MONTH_BASE[index];
      const start = props.value > 0 ? monthName + ' ' + props.value : 'Start';
      const end = props.rangeEnd > 0 ? monthName + ' ' + props.rangeEnd : 'End';
      return start + ' → ' + end;
    },
    get interpretedLabel() {
      return props.typedValue !== '' ? props.typedValue : props.placeholder;
    },

    toggle() {
      if (props.onOpenChange) {
        props.onOpenChange(!state.isOpen);
      }
    },
    handleSelect(day) {
      if (day < 1) {
        return;
      }
      if (props.type === 'Range Picker' && props.value > 0 && props.rangeEnd === 0) {
        if (props.onRangeEndSelect) {
          props.onRangeEndSelect(day);
        }
        return;
      }
      if (props.onSelect) {
        props.onSelect(day);
      }
    },
    handleYearSelect(yearValue) {
      if (props.onYearSelect) {
        props.onYearSelect(yearValue);
      }
    },
    handleTime(nextTime) {
      if (props.onTimeChange) {
        props.onTimeChange(nextTime);
      }
    },
    handleTyped(nextValue) {
      if (props.onTypedInput) {
        props.onTypedInput(nextValue);
      }
    },
    setMonth(nextMonth) {
      const parsed = parseInt(nextMonth, 10);
      if (parsed > 0 && parsed < 13) {
        state.visibleMonth = parsed;
        if (props.onMonthChange) {
          props.onMonthChange(parsed, state.visibleYear);
        }
      }
    },
    setYear(nextYear) {
      const parsed = parseInt(nextYear, 10);
      if (parsed > 0) {
        state.visibleYear = parsed;
        if (props.onMonthChange) {
          props.onMonthChange(state.visibleMonth, parsed);
        }
      }
    },
    goPrev() {
      if (props.type === 'Year Picker') {
        state.yearPage = state.yearPage - 1;
        return;
      }
      let targetMonth = state.visibleMonth - 1;
      let targetYear = state.visibleYear;
      if (targetMonth < 1) {
        targetMonth = 12;
        targetYear = targetYear - 1;
      }
      state.visibleMonth = targetMonth;
      state.visibleYear = targetYear;
      if (props.onMonthChange) {
        props.onMonthChange(targetMonth, targetYear);
      }
    },
    goNext() {
      if (props.type === 'Year Picker') {
        state.yearPage = state.yearPage + 1;
        return;
      }
      let targetMonth = state.visibleMonth + 1;
      let targetYear = state.visibleYear;
      if (targetMonth > 12) {
        targetMonth = 1;
        targetYear = targetYear + 1;
      }
      state.visibleMonth = targetMonth;
      state.visibleYear = targetYear;
      if (props.onMonthChange) {
        props.onMonthChange(targetMonth, targetYear);
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="text-sm font-medium text-components-date-picker-default-color-label-foreground-default">
          {props.label}
        </span>
      </Show>

      <div class="relative flex w-full flex-col gap-1">
        <Show when={props.type === 'Natural Language Picker'}>
          <div class="flex h-9 w-full items-center gap-2.5 rounded-components-date-picker-default-size-input-radius-default border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-3">
            <svg
              aria-hidden="true"
              class="h-4 w-4 shrink-0 text-components-date-picker-default-color-icon-foreground-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 6h16M4 12h10M4 18h7" stroke-linecap="round" />
            </svg>
            <input
              type="text"
              aria-label={props.label}
              value={props.typedValue}
              placeholder={state.typedPlaceholder}
              class="w-full min-w-0 bg-transparent text-sm text-components-date-picker-default-color-input-foreground-default focus:outline-none"
              onInput={(event) => state.handleTyped(event.target.value)}
            />
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={state.isOpen}
              aria-label="Toggle suggestions"
              class="shrink-0 rounded-components-date-picker-default-size-dropdown-radius-default p-0.5 text-components-date-picker-default-color-icon-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              onClick={() => state.toggle()}
            >
              <svg
                aria-hidden="true"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </Show>

        <Show when={props.type === 'Picker with Input'}>
          <div class="flex h-9 w-full items-center gap-2 rounded-components-date-picker-default-size-input-radius-default border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-3">
            <input
              type="text"
              aria-label={props.label}
              value={props.typedValue}
              placeholder={state.typedPlaceholder}
              class="w-full min-w-0 bg-transparent text-sm text-components-date-picker-default-color-input-foreground-default focus:outline-none"
              onInput={(event) => state.handleTyped(event.target.value)}
            />
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={state.isOpen}
              aria-label="Open calendar"
              class="shrink-0 rounded-components-date-picker-default-size-dropdown-radius-default p-0.5 text-components-date-picker-default-color-icon-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              onClick={() => state.toggle()}
            >
              <svg
                aria-hidden="true"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </Show>

        <Show when={props.type === 'Range Picker'}>
          <div class="flex w-full items-center gap-2">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={state.isOpen}
              aria-label={props.label + ' start'}
              class="flex h-9 min-w-0 flex-1 items-center rounded-components-date-picker-default-size-input-radius-default border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-3 text-left text-sm transition-colors hover:bg-components-date-picker-default-color-date-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              onClick={() => state.toggle()}
            >
              <span
                class={cn(
                  'truncate',
                  props.value > 0
                    ? 'text-components-date-picker-default-color-input-foreground-default'
                    : 'text-foreground-muted'
                )}
              >
                {state.displayText}
              </span>
            </button>
            <span aria-hidden="true" class="shrink-0 text-sm text-foreground-muted">
              –
            </span>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={state.isOpen}
              aria-label={props.label + ' end'}
              class="flex h-9 min-w-0 flex-1 items-center rounded-components-date-picker-default-size-input-radius-default border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-3 text-left text-sm transition-colors hover:bg-components-date-picker-default-color-date-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              onClick={() => state.toggle()}
            >
              <span
                class={cn(
                  'truncate',
                  props.rangeEnd > 0
                    ? 'text-components-date-picker-default-color-input-foreground-default'
                    : 'text-foreground-muted'
                )}
              >
                {state.endDisplayText}
              </span>
            </button>
          </div>
        </Show>

        <Show when={state.showsTriggerButton}>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={state.isOpen}
            aria-label={props.label}
            class="flex h-9 w-full items-center justify-between gap-2 rounded-components-date-picker-default-size-input-radius-default border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-3 text-left transition-colors hover:bg-components-date-picker-default-color-date-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            onClick={() => state.toggle()}
          >
            <span class="flex min-w-0 items-baseline gap-1.5">
              <span
                class={cn(
                  'truncate text-sm',
                  state.hasValue
                    ? 'text-components-date-picker-default-color-input-foreground-default'
                    : 'text-foreground-muted'
                )}
              >
                {state.displayText}
              </span>
              <Show when={props.type === 'Date and Time Picker' && props.time !== ''}>
                <span class="shrink-0 text-xs text-foreground-muted">{props.time}</span>
              </Show>
            </span>
            <Show when={props.type === 'Year Picker'}>
              <svg
                aria-hidden="true"
                class="h-4 w-4 shrink-0 text-components-date-picker-default-color-icon-foreground-default"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M8 4h8l3 4v12H5V8z" stroke-linejoin="round" />
                <path d="M5 8h14" />
              </svg>
            </Show>
            <Show when={props.type === 'Date and Time Picker'}>
              <svg
                aria-hidden="true"
                class="h-4 w-4 shrink-0 text-components-date-picker-default-color-icon-foreground-default"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Show>
            <Show when={props.type === 'Date of Birth Picker'}>
              <svg
                aria-hidden="true"
                class="h-4 w-4 shrink-0 text-components-date-picker-default-color-icon-foreground-default"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round" />
              </svg>
            </Show>
          </button>
        </Show>

        <Show when={state.isOpen && props.type === 'Natural Language Picker'}>
          <div class="flex flex-col gap-1 rounded-components-date-picker-default-size-dropdown-radius-default border border-components-date-picker-default-color-dropdown-border-default bg-components-date-picker-default-color-dropdown-background-default p-2 shadow-lg">
            <span class="px-1 text-xs font-medium text-components-date-picker-default-color-day-header-foreground-default">
              Interpreted as
            </span>
            <span class="px-1 text-sm text-components-date-picker-default-color-dropdown-foreground-default">
              {state.interpretedLabel}
            </span>
            <Show when={props.hint !== ''}>
              <span class="px-1 pt-1 text-xs text-foreground-muted">{props.hint}</span>
            </Show>
          </div>
        </Show>

        <Show when={state.isOpen && props.type !== 'Natural Language Picker'}>
          <div
            role="dialog"
            aria-label={state.panelLabel}
            class="flex w-full flex-col gap-3 rounded-components-date-picker-default-size-calendar-radius-default border border-components-date-picker-default-color-calendar-border-default bg-components-date-picker-default-color-calendar-background-default p-3 shadow-lg"
          >
            <div class="flex items-center justify-between gap-2.5 px-1">
              <button
                type="button"
                aria-label="Previous"
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-components-date-picker-default-size-year-cell-radius-default text-components-date-picker-default-color-nav-foreground-default transition-colors hover:bg-components-date-picker-default-color-date-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                onClick={() => state.goPrev()}
              >
                <svg
                  aria-hidden="true"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>

              <Show when={state.usesDropdownHeader}>
                <div class="flex min-w-0 flex-1 items-center justify-center gap-2.5">
                  <select
                    aria-label="Month"
                    value={state.visibleMonth}
                    class="min-w-0 flex-1 rounded-components-date-picker-default-size-dropdown-radius-default border border-components-date-picker-default-color-dropdown-border-default bg-components-date-picker-default-color-dropdown-background-default px-2 py-1 text-sm font-medium text-components-date-picker-default-color-dropdown-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                    onChange={(event) => state.setMonth(event.target.value)}
                  >
                    <For each={state.monthOptions}>
                      {(option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )}
                    </For>
                  </select>
                  <select
                    aria-label="Year"
                    value={state.visibleYear}
                    class="min-w-0 rounded-components-date-picker-default-size-dropdown-radius-default border border-components-date-picker-default-color-dropdown-border-default bg-components-date-picker-default-color-dropdown-background-default px-2 py-1 text-sm font-medium text-components-date-picker-default-color-dropdown-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                    onChange={(event) => state.setYear(event.target.value)}
                  >
                    <For each={state.yearOptions}>
                      {(option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )}
                    </For>
                  </select>
                </div>
              </Show>

              <Show when={!state.usesDropdownHeader}>
                <span class="min-w-0 flex-1 truncate text-center text-sm font-semibold text-components-date-picker-default-color-dropdown-foreground-default">
                  {state.headerLabel}
                </span>
              </Show>

              <button
                type="button"
                aria-label="Next"
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-components-date-picker-default-size-year-cell-radius-default text-components-date-picker-default-color-nav-foreground-default transition-colors hover:bg-components-date-picker-default-color-date-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                onClick={() => state.goNext()}
              >
                <svg
                  aria-hidden="true"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <Show when={state.showsCalendar}>
              <table class="w-full border-collapse">
                <caption class="sr-only">{state.panelLabel}</caption>
                <thead>
                  <tr>
                    <For each={state.weekdays}>
                      {(weekday, index) => (
                        <th
                          key={weekday + '-' + index}
                          scope="col"
                          class="py-1 text-center text-xs font-medium text-components-date-picker-default-color-day-header-foreground-default"
                        >
                          {weekday}
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <For each={state.cells}>
                      {(cell) => (
                        <td key={cell.key} class="p-0.5 text-center">
                          <Show when={!cell.isBlank}>
                            <button
                              type="button"
                              aria-label={cell.ariaLabel}
                              aria-pressed={cell.isSelected}
                              disabled={cell.isDisabled}
                              class={cn(
                                'mx-auto flex h-8 w-8 items-center justify-center rounded-components-date-picker-default-size-year-cell-radius-default text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                                cell.isDisabled
                                  ? 'cursor-not-allowed text-components-date-picker-default-color-date-foreground-muted opacity-50'
                                  : cell.isSelected
                                  ? 'bg-components-date-picker-default-color-date-background-selected text-primary-foreground'
                                  : cell.isInRange
                                  ? 'bg-components-date-picker-default-color-date-background-range text-components-date-picker-default-color-date-foreground-default'
                                  : 'text-components-date-picker-default-color-date-foreground-default hover:bg-components-date-picker-default-color-date-background-hover'
                              )}
                              onClick={() => state.handleSelect(cell.day)}
                            >
                              {cell.label}
                            </button>
                          </Show>
                        </td>
                      )}
                    </For>
                  </tr>
                </tbody>
              </table>
            </Show>

            <Show when={props.type === 'Range Picker'}>
              <span class="rounded-components-date-picker-default-size-dropdown-radius-default bg-components-date-picker-default-color-date-background-range px-2 py-1 text-center text-xs font-medium text-components-date-picker-default-color-date-foreground-default">
                {state.rangeSummary}
              </span>
            </Show>

            <Show when={props.type === 'Year Picker'}>
              <div class="grid grid-cols-3 gap-2">
                <For each={state.yearCells}>
                  {(cell) => (
                    <button
                      key={cell.key}
                      type="button"
                      aria-pressed={cell.isSelected}
                      class={cn(
                        'flex h-9 items-center justify-center rounded-components-date-picker-default-size-year-cell-radius-default text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                        cell.isSelected
                          ? 'bg-components-date-picker-default-color-date-background-selected text-primary-foreground'
                          : 'text-components-date-picker-default-color-date-foreground-default hover:bg-components-date-picker-default-color-date-background-hover'
                      )}
                      onClick={() => state.handleYearSelect(cell.year)}
                    >
                      {cell.label}
                    </button>
                  )}
                </For>
              </div>
            </Show>

            <Show when={props.type === 'Date and Time Picker'}>
              <div class="flex items-center gap-2 border-t border-components-date-picker-default-color-calendar-border-default pt-3">
                <span class="shrink-0 text-xs font-medium text-components-date-picker-default-color-day-header-foreground-default">
                  {props.timeLabel}
                </span>
                <input
                  type="time"
                  aria-label={props.timeLabel}
                  value={props.time}
                  class="h-8 min-w-0 flex-1 rounded-components-date-picker-default-size-dropdown-radius-default border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-2 text-sm text-components-date-picker-default-color-input-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  onInput={(event) => state.handleTime(event.target.value)}
                />
              </div>
            </Show>
          </div>
        </Show>
      </div>

      <Show when={props.hintText && props.hint !== ''}>
        <span class="text-xs text-foreground-muted">{props.hint}</span>
      </Show>
    </div>
  );
}
