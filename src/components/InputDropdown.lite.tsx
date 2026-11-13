import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getDropdownState, ICON_PATHS, bindControllerProps } from './utils';

export interface InputDropdownProps {
  open?: boolean; value?: string; displayValue?: string | ((value: string) => string); searchQuery?: string; searchPlaceholder?: string; id?: string; name?: string;
  label?: string; placeholder?: string; hint?: string | ((value: string) => string); error?: boolean; errorMessage?: string; validating?: boolean;
  disabled?: boolean; required?: boolean; showLabel?: boolean; showHint?: boolean;
  showSearch?: boolean; showLeftIcon?: boolean; showRightIcon?: boolean;
  leftIcon?: any; rightIcon?: any;
  state?: 'default' | 'focus' | 'filled' | 'error' | 'disabled';
  children?: any; className?: string;
  onValueChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onBlur?: (event: unknown) => void;
}

export default function InputDropdown(props: InputDropdownProps) {
  useDefaultProps({
    open: false, value: '', displayValue: '', searchQuery: '', searchPlaceholder: 'Search', id: 'input-dropdown', name: 'dropdown',
    label: '', placeholder: 'Select option', hint: '', error: false, errorMessage: '', validating: false, disabled: false,
    required: false, showLabel: true, showHint: false, showSearch: true,
    showLeftIcon: false, showRightIcon: true, state: 'default', className: '',
  });

  return (
    <div id={props.id} data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col items-start justify-start gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex flex-row items-center justify-start gap-2 text-sm font-medium text-foreground-default">
          {props.label}
          <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
        </span>
      </Show>
      <div class="relative w-full">
        <button
          type="button" aria-haspopup="listbox" disabled={props.disabled || props.state === 'disabled'}
          aria-expanded={getDropdownState(props).isOpen} aria-invalid={getDropdownState(props).hasError} aria-busy={getDropdownState(props).isValidating || undefined}
          aria-describedby={(props.showHint || getDropdownState(props).hasError) && getDropdownState(props).helpText !== '' ? props.id + '-hint' : undefined}
          class={cn('flex h-9 w-full flex-row items-center justify-between gap-1.5 rounded-lg border px-3 py-2 text-left shadow-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50', props.disabled || props.state === 'disabled' ? 'cursor-not-allowed opacity-50 bg-background-muted border-border-default' : cn('cursor-pointer bg-background-default hover:bg-background-subtle', getDropdownState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : getDropdownState(props).isOpen ? 'border-primary-border-emphasis ring-2 ring-focus-ring-primary' : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary'))}
          onClick={() => !(props.disabled || props.state === 'disabled') && props.onOpenChange && props.onOpenChange(!props.open)}
          onKeyDown={(event) => event.key === 'Escape' && props.open && props.onOpenChange && props.onOpenChange(false)}
          onBlur={(event) => !(props.disabled || props.state === 'disabled') && props.onBlur && props.onBlur(event)}
        >
          <span class="flex items-center gap-2.5 truncate">
            {props.leftIcon}
            <Show when={props.showLeftIcon && !props.leftIcon}>
              <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.menu} stroke-linecap="round" /></svg>
            </Show>
            <span class={cn('truncate text-base font-normal', props.value !== '' || props.state === 'filled' ? 'text-foreground-default' : 'text-foreground-subtle')}>
              {getDropdownState(props).displayText}
            </span>
          </span>
          {props.rightIcon}
          <Show when={props.showRightIcon && !props.rightIcon}>
            <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0 transition-transform', getDropdownState(props).isOpen && 'rotate-180', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.chevronDown} stroke-linecap="round" stroke-linejoin="round" /></svg>
          </Show>
        </button>
        <div class={cn('absolute left-0 top-full z-50 mt-1.5 flex w-full flex-col items-start justify-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-md', getDropdownState(props).isOpen ? 'flex' : 'hidden')}>
          <Show when={props.showSearch}>
            <div class="flex w-full flex-row items-center justify-start gap-2 border-b border-border-default px-3 py-2">
              <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.search} stroke-linecap="round" stroke-linejoin="round" /></svg>
              <input type="search" value={props.searchQuery} placeholder={props.searchPlaceholder} aria-label="Search options" class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-subtle" onInput={(event) => props.onSearchChange && props.onSearchChange(event.target.value)} onKeyDown={(event) => event.key === 'Escape' && props.onOpenChange && props.onOpenChange(false)} />
            </div>
          </Show>
          <div role="listbox" aria-label={props.label || 'Options'} class="flex max-h-60 w-full flex-col items-start justify-start overflow-y-auto px-1 py-1">
            {props.children}
          </div>
        </div>
      </div>
      <Show when={(props.showHint || getDropdownState(props).hasError) && getDropdownState(props).helpText !== ''}>
        <span id={props.id + '-hint'} class={cn('text-sm', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getDropdownState(props).helpText}</span>
      </Show>
    </div>
  );
}
