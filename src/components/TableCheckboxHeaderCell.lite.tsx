import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableCheckboxHeaderCellProps {
  /** True when every eligible row is selected. */
  checked?: boolean;
  /** True when only some eligible rows are selected (renders a dash). */
  indeterminate?: boolean;
  /** Disables bulk selection when it is unavailable. */
  disabled?: boolean;
  /** Accessible name announced for the select-all checkbox. */
  ariaLabel?: string;
  /** Extra classes merged onto the header cell. */
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export default function TableCheckboxHeaderCell(props: TableCheckboxHeaderCellProps) {
  useDefaultProps({
    checked: false,
    indeterminate: false,
    disabled: false,
    ariaLabel: 'Select all rows',
    className: '',
  });

  const state = useStore({
    get isChecked() {
      return Boolean(props.checked);
    },
    get isIndeterminate() {
      return Boolean(props.indeterminate);
    },
    get isActive() {
      return state.isChecked || state.isIndeterminate;
    },
    get ariaChecked() {
      if (state.isIndeterminate) {
        return 'mixed';
      }
      return state.isChecked ? 'true' : 'false';
    },
    get boxClasses() {
      return state.isActive
        ? 'border-components-checkbox-on-color-container-background-default bg-components-checkbox-on-color-container-background-default'
        : 'border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default';
    },
    get checkIconClasses() {
      return state.isChecked && !state.isIndeterminate ? 'opacity-100' : 'opacity-0';
    },
    get dashIconClasses() {
      return state.isIndeterminate ? 'opacity-100' : 'opacity-0';
    },
    handleChange() {
      if (props.disabled) {
        return;
      }
      if (props.onCheckedChange) {
        props.onCheckedChange(!state.isChecked);
      }
    },
  });

  return (
    <th
      scope="col"
      class={cn(
        'w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center align-middle font-normal',
        props.className
      )}
    >
      <span class="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          checked={state.isChecked}
          disabled={props.disabled}
          aria-label={props.ariaLabel}
          aria-checked={state.ariaChecked}
          class={cn(
            'peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border',
            'checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            state.boxClasses
          )}
          onChange={() => state.handleChange()}
        />
        <span class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg
            aria-hidden="true"
            class={cn(
              'h-3 w-3 text-components-checkbox-on-color-icon-foreground-default',
              state.checkIconClasses
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg
            aria-hidden="true"
            class={cn(
              'absolute h-3 w-3 text-components-checkbox-on-color-icon-foreground-default',
              state.dashIconClasses
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <path d="M5 12h14" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </span>
    </th>
  );
}
