import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getDropdownState, ICON_PATHS, bindControllerProps } from './utils';

export interface SelectOption { value: string; label: string; disabled?: boolean; }

export interface InputDropdownProps {
  open?: boolean; value?: string; options?: SelectOption[]; searchQuery?: string; id?: string;
  name?: string; label?: string; placeholder?: string; hint?: string; errorMessage?: string;
  disabled?: boolean; required?: boolean; showLabel?: boolean; showHint?: boolean; showSearch?: boolean;
  showLeftIcon?: boolean; showRightIcon?: boolean; className?: string;
  onSelect?: (value: string) => void; onSearchChange?: (value: string) => void; onOpenChange?: (open: boolean) => void;
}

export default function InputDropdown(props: InputDropdownProps) {
  useDefaultProps({
    open: false, value: '', options: [], searchQuery: '', id: 'input-dropdown', name: 'dropdown',
    label: 'Department', placeholder: 'Choose department', hint: 'Select your department or area of work.',
    errorMessage: '', disabled: false, required: false, showLabel: true, showHint: false,
    showSearch: true, showLeftIcon: false, showRightIcon: true, className: '',
  });

  return (
    <div id={props.id} data-ctrl={typeof bindControllerProps} class={cn('relative flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex items-center gap-1 text-sm font-medium text-foreground-default">
          {props.label}
          <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
        </span>
      </Show>
      <button
        type="button" aria-haspopup="listbox" aria-expanded={getDropdownState(props).isOpen}
        aria-invalid={getDropdownState(props).hasError} disabled={props.disabled}
        class={cn('flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border bg-background-default px-3 text-left shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50', getDropdownState(props).hasError ? 'border-destructive-border focus:ring-2 focus:ring-focus-ring-error' : getDropdownState(props).isOpen ? 'border-primary-border-emphasis ring-2 ring-focus-ring-primary' : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary')}
        onClick={() => !props.disabled && props.onOpenChange && props.onOpenChange(!props.open)}
      >
        <span class="flex items-center gap-1.5 truncate">
          <Show when={props.showLeftIcon}>
            <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.menu} stroke-linecap="round" /></svg>
          </Show>
          <span class={cn('truncate text-sm', getDropdownState(props).selectedLabel !== '' ? 'text-foreground-default' : 'text-foreground-subtle')}>
            {getDropdownState(props).selectedLabel !== '' ? getDropdownState(props).selectedLabel : props.placeholder}
          </span>
        </span>
        <Show when={props.showRightIcon}>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronDown} stroke-linecap="round" stroke-linejoin="round" /></svg>
        </Show>
      </button>
      <div class={cn('absolute top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-border-default bg-background-default shadow-lg', getDropdownState(props).isOpen ? 'block' : 'hidden')}>
        <Show when={props.showSearch}>
          <div class="flex items-center gap-2 border-b border-border-default px-3 py-2">
            <input type="search" value={props.searchQuery} placeholder="Search" aria-label="Search options" class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-subtle" onInput={(event) => props.onSearchChange && props.onSearchChange(event.target.value)} />
          </div>
        </Show>
        <div role="listbox" aria-label={props.label} class="flex max-h-60 flex-col overflow-y-auto p-1">
          <For each={getDropdownState(props).filtered}>
            {(option) => (
              <button key={option.value} type="button" role="option" aria-selected={option.value === props.value} disabled={option.disabled} class={cn('flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50', option.value === props.value ? 'bg-background-muted text-foreground-default' : 'text-foreground-default hover:bg-background-muted')} onClick={() => props.onSelect && props.onSelect(option.value)}>
                <span class="truncate">{option.label}</span>
              </button>
            )}
          </For>
        </div>
      </div>
      <Show when={props.showHint}><span class={cn('text-sm', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getDropdownState(props).helpText}</span></Show>
    </div>
  );
}
