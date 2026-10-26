import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface CheckboxProps {
  checked?: boolean;
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  size?: 'Small' | 'Medium' | 'Large';
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  useDefaultProps({
    checked: false,
    label: '',
    leftLabel: false,
    rightLabel: false,
    size: 'Small',
    disabled: false,
    id: '',
    name: '',
    value: '',
    ariaLabel: '',
    className: '',
  });

  const state = useStore({
    get hasLeftLabel() {
      return props.leftLabel === true && !!props.label;
    },
    get hasRightLabel() {
      return props.rightLabel === true && !!props.label;
    },
    get resolvedAriaLabel() {
      if (props.ariaLabel && props.ariaLabel.length > 0) {
        return props.ariaLabel;
      }
      return undefined;
    },
    get resolvedId() {
      if (props.id && props.id.length > 0) {
        return props.id;
      }
      return undefined;
    },
    get gapClasses() {
      switch (props.size) {
        case 'Medium':
          return 'gap-2';
        case 'Large':
          return 'gap-2.5';
        case 'Small':
        default:
          return 'gap-1.5';
      }
    },
    get boxSizeClasses() {
      switch (props.size) {
        case 'Medium':
          return 'w-5 h-5';
        case 'Large':
          return 'w-6 h-6';
        case 'Small':
        default:
          return 'w-4 h-4';
      }
    },
    get boxRadiusClasses() {
      switch (props.size) {
        case 'Medium':
          return 'rounded-md';
        case 'Large':
          return 'rounded-lg';
        case 'Small':
        default:
          return 'rounded-sm';
      }
    },
    get iconSizeClasses() {
      switch (props.size) {
        case 'Medium':
          return 'w-3.5 h-3.5';
        case 'Large':
          return 'w-4 h-4';
        case 'Small':
        default:
          return 'w-3 h-3';
      }
    },
    get labelSizeClasses() {
      switch (props.size) {
        case 'Medium':
          return 'text-sm leading-none';
        case 'Large':
          return 'text-base leading-none';
        case 'Small':
        default:
          return 'text-xs leading-none';
      }
    },
    get boxStateClasses() {
      return props.checked
        ? 'bg-primary-default border-primary-default text-primary-foreground'
        : 'bg-background-default border-border-default text-transparent';
    },
    handleChange() {
      if (props.disabled) {
        return;
      }
      if (props.onChange) {
        props.onChange(!props.checked);
      }
    },
  });

  return (
    <label
      class={cn(
        'inline-flex items-center select-none rounded-sm',
        state.gapClasses,
        props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        props.className
      )}
    >
      <Show when={state.hasLeftLabel}>
        <span class={cn('text-foreground-default', state.labelSizeClasses)}>{props.label}</span>
      </Show>

      <span class="relative inline-flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          class="sr-only peer"
          checked={props.checked}
          disabled={props.disabled}
          id={state.resolvedId}
          name={props.name}
          value={props.value}
          aria-label={state.resolvedAriaLabel}
          onChange={() => state.handleChange()}
        />
        <span
          aria-hidden="true"
          class={cn(
            'inline-flex items-center justify-center border transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary peer-focus-visible:ring-offset-2',
            state.boxSizeClasses,
            state.boxRadiusClasses,
            state.boxStateClasses
          )}
        >
          <Show when={props.checked}>
            <svg
              class={cn('shrink-0', state.iconSizeClasses)}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3.25 8.5L6.25 11.5L12.75 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Show>
        </span>
      </span>

      <Show when={state.hasRightLabel}>
        <span class={cn('text-foreground-default', state.labelSizeClasses)}>{props.label}</span>
      </Show>
    </label>
  );
}
