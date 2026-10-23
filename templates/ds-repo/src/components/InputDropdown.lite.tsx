import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface InputDropdownProps {
  value?: string;
  options?: SelectOption[];
  searchQuery?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  showSearch?: boolean;
  showLeftIcon?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
  onSearchChange?: (value: string) => void;
}

export default function InputDropdown(props: InputDropdownProps) {
  useDefaultProps({
    value: '',
    options: [],
    searchQuery: '',
    id: 'input-dropdown',
    label: 'Department',
    placeholder: 'Choose department',
    hint: 'Select your department or area of work.',
    errorMessage: '',
    disabled: false,
    required: false,
    showLabel: true,
    showHint: false,
    showSearch: true,
    showLeftIcon: false,
    className: '',
  });

  const state = useStore({
    isOpen: false,
    get hasError() {
      return props.errorMessage !== '';
    },
    get normalizedQuery() {
      return props.searchQuery.trim().toLowerCase();
    },
    get selectedLabel() {
      const matched = (props.options || []).filter((option) => option.value === props.value);
      return matched.length > 0 ? matched[0].label : '';
    },
    get panelClasses() {
      return state.isOpen ? 'block' : 'hidden';
    },
    get triggerClasses() {
      if (state.hasError) {
        return 'border-components-select-all-color-trigger-border-error';
      }
      if (state.isOpen) {
        return 'border-components-select-all-color-trigger-border-focus';
      }
      return 'border-components-select-all-color-trigger-border-default';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-select-all-color-supporting-text-foreground-error'
        : 'text-components-select-all-color-supporting-text-foreground-default';
    },
    toggle() {
      if (props.disabled) {
        return;
      }
      state.isOpen = !state.isOpen;
    },
    handleSearch(rawValue: string) {
      if (props.onSearchChange) {
        props.onSearchChange(rawValue);
      }
    },
    handleSelect(selected: string) {
      state.isOpen = false;
      if (props.onSelect) {
        props.onSelect(selected);
      }
    },
  });

  return (
    <div class={cn('relative flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex items-center gap-1 text-sm font-medium text-components-select-all-color-label-foreground-default">
          {props.label}
          <Show when={props.required}>
            <span
              aria-hidden="true"
              class="text-components-select-all-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </span>
      </Show>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={state.isOpen}
        disabled={props.disabled}
        class={cn(
          'flex h-9 w-full items-center justify-between gap-2.5 rounded-rounded-lg border bg-components-select-all-color-trigger-background-default px-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50',
          state.triggerClasses
        )}
        onClick={() => state.toggle()}
      >
        <span class="flex items-center gap-2.5 truncate">
          <Show when={props.showLeftIcon}>
            <svg
              aria-hidden="true"
              class="h-4 w-4 shrink-0 text-components-select-all-color-trigger-icon-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" />
            </svg>
          </Show>
          <Show when={state.selectedLabel !== ''}>
            <span class="truncate text-sm text-components-select-all-color-trigger-foreground-default">
              {state.selectedLabel}
            </span>
          </Show>
          <Show when={state.selectedLabel === ''}>
            <span class="truncate text-sm text-components-select-all-color-placeholder-foreground-default">
              {props.placeholder}
            </span>
          </Show>
        </span>
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div
        class={cn(
          'absolute top-full z-50 mt-2 w-full overflow-hidden rounded-rounded-md border border-components-select-all-color-dropdown-menu-border-focus bg-components-select-all-color-dropdown-menu-background-focus shadow-lg',
          state.panelClasses
        )}
        role="listbox"
      >
        <Show when={props.showSearch}>
          <div class="flex items-center gap-2 border-b border-components-select-all-color-search-input-border-focus px-3 py-2">
            <svg
              aria-hidden="true"
              class="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" stroke-linecap="round" />
            </svg>
            <input
              type="search"
              value={props.searchQuery}
              placeholder="Search"
              aria-label="Search options"
              class="w-full bg-transparent text-sm text-components-select-all-color-trigger-foreground-default outline-none placeholder:text-components-select-all-color-placeholder-foreground-default"
              onInput={(event) => state.handleSearch(event.target.value)}
            />
          </div>
        </Show>
        <ul class="flex max-h-60 flex-col overflow-y-auto p-1">
          <For each={props.options}>
            {(option) => (
              <li
                key={option.value}
                class={
                  state.normalizedQuery !== '' &&
                  option.label.toLowerCase().indexOf(state.normalizedQuery) === -1
                    ? 'hidden'
                    : 'block'
                }
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === props.value}
                  disabled={option.disabled}
                  class={cn(
                    'flex w-full items-center justify-between rounded-rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    option.value === props.value
                      ? 'bg-components-select-all-color-wrapper-background-focus text-components-select-all-color-trigger-foreground-default'
                      : 'text-components-select-all-color-trigger-foreground-default hover:bg-background-muted'
                  )}
                  onClick={() => state.handleSelect(option.value)}
                >
                  <span class="truncate">{option.label}</span>
                  <Show when={option.value === props.value}>
                    <svg
                      aria-hidden="true"
                      class="h-4 w-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </Show>
                </button>
              </li>
            )}
          </For>
        </ul>
      </div>
      <Show when={props.showHint}>
        <span class={cn('text-xs', state.supportingClasses)}>{state.supportingText}</span>
      </Show>
    </div>
  );
}
