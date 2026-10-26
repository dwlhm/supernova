import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputDropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface InputDropdownProps {
  id?: string;
  labelText?: string;
  placeholderText?: string;
  hintErrorText?: string;
  options?: InputDropdownOption[];
  value?: string;
  variation?: 'Default' | 'Focus' | 'Filled' | 'Error' | 'Disabled';
  showLabel?: boolean;
  showRequired?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  showSearchInput?: boolean;
  searchPlaceholder?: string;
  maxSearchLength?: number;
  emptyMessage?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export default function InputDropdown(props: InputDropdownProps) {
  useDefaultProps({
    id: 'input-dropdown',
    labelText: 'Department',
    placeholderText: 'Choose department',
    hintErrorText: 'Select your department or area of work.',
    options: [],
    value: '',
    variation: 'Default',
    showLabel: true,
    showRequired: false,
    showHint: false,
    showCharacterCount: true,
    showLeftIcon: false,
    showRightIcon: true,
    showSearchInput: true,
    searchPlaceholder: 'Search options',
    maxSearchLength: 50,
    emptyMessage: 'No options found',
    className: '',
  });

  const state = useStore({
    isOpen: false,
    searchQuery: '',
    highlightedIndex: -1,

    get isDisabled() {
      return props.variation === 'Disabled';
    },
    get hasError() {
      return props.variation === 'Error';
    },
    get isFilled() {
      return props.variation === 'Filled';
    },
    get isFocusVariation() {
      return props.variation === 'Focus';
    },
    get listboxId() {
      return props.id + '-listbox';
    },
    get labelId() {
      return props.id + '-label';
    },
    get supportingId() {
      return props.id + '-supporting';
    },
    get accessibleName() {
      return props.showLabel ? undefined : props.labelText;
    },
    get selectedLabel() {
      const matches = props.options.filter((option) => option.value === props.value);
      return matches.length > 0 ? matches[0].label : '';
    },
    get hasSelection() {
      return state.selectedLabel !== '';
    },
    get displayText() {
      return state.hasSelection ? state.selectedLabel : props.placeholderText;
    },
    get filteredOptions() {
      const query = state.searchQuery.trim().toLowerCase();
      if (query === '') {
        return props.options;
      }
      return props.options.filter((option) => option.label.toLowerCase().indexOf(query) !== -1);
    },
    get isEmpty() {
      return state.filteredOptions.length === 0;
    },
    get resultCountText() {
      const total = state.filteredOptions.length;
      if (total === 1) {
        return '1 option available';
      }
      return total + ' options available';
    },
    get activeDescendant() {
      return state.highlightedIndex >= 0
        ? state.listboxId + '-option-' + state.highlightedIndex
        : undefined;
    },
    get triggerClasses() {
      if (state.isDisabled) {
        return 'border-components-select-all-color-trigger-border-disabled bg-background-subtle';
      }
      if (state.hasError) {
        return 'border-components-select-all-color-trigger-border-error bg-components-select-all-color-trigger-background-default';
      }
      if (state.isOpen || state.isFocusVariation) {
        return 'border-components-select-all-color-trigger-border-focus bg-components-select-all-color-trigger-background-default';
      }
      if (state.isFilled) {
        return 'border-components-select-all-color-trigger-border-filled bg-components-select-all-color-trigger-background-default';
      }
      return 'border-components-select-all-color-trigger-border-default bg-components-select-all-color-trigger-background-default';
    },
    get ringClasses() {
      return state.hasError
        ? 'focus-visible:ring-focus-ring-error'
        : 'focus-visible:ring-focus-ring-primary';
    },
    get textClasses() {
      if (state.isFilled) {
        return 'text-components-select-all-color-trigger-foreground-default font-medium';
      }
      return state.hasSelection
        ? 'text-components-select-all-color-trigger-foreground-default'
        : 'text-components-select-all-color-placeholder-foreground-default';
    },
    get iconClasses() {
      if (state.isDisabled) {
        return 'text-components-input-dropdown-regular-color-icon-foreground-disabled';
      }
      if (state.hasError) {
        return 'text-components-input-dropdown-regular-color-icon-foreground-error';
      }
      if (state.isOpen || state.isFocusVariation) {
        return 'text-components-input-dropdown-regular-color-icon-foreground-focus';
      }
      if (state.isFilled) {
        return 'text-components-input-dropdown-regular-color-icon-foreground-filled';
      }
      return 'text-components-input-dropdown-regular-color-icon-foreground-default';
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-select-all-color-supporting-text-foreground-error'
        : 'text-components-select-all-color-supporting-text-foreground-default';
    },
    get countText() {
      return state.searchQuery.length + ' / ' + props.maxSearchLength;
    },
    get panelClasses() {
      return state.isOpen ? 'block' : 'hidden';
    },
    get panelWrapperClasses() {
      return state.isOpen ? 'pointer-events-auto' : 'pointer-events-none';
    },

    openList() {
      if (state.isDisabled) {
        return;
      }
      state.isOpen = true;
      state.highlightedIndex = -1;
    },
    closeList() {
      state.isOpen = false;
      state.highlightedIndex = -1;
      state.searchQuery = '';
    },
    toggleList() {
      if (state.isDisabled) {
        return;
      }
      if (state.isOpen) {
        state.closeList();
      } else {
        state.openList();
      }
    },
    selectOption(option) {
      if (state.isDisabled || option.disabled) {
        return;
      }
      if (props.onValueChange) {
        props.onValueChange(option.value);
      }
      state.closeList();
    },
    handleSearchInput(rawValue) {
      state.searchQuery = rawValue;
      state.highlightedIndex = -1;
    },
    handleKeyDown(key) {
      if (state.isDisabled) {
        return;
      }
      const total = state.filteredOptions.length;
      if (key === 'ArrowDown') {
        if (!state.isOpen) {
          state.openList();
          return;
        }
        state.highlightedIndex =
          state.highlightedIndex >= total - 1 ? 0 : state.highlightedIndex + 1;
        return;
      }
      if (key === 'ArrowUp') {
        if (!state.isOpen) {
          state.openList();
          return;
        }
        state.highlightedIndex = state.highlightedIndex <= 0 ? total - 1 : state.highlightedIndex - 1;
        return;
      }
      if (key === 'Enter') {
        if (!state.isOpen) {
          state.openList();
          return;
        }
        if (state.highlightedIndex >= 0 && state.highlightedIndex < total) {
          state.selectOption(state.filteredOptions[state.highlightedIndex]);
        }
        return;
      }
      if (key === 'Escape') {
        state.closeList();
      }
    },
  });

  return (
    <div class={cn('relative flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel}>
        <label
          id={state.labelId}
          class="flex items-center gap-1 text-sm font-medium text-components-select-all-color-label-foreground-default"
        >
          {props.labelText}
          <Show when={props.showRequired}>
            <span
              aria-hidden="true"
              class="text-components-select-all-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </label>
      </Show>

      <div class="relative flex flex-col gap-2-5">
        <Show when={state.isOpen}>
          <div aria-hidden="true" class="fixed inset-0 z-10" onClick={() => state.closeList()}></div>
        </Show>

        <div
          id={props.id}
          role="combobox"
          tabindex={0}
          aria-haspopup="listbox"
          aria-expanded={state.isOpen}
          aria-controls={state.listboxId}
          aria-activedescendant={state.activeDescendant}
          aria-label={state.accessibleName}
          aria-labelledby={props.showLabel ? state.labelId : undefined}
          aria-required={props.showRequired}
          aria-invalid={state.hasError}
          aria-disabled={state.isDisabled}
          aria-describedby={props.showHint ? state.supportingId : undefined}
          class={cn(
            'relative z-20 flex w-full items-center gap-2-5 rounded-rounded-lg border px-3 py-2 text-sm text-foreground-default transition-colors outline-none focus-visible:ring-2',
            state.triggerClasses,
            state.ringClasses,
            state.isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          )}
          onClick={() => state.toggleList()}
          onKeyDown={(event) => state.handleKeyDown(event.key)}
        >
          <Show when={props.showLeftIcon}>
            <svg
              aria-hidden="true"
              class={cn('h-4 w-4 shrink-0', state.iconClasses)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path
                d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"
                stroke-linecap="round"
              />
            </svg>
          </Show>

          <span class={cn('flex-1 truncate text-left', state.textClasses)}>{state.displayText}</span>

          <Show when={props.showRightIcon}>
            <svg
              aria-hidden="true"
              class={cn(
                'h-4 w-4 shrink-0 transition-transform',
                state.iconClasses,
                state.isOpen && 'rotate-180'
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Show>
        </div>

        <div
          class={cn(
            'absolute top-full right-0 left-0 z-30 overflow-hidden rounded-rounded-lg border border-components-select-all-color-dropdown-menu-border-focus bg-components-select-all-color-dropdown-menu-background-focus shadow-lg',
            state.panelClasses,
            state.panelWrapperClasses
          )}
        >
          <Show when={props.showSearchInput}>
            <div class="flex items-center gap-2 border-b border-border-subtle px-2 py-2">
              <svg
                aria-hidden="true"
                class="h-4 w-4 shrink-0 text-components-input-dropdown-regular-color-icon-foreground-default"
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
                value={state.searchQuery}
                maxLength={props.maxSearchLength}
                aria-label={props.searchPlaceholder}
                aria-controls={state.listboxId}
                placeholder={props.searchPlaceholder}
                class="h-8 w-full bg-transparent text-sm text-components-select-all-color-trigger-foreground-default outline-none placeholder:text-components-select-all-color-placeholder-foreground-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                onInput={(event) => state.handleSearchInput(event.target.value)}
                onKeyDown={(event) => state.handleKeyDown(event.key)}
              />
              <Show when={props.showCharacterCount}>
                <span class="shrink-0 text-xs text-foreground-muted">{state.countText}</span>
              </Show>
            </div>
          </Show>

          <p aria-live="polite" class="sr-only">
            {state.resultCountText}
          </p>

          <div
            id={state.listboxId}
            role="listbox"
            aria-labelledby={props.showLabel ? state.labelId : undefined}
            class="max-h-60 overflow-y-auto p-1"
          >
            <For each={state.filteredOptions}>
              {(option, index) => (
                <div
                  key={option.value}
                  id={state.listboxId + '-option-' + index}
                  role="option"
                  aria-selected={option.value === props.value}
                  aria-disabled={option.disabled}
                  class={cn(
                    'flex cursor-pointer items-center justify-between gap-2 rounded-rounded-md px-2-5 py-2 text-sm outline-none',
                    option.value === props.value
                      ? 'bg-components-select-all-color-wrapper-background-focus font-medium text-primary-on-surface'
                      : 'text-components-select-all-color-trigger-foreground-default',
                    option.disabled && 'cursor-not-allowed opacity-50'
                  )}
                  onClick={() => state.selectOption(option)}
                >
                  <span class="truncate">{option.label}</span>
                  <Show when={option.value === props.value}>
                    <svg
                      aria-hidden="true"
                      class="h-4 w-4 shrink-0 text-primary-default"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="m5 12 5 5 9-10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </Show>
                </div>
              )}
            </For>
            <Show when={state.isEmpty}>
              <div class="px-2-5 py-2 text-sm text-foreground-muted">{props.emptyMessage}</div>
            </Show>
          </div>
        </div>
      </div>

      <Show when={props.showHint}>
        <span id={state.supportingId} class={cn('text-xs', state.supportingClasses)}>
          {props.hintErrorText}
        </span>
      </Show>
    </div>
  );
}
