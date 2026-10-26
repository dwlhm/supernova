import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableCheckboxBodyCellProps {
  /** Whether the row is currently selected. */
  checked?: boolean;
  /** Renders the mixed/partial state (some rows in a group selected). */
  indeterminate?: boolean;
  /** Prevents interaction and dims the control. */
  disabled?: boolean;
  /** Optional leading text rendered before the checkbox. */
  leftLabel?: string;
  /** Optional visible label rendered after the checkbox. */
  label?: string;
  /** Accessible name used when no visible label is provided. */
  ariaLabel?: string;
  /** Stable row identifier used to derive the input id. */
  rowId?: string;
  /** Native form field name for the selection field. */
  name?: string;
  /** Additional classes for the cell. */
  className?: string;
  children?: any;
  /** Called with the next selection value when the checkbox is toggled. */
  onChange?: (checked: boolean) => void;
}

export default function TableCheckboxBodyCell(props: TableCheckboxBodyCellProps) {
  useDefaultProps({
    checked: false,
    indeterminate: false,
    disabled: false,
    className: '',
  });

  const state = useStore({
    get checkboxId() {
      const suffix = props.rowId || props.name || 'row';
      return 'table-select-' + suffix;
    },
    get isSelected() {
      return props.checked || props.indeterminate;
    },
    get hasVisibleLabel() {
      return !!(props.label || props.leftLabel);
    },
    get accessibleLabel() {
      return props.ariaLabel || props.label || props.leftLabel || 'Select row';
    },
    get ariaChecked() {
      if (props.indeterminate) {
        return 'mixed';
      }
      return props.checked ? 'true' : 'false';
    },
    get inputClasses() {
      return cn(
        'h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-rounded-sm border transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-ring-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        state.isSelected
          ? 'border-components-checkbox-on-color-container-background-default bg-components-checkbox-on-color-container-background-default'
          : 'border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default'
      );
    },
    get checkIconClasses() {
      return cn(
        'pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2',
        'stroke-components-checkbox-on-color-icon-foreground-default transition-opacity',
        props.checked && !props.indeterminate ? 'opacity-100' : 'opacity-0'
      );
    },
    get dashIconClasses() {
      return cn(
        'pointer-events-none absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2',
        'bg-components-checkbox-on-color-icon-foreground-default transition-opacity',
        props.indeterminate ? 'opacity-100' : 'opacity-0'
      );
    },
    get labelClasses() {
      return 'select-none text-xs leading-4 text-components-checkbox-all-color-label-foreground-default';
    },
    handleToggle() {
      if (props.disabled) {
        return;
      }
      const next = props.indeterminate ? true : !props.checked;
      if (props.onChange) {
        props.onChange(next);
      }
    },
  });

  return (
    <td class={cn('px-4 py-3', props.className)}>
      <div class="flex flex-row items-center justify-center">
        <label
          class={cn(
            'flex flex-row items-center gap-1-5',
            props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          )}
        >
          <Show when={props.leftLabel}>
            <span class={state.labelClasses}>{props.leftLabel}</span>
          </Show>
          <span class="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              id={state.checkboxId}
              name={props.name}
              checked={props.checked}
              disabled={props.disabled}
              aria-checked={state.ariaChecked}
              aria-label={state.hasVisibleLabel ? undefined : state.accessibleLabel}
              class={state.inputClasses}
              onChange={() => state.handleToggle()}
            />
            <svg
              class={state.checkIconClasses}
              viewBox="0 0 12 12"
              fill="none"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M2 6.2 4.6 8.8 10 3.4" />
            </svg>
            <span class={state.dashIconClasses} aria-hidden="true" />
          </span>
          <Show when={props.label}>
            <span class={state.labelClasses}>{props.label}</span>
          </Show>
        </label>
        {props.children}
      </div>
    </td>
  );
}
