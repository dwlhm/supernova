import { For, useStore } from '@builder.io/mitosis';
import { getDropdownOptions } from '../components/utils';
import InputDropdown from '../components/InputDropdown.lite';
import InputDropdownItem from '../components/InputDropdownItem.lite';

export default function InputDropdownExample() {
  const state = useStore({
    hasError: false,
    isDisabled: false,
    open: true,
    value: 'Engineering',
    searchQuery: '',
    departments: ['Engineering', 'Product', 'Design', 'Operations'],
  });

  return (
    <div class="flex min-h-60 w-full max-w-xs flex-col gap-3">
      <div class="flex items-center justify-end gap-1.5">
        <button
          type="button"
          class="rounded-md border border-border-default bg-background-default px-2 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
          onClick={() => { state.hasError = !state.hasError; state.isDisabled = false; state.open = false; }}
        >
          {state.hasError ? 'Clear Error' : 'Simulate Error'}
        </button>
        <button
          type="button"
          class="rounded-md border border-border-default bg-background-default px-2 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
          onClick={() => { state.isDisabled = !state.isDisabled; state.hasError = false; state.open = false; }}
        >
          {state.isDisabled ? 'Enable' : 'Disable'}
        </button>
      </div>
      <InputDropdown
        label="Department"
        placeholder="Choose department"
        hint="Select your department or area of work."
        state={state.isDisabled ? 'disabled' : state.hasError ? 'error' : 'default'}
        error={state.hasError}
        errorMessage={state.hasError ? 'Please select a valid department.' : ''}
        disabled={state.isDisabled}
        showHint={true}
        showSearch={true}
        open={state.isDisabled ? false : state.open}
        value={state.value}
        searchQuery={state.searchQuery}
        onOpenChange={(nextOpen) => { state.open = nextOpen; if (!nextOpen) state.searchQuery = ''; }}
        onSearchChange={(q) => { state.searchQuery = q; }}
      >
        <For each={getDropdownOptions(state.departments, state.searchQuery, state.value)}>
          {(opt) => (
            <InputDropdownItem
              key={opt.value}
              value={opt.value}
              selected={opt.selected}
              onSelect={(val) => { state.value = val; state.open = false; state.searchQuery = ''; }}
            >
              {opt.label}
            </InputDropdownItem>
          )}
        </For>
      </InputDropdown>
    </div>
  );
}
