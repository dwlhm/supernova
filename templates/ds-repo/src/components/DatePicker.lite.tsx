import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface DatePickerCell {
  key: string;
  day: number;
  label: string;
  isBlank: boolean;
  isSelected: boolean;
}

export interface DatePickerProps {
  open?: boolean;
  value?: number;
  month?: number;
  year?: number;
  label?: string;
  placeholder?: string;
  hint?: string;
  showHint?: boolean;
  showLabel?: boolean;
  displayValue?: string;
  className?: string;
  onSelect?: (day: number) => void;
  onOpenChange?: (open: boolean) => void;
}

export default function DatePicker(props: DatePickerProps) {
  useDefaultProps({
    open: false,
    value: 0,
    month: 1,
    year: 2025,
    label: 'Date',
    placeholder: 'Select a date',
    hint: 'Choose a date from the calendar.',
    showHint: false,
    showLabel: true,
    displayValue: '',
    className: '',
  });

  const state = useStore({
    get weekdays() {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    },
    get monthLabel() {
      const months = [
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
      const index = props.month > 0 && props.month < 13 ? props.month - 1 : 0;
      return months[index] + ' ' + props.year;
    },
    get cells() {
      const output: DatePickerCell[] = [];
      const totalDays = new Date(props.year, props.month, 0).getDate();
      const lead = new Date(props.year, props.month - 1, 1).getDay();
      for (let i = 0; i < lead; i++) {
        output.push({
          key: 'blank-' + i,
          day: 0,
          label: '',
          isBlank: true,
          isSelected: false,
        });
      }
      for (let day = 1; day <= totalDays; day++) {
        output.push({
          key: 'day-' + day,
          day: day,
          label: String(day),
          isBlank: false,
          isSelected: day === props.value,
        });
      }
      return output;
    },
    get displayText() {
      return props.displayValue !== '' ? props.displayValue : props.placeholder;
    },
    get panelClasses() {
      return props.open ? 'block' : 'hidden';
    },
    toggle() {
      if (props.onOpenChange) {
        props.onOpenChange(!props.open);
      }
    },
    handleSelect(day: number) {
      if (day < 1) {
        return;
      }
      if (props.onSelect) {
        props.onSelect(day);
      }
    },
  });

  return (
    <div class={cn('relative flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="text-sm font-medium text-components-date-picker-default-color-label-foreground-default">
          {props.label}
        </span>
      </Show>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={props.open}
        class="flex h-9 w-full items-center justify-between gap-2 rounded-rounded-lg border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-3 text-left transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        onClick={() => state.toggle()}
      >
        <span
          class={cn(
            'truncate text-sm',
            props.displayValue !== ''
              ? 'text-components-date-picker-default-color-input-foreground-default'
              : 'text-components-select-all-color-placeholder-foreground-default'
          )}
        >
          {state.displayText}
        </span>
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
      </button>
      <div
        class={cn(
          'z-50 w-full rounded-rounded-xl border border-components-date-picker-default-color-calendar-border-default bg-components-date-picker-default-color-calendar-background-default p-3 shadow-lg',
          state.panelClasses
        )}
      >
        <div class="mb-3 flex items-center justify-between gap-2.5 px-1">
          <span class="text-sm font-semibold text-components-date-picker-default-color-dropdown-foreground-default">
            {state.monthLabel}
          </span>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <For each={state.weekdays}>
            {(weekday, index) => (
              <span
                key={index}
                class="py-1 text-center text-xs font-medium text-components-date-picker-default-color-day-header-foreground-default"
              >
                {weekday}
              </span>
            )}
          </For>
          <For each={state.cells}>
            {(cell) => (
              <span key={cell.key} class="flex items-center justify-center">
                <Show when={!cell.isBlank}>
                  <button
                    type="button"
                    aria-pressed={cell.isSelected}
                    class={cn(
                      'flex h-8 w-8 items-center justify-center rounded-rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                      cell.isSelected
                        ? 'bg-components-date-picker-default-color-date-background-selected text-primary-foreground'
                        : 'text-components-date-picker-default-color-date-foreground-default hover:bg-components-date-picker-default-color-date-background-hover'
                    )}
                    onClick={() => state.handleSelect(cell.day)}
                  >
                    {cell.day}
                  </button>
                </Show>
              </span>
            )}
          </For>
        </div>
      </div>
      <Show when={props.showHint}>
        <span class="text-xs text-components-select-all-color-supporting-text-foreground-default">
          {props.hint}
        </span>
      </Show>
    </div>
  );
}
