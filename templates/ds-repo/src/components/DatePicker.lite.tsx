import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getDatePickerState, ICON_PATHS, bindControllerProps } from './utils';

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
  onMonthStep?: (delta: number) => void;
}

export default function DatePicker(props: DatePickerProps) {
  useDefaultProps({
    open: false, value: 0, month: 1, year: 2025, label: 'Date of Birth', placeholder: 'Select a date',
    hint: 'Choose a date from the calendar.', showHint: false, showLabel: true, displayValue: '', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('relative flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="text-sm font-medium text-foreground-default">{props.label}</span>
      </Show>
      <button
        type="button" aria-haspopup="dialog" aria-expanded={props.open}
        class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-background-default px-3 text-left shadow-xs transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        onClick={() => props.onOpenChange && props.onOpenChange(!props.open)}
      >
        <span class={cn('truncate text-sm', getDatePickerState(props).hasValue ? 'text-foreground-default' : 'text-foreground-subtle')}>
          {getDatePickerState(props).displayText}
        </span>
        <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.calendar} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div role="dialog" aria-label={props.label} class={cn('absolute top-full z-50 mt-2 w-full rounded-xl border border-border-default bg-background-default p-3 shadow-lg', props.open ? 'block' : 'hidden')}>
        <div class="mb-3 flex items-center justify-between gap-2 px-1">
          <button type="button" aria-label="Previous month" class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted" onClick={() => props.onMonthStep && props.onMonthStep(-1)}>
            <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronLeft} stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <span class="text-sm font-semibold text-foreground-default">{getDatePickerState(props).monthLabel}</span>
          <button type="button" aria-label="Next month" class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted" onClick={() => props.onMonthStep && props.onMonthStep(1)}>
            <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <For each={getDatePickerState(props).weekdays}>
            {(weekday) => <span key={weekday} class="py-1 text-center text-xs font-medium text-foreground-muted">{weekday}</span>}
          </For>
          <For each={getDatePickerState(props).cells}>
            {(cell) => (
              <span key={cell.key} class="flex items-center justify-center">
                <Show when={!cell.isBlank}>
                  <button type="button" aria-pressed={cell.isSelected} class={cn('flex h-8 w-8 items-center justify-center rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', cell.isSelected ? 'bg-primary-default text-primary-foreground' : 'text-foreground-default hover:bg-background-muted')} onClick={() => props.onSelect && props.onSelect(cell.day)}>
                    {cell.day}
                  </button>
                </Show>
              </span>
            )}
          </For>
        </div>
      </div>
      <Show when={props.showHint}>
        <span class="text-sm text-foreground-muted">{props.hint}</span>
      </Show>
    </div>
  );
}
