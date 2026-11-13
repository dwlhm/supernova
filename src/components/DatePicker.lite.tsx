import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, cva, getDatePickerState, ICON_PATHS, bindControllerProps, type DatePickerFormatArg } from './utils';

export interface DatePickerProps {
  id?: string; name?: string;
  mode?: 'single' | 'range' | 'month' | 'year';
  editable?: boolean; open?: boolean;
  showLabel?: boolean; showHint?: boolean; required?: boolean; disabled?: boolean;
  error?: boolean; errorMessage?: string; validating?: boolean;
  viewMode?: string; value?: number | string; month?: number; year?: number; selectedMonth?: number; selectedYear?: number; startMonth?: number; startYear?: number; endValue?: number; endMonth?: number; endYear?: number; hoverValue?: number; hoverMonth?: number; hoverYear?: number;
  yearGridTitle?: string; inputText?: string; label?: string; placeholder?: string; hint?: string | ((date: DatePickerFormatArg) => string); displayValue?: string | ((date: DatePickerFormatArg) => string); className?: string;
  onValueChange?: (value: string) => void; onBlur?: (event?: unknown) => void;
  onSelect?: (val: number | { year: number; month: number; day: number }) => void; onHoverDate?: (val: { year: number; month: number; day: number }) => void; onOpenChange?: (open: boolean) => void; onMonthStep?: (delta: number) => void;
  onGridSelect?: (value: number) => void; onViewModeChange?: (mode: 'days' | 'months' | 'years') => void; onInputChange?: (text: string) => void;
}

export default function DatePicker(props: DatePickerProps) {
  useDefaultProps({
    id: 'date-picker', name: 'date', mode: 'single', editable: false, open: false, showLabel: true, showHint: false, required: false, disabled: false, error: false, errorMessage: '', validating: false,
    viewMode: '', value: 0, month: 6, year: 2025, selectedMonth: 0, selectedYear: 0, startMonth: 0, startYear: 0, endValue: 9, endMonth: 0, endYear: 0, hoverValue: 0, hoverMonth: 0, hoverYear: 0,
    yearGridTitle: 'Select Year', inputText: '', label: '', placeholder: 'Select a date', hint: '', displayValue: '', className: '',
  });
  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('relative inline-flex flex-col items-start gap-2', props.className)} onKeyDown={(e) => e.key === 'Escape' && getDatePickerState(props).isOpen && props.onOpenChange && props.onOpenChange(false)}>
      <div class="relative inline-flex flex-col items-start">
        <div class={cn('flex flex-col items-start gap-2', props.editable ? 'w-60' : cva(props.mode, { single: 'w-48', range: 'w-60', month: 'w-48', year: 'w-48' }, 'w-48'))}>
          <Show when={getDatePickerState(props).hasLabel}><span class="flex items-center gap-1 px-0.5 text-sm font-medium text-foreground-default">{getDatePickerState(props).resolvedLabel}<Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show></span></Show>
          <Show when={getDatePickerState(props).isInputMode}>
            <div class={cn('flex h-9 w-full items-center justify-between gap-2 rounded-lg border py-1 pl-3 pr-1.5 shadow-xs transition-colors', getDatePickerState(props).isDisabled ? 'cursor-not-allowed border-border-default bg-background-muted opacity-50' : getDatePickerState(props).hasError ? 'border-destructive-border bg-input-default ring-2 ring-focus-ring-error' : 'border-border-default bg-input-default focus-within:ring-2 focus-within:ring-focus-ring-primary')}>
              <input id={props.id} name={props.name} type="text" disabled={getDatePickerState(props).isDisabled} aria-invalid={getDatePickerState(props).hasError} aria-describedby={getDatePickerState(props).showHintText ? props.id + '-hint' : undefined} aria-label={getDatePickerState(props).resolvedLabel} value={getDatePickerState(props).inputText} placeholder={props.placeholder} class="w-full bg-transparent text-sm text-foreground-default focus:outline-none disabled:cursor-not-allowed" onInput={(e) => !getDatePickerState(props).isDisabled && props.onInputChange && props.onInputChange(e.target.value)} onBlur={(e) => !getDatePickerState(props).isOpen && props.onBlur && props.onBlur(e)} />
              <button type="button" disabled={getDatePickerState(props).isDisabled} aria-label="Toggle calendar" aria-expanded={getDatePickerState(props).isOpen} class={cn('inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-background-muted disabled:cursor-not-allowed', getDatePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-default')} onClick={() => !getDatePickerState(props).isDisabled && props.onOpenChange && props.onOpenChange(!getDatePickerState(props).isOpen)}><svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.calendar} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
            </div>
          </Show>
          <Show when={!getDatePickerState(props).isInputMode}>
            <button id={props.id} name={props.name} type="button" disabled={getDatePickerState(props).isDisabled} aria-haspopup="dialog" aria-expanded={getDatePickerState(props).isOpen} aria-invalid={getDatePickerState(props).hasError} aria-describedby={getDatePickerState(props).showHintText ? props.id + '-hint' : undefined} class={cn('flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 py-1 text-left shadow-xs transition-colors focus:outline-none', getDatePickerState(props).isDisabled ? 'cursor-not-allowed border-border-default bg-background-muted opacity-50' : getDatePickerState(props).hasError ? 'border-destructive-border bg-input-default ring-2 ring-focus-ring-error' : 'border-border-default bg-input-default hover:bg-background-subtle focus-visible:ring-2 focus-visible:ring-focus-ring-primary')} onClick={() => !getDatePickerState(props).isDisabled && props.onOpenChange && props.onOpenChange(!getDatePickerState(props).isOpen)} onBlur={(e) => !getDatePickerState(props).isOpen && props.onBlur && props.onBlur(e)}><span class={cn('truncate text-sm', getDatePickerState(props).hasValue ? 'text-foreground-default' : 'text-foreground-muted')}>{getDatePickerState(props).displayText}</span><svg aria-hidden="true" class={cn('h-4 w-4 shrink-0', getDatePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-default')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={getDatePickerState(props).isOpen ? ICON_PATHS.chevronUp : ICON_PATHS.chevronDown} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
          </Show>
        </div>
        <div role="dialog" aria-label={getDatePickerState(props).resolvedLabel || 'Calendar'} class={cn('absolute left-0 top-full z-50 mt-2 flex flex-col gap-3 rounded-xl border border-border-default bg-background-default p-3 shadow-md', getDatePickerState(props).isGridMode ? 'w-[287px]' : getDatePickerState(props).isRangeMode ? 'w-max' : 'w-[250px]', getDatePickerState(props).isOpen ? 'flex' : 'hidden')} onMouseLeave={() => props.onHoverDate && props.onHoverDate({ year: 0, month: 0, day: 0 })}>
          <Show when={getDatePickerState(props).isGridMode}>
            <div class="flex w-full items-center justify-between gap-2">
              <button type="button" aria-label="Previous" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground-default" onClick={() => props.onMonthStep && props.onMonthStep(-1)}><svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronLeft} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
              <button type="button" class="text-xs font-medium text-foreground-default hover:underline" onClick={() => props.onViewModeChange && props.onViewModeChange(getDatePickerState(props).viewMode === 'months' ? 'years' : 'days')}>{getDatePickerState(props).gridTitle}</button>
              <button type="button" aria-label="Next" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground-default" onClick={() => props.onMonthStep && props.onMonthStep(1)}><svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
            </div>
            <div class="grid grid-cols-3 gap-x-1.5 gap-y-2.5 rounded-lg border border-border-subtle bg-background-default p-2 shadow-xs">
              <For each={getDatePickerState(props).gridEntries}>{(item) => (<button key={item.key} type="button" aria-pressed={item.isSelected} class={cn('flex h-8 w-full items-center justify-center rounded-md px-3 text-xs transition-colors', item.isSelected ? 'bg-primary-default font-medium text-primary-foreground shadow-xs' : 'font-normal text-foreground-default hover:bg-background-muted')} onClick={() => props.onGridSelect && props.onGridSelect(item.value)}>{item.label}</button>)}</For>
            </div>
          </Show>
          <Show when={!getDatePickerState(props).isGridMode}>
            <div class="flex flex-col gap-4 sm:flex-row">
              <For each={getDatePickerState(props).panels}>{(panel) => (
                <div key={panel.key} class="flex w-[224px] flex-col gap-3">
                  <div class="flex h-8 w-full items-center justify-between gap-1.5">
                    <button type="button" aria-label="Previous month" class={cn('inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-default hover:bg-background-muted', !panel.showPrev && 'invisible')} onClick={() => props.onMonthStep && props.onMonthStep(-1)}><svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronLeft} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
                    <Show when={getDatePickerState(props).isRangeMode}><span class="text-sm font-medium text-foreground-default">{panel.monthLabel}</span></Show>
                    <Show when={!getDatePickerState(props).isRangeMode}>
                      <div class="flex items-center gap-1.5">
                        <button type="button" aria-label="Select month" class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-default bg-background-default px-2.5 text-xs font-medium text-foreground-default shadow-xs hover:bg-background-muted" onClick={() => props.onViewModeChange && props.onViewModeChange('months')}><span>{panel.monthShortLabel}</span><svg aria-hidden="true" class="h-3.5 w-3.5 text-foreground-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronDown} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
                        <button type="button" aria-label="Select year" class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-default bg-background-default px-2.5 text-xs font-medium text-foreground-default shadow-xs hover:bg-background-muted" onClick={() => props.onViewModeChange && props.onViewModeChange('years')}><span>{panel.yearLabel}</span><svg aria-hidden="true" class="h-3.5 w-3.5 text-foreground-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronDown} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
                      </div>
                    </Show>
                    <button type="button" aria-label="Next month" class={cn('inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-default hover:bg-background-muted', !panel.showNext && 'invisible')} onClick={() => props.onMonthStep && props.onMonthStep(1)}><svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" /></svg></button>
                  </div>
                  <div class="grid grid-cols-7 gap-y-1.5">
                    <For each={getDatePickerState(props).weekdays}>{(weekday) => <span key={weekday} class="flex h-5 w-8 items-center justify-center text-xs font-normal text-foreground-muted">{weekday}</span>}</For>
                    <For each={panel.cells}>{(cell) => (<span key={cell.key} class={cn('flex h-8 w-8 items-center justify-center', cell.isInRange && 'bg-primary-subtle', cell.isRangeStart && 'rounded-l-md', cell.isRangeEnd && 'rounded-r-md')}><button type="button" aria-pressed={cell.isSelected} class={cn('flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', cell.isSelected ? 'bg-primary-default font-medium text-primary-foreground' : cell.isInRange ? 'font-normal text-foreground-default hover:bg-background-muted' : cell.isToday ? 'bg-background-muted font-normal text-foreground-default' : cell.isOutside ? 'font-normal text-foreground-muted hover:bg-background-muted' : 'font-normal text-foreground-default hover:bg-background-muted')} onMouseEnter={() => props.onHoverDate && props.onHoverDate({ year: cell.year, month: cell.month, day: cell.day })} onClick={() => props.onSelect && props.onSelect({ year: cell.year, month: cell.month, day: cell.day })}>{cell.day}</button></span>)}</For>
                  </div>
                </div>
              )}</For>
            </div>
          </Show>
        </div>
      </div>
      <Show when={getDatePickerState(props).showHintText}><span id={props.id + '-hint'} class={cn('px-0.5 text-xs', getDatePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getDatePickerState(props).resolvedHint}</span></Show>
    </div>
  );
}
