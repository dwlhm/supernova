import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getTimePickerState, ICON_PATHS, bindControllerProps, type TimePickerFormatArg } from './utils';

export interface TimePickerProps {
  id?: string; name?: string; value?: string; defaultValue?: string; editable?: boolean; inputText?: string;
  format?: 'HH:mm' | 'HH:mm:ss'; use12Hours?: boolean; hourStep?: number; minuteStep?: number; secondStep?: number; stepMinute?: number;
  label?: string; showLabel?: boolean; placeholder?: string; hint?: string | ((time: TimePickerFormatArg) => string); showHint?: boolean;
  required?: boolean; disabled?: boolean; error?: boolean; errorMessage?: string; validating?: boolean; open?: boolean; className?: string;
  selectedHour?: number; selectedMinute?: number; selectedSecond?: number; selectedPeriod?: 'AM' | 'PM';
  onOpenChange?: (open: boolean) => void; onValueChange?: (value: string) => void; onBlur?: (event?: unknown) => void;
  onHourSelect?: (hour: number) => void; onMinuteSelect?: (minute: number) => void; onSecondSelect?: (second: number) => void; onPeriodSelect?: (period: 'AM' | 'PM') => void; onInputChange?: (text: string) => void;
}

export default function TimePicker(props: TimePickerProps) {
  useDefaultProps({
    id: 'time-picker', name: 'time', value: '', defaultValue: '', editable: false, inputText: '',
    format: 'HH:mm', use12Hours: false, hourStep: 1, minuteStep: 1, secondStep: 1, stepMinute: 1,
    label: '', showLabel: true, placeholder: 'Select time', hint: '', showHint: false,
    required: false, disabled: false, error: false, errorMessage: '', validating: false, open: false, className: '',
    selectedHour: 0, selectedMinute: 0, selectedSecond: 0, selectedPeriod: 'AM',
  });
  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('relative inline-flex flex-col items-start gap-2', props.className)} onKeyDown={(e) => e.key === 'Escape' && getTimePickerState(props).isOpen && props.onOpenChange && props.onOpenChange(false)}>
      <div class="relative inline-flex flex-col items-start">
        <div class={cn('flex flex-col items-start gap-2', props.editable ? 'w-48' : 'w-44')}>
          <Show when={getTimePickerState(props).hasLabel}>
            <span class="flex items-center gap-1 px-0.5 text-sm font-medium text-foreground-default">{getTimePickerState(props).resolvedLabel}<Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show></span>
          </Show>
          <Show when={getTimePickerState(props).isInputMode}>
            <div class={cn('flex h-9 w-full items-center justify-between gap-2 rounded-lg border py-1 pl-3 pr-1.5 shadow-xs transition-colors', getTimePickerState(props).isDisabled ? 'cursor-not-allowed border-border-default bg-background-muted opacity-50' : getTimePickerState(props).hasError ? 'border-destructive-border bg-input-default ring-2 ring-focus-ring-error' : 'border-border-default bg-input-default focus-within:ring-2 focus-within:ring-focus-ring-primary')}>
              <input id={props.id} name={props.name} type="text" disabled={getTimePickerState(props).isDisabled} aria-invalid={getTimePickerState(props).hasError} aria-describedby={getTimePickerState(props).showHintText ? props.id + '-hint' : undefined} aria-label={getTimePickerState(props).resolvedLabel} value={getTimePickerState(props).inputText} placeholder={props.placeholder} class="w-full bg-transparent text-sm text-foreground-default focus:outline-none disabled:cursor-not-allowed" onInput={(e) => !getTimePickerState(props).isDisabled && props.onInputChange && props.onInputChange(e.target.value)} onBlur={(e) => !getTimePickerState(props).isOpen && props.onBlur && props.onBlur(e)} />
              <button type="button" disabled={getTimePickerState(props).isDisabled} aria-label="Toggle time picker" aria-expanded={getTimePickerState(props).isOpen} class={cn('inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-background-muted disabled:cursor-not-allowed', getTimePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-default')} onClick={() => !getTimePickerState(props).isDisabled && props.onOpenChange && props.onOpenChange(!getTimePickerState(props).isOpen)}><svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.clock} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
            </div>
          </Show>
          <Show when={!getTimePickerState(props).isInputMode}>
            <button id={props.id} name={props.name} type="button" disabled={getTimePickerState(props).isDisabled} aria-haspopup="dialog" aria-expanded={getTimePickerState(props).isOpen} aria-invalid={getTimePickerState(props).hasError} aria-describedby={getTimePickerState(props).showHintText ? props.id + '-hint' : undefined} class={cn('flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 py-1 text-left shadow-xs transition-colors focus:outline-none', getTimePickerState(props).isDisabled ? 'cursor-not-allowed border-border-default bg-background-muted opacity-50' : getTimePickerState(props).hasError ? 'border-destructive-border bg-input-default ring-2 ring-focus-ring-error' : 'border-border-default bg-input-default hover:bg-background-subtle focus-visible:ring-2 focus-visible:ring-focus-ring-primary')} onClick={() => !getTimePickerState(props).isDisabled && props.onOpenChange && props.onOpenChange(!getTimePickerState(props).isOpen)} onBlur={(e) => !getTimePickerState(props).isOpen && props.onBlur && props.onBlur(e)}>
              <span class={cn('truncate text-sm', getTimePickerState(props).hasValue ? 'text-foreground-default' : 'text-foreground-muted')}>{getTimePickerState(props).displayText}</span>
              <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0', getTimePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-default')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.clock || ICON_PATHS.circle} stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </Show>
        </div>
        <div role="dialog" aria-label={getTimePickerState(props).resolvedLabel || 'Time Picker'} class={cn('absolute left-0 top-full z-50 mt-2 flex max-h-56 divide-x divide-border-subtle rounded-xl border border-border-default bg-background-default p-1 shadow-md', getTimePickerState(props).isOpen ? 'flex' : 'hidden')}>
          <div class="flex max-h-52 w-14 flex-col gap-1 overflow-y-auto p-1">
            <span class="text-center text-xs font-semibold text-foreground-muted">HR</span>
            <For each={getTimePickerState(props).hourOptions}>{(item) => (
              <button key={item.label} type="button" aria-pressed={item.isSelected} class={cn('flex h-7 w-full items-center justify-center rounded-md text-xs transition-colors', item.isSelected ? 'bg-primary-default font-medium text-primary-foreground' : 'font-normal text-foreground-default hover:bg-background-muted')} onClick={() => props.onHourSelect && props.onHourSelect(item.value)}>{item.label}</button>
            )}</For>
          </div>
          <div class="flex max-h-52 w-14 flex-col gap-1 overflow-y-auto p-1">
            <span class="text-center text-xs font-semibold text-foreground-muted">MIN</span>
            <For each={getTimePickerState(props).minuteOptions}>{(item) => (
              <button key={item.label} type="button" aria-pressed={item.isSelected} class={cn('flex h-7 w-full items-center justify-center rounded-md text-xs transition-colors', item.isSelected ? 'bg-primary-default font-medium text-primary-foreground' : 'font-normal text-foreground-default hover:bg-background-muted')} onClick={() => props.onMinuteSelect && props.onMinuteSelect(item.value)}>{item.label}</button>
            )}</For>
          </div>
          <Show when={getTimePickerState(props).format === 'HH:mm:ss'}>
            <div class="flex max-h-52 w-14 flex-col gap-1 overflow-y-auto p-1">
              <span class="text-center text-xs font-semibold text-foreground-muted">SEC</span>
              <For each={getTimePickerState(props).secondOptions}>{(item) => (
                <button key={item.label} type="button" aria-pressed={item.isSelected} class={cn('flex h-7 w-full items-center justify-center rounded-md text-xs transition-colors', item.isSelected ? 'bg-primary-default font-medium text-primary-foreground' : 'font-normal text-foreground-default hover:bg-background-muted')} onClick={() => props.onSecondSelect && props.onSecondSelect(item.value)}>{item.label}</button>
              )}</For>
            </div>
          </Show>
          <Show when={getTimePickerState(props).use12Hours}>
            <div class="flex max-h-52 w-14 flex-col gap-1 overflow-y-auto p-1">
              <span class="text-center text-xs font-semibold text-foreground-muted">AM/PM</span>
              <For each={getTimePickerState(props).periodOptions}>{(item) => (
                <button key={item.label} type="button" aria-pressed={item.isSelected} class={cn('flex h-7 w-full items-center justify-center rounded-md text-xs transition-colors', item.isSelected ? 'bg-primary-default font-medium text-primary-foreground' : 'font-normal text-foreground-default hover:bg-background-muted')} onClick={() => props.onPeriodSelect && props.onPeriodSelect(item.value as 'AM' | 'PM')}>{item.label}</button>
              )}</For>
            </div>
          </Show>
        </div>
      </div>
      <Show when={getTimePickerState(props).showHintText}>
        <span id={props.id + '-hint'} class={cn('px-0.5 text-xs', getTimePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getTimePickerState(props).resolvedHint}</span>
      </Show>
    </div>
  );
}
