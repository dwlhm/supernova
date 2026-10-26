import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SwitchButtonProps {
  /** Current on/off value. The switch is uncontrolled when omitted. */
  checked?: boolean;
  disabled?: boolean;
  size?: 'Small' | 'Medium' | 'Large';
  /** Shows the optional label to the left of the track. */
  leftLabel?: boolean;
  /** Shows the optional label to the right of the track. */
  rightLabel?: boolean;
  leftLabelText?: string;
  rightLabelText?: string;
  /** Accessible name used when no visible label is rendered. */
  ariaLabel?: string;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export default function SwitchButton(props: SwitchButtonProps) {
  useDefaultProps({
    disabled: false,
    size: 'Medium',
    leftLabel: false,
    rightLabel: false,
    leftLabelText: 'Off',
    rightLabelText: 'On',
    className: '',
  });

  const state = useStore({
    internalChecked: false,
    get isOn() {
      return props.checked === undefined || props.checked === null
        ? state.internalChecked
        : props.checked;
    },
    get isDisabled() {
      return props.disabled === true;
    },
    get trackSizeClasses() {
      switch (props.size) {
        case 'Small':
          return 'h-4 w-8 px-0-5';
        case 'Large':
          return 'h-6 w-12 px-0-5';
        case 'Medium':
        default:
          return 'h-5 w-10 px-0-5';
      }
    },
    get thumbSizeClasses() {
      switch (props.size) {
        case 'Small':
          return 'h-3 w-3';
        case 'Large':
          return 'h-5 w-5';
        case 'Medium':
        default:
          return 'h-4 w-4';
      }
    },
    get labelTextClasses() {
      switch (props.size) {
        case 'Small':
          return 'text-xs';
        case 'Large':
          return 'text-base';
        case 'Medium':
        default:
          return 'text-sm';
      }
    },
    get trackAlignClasses() {
      return state.isOn ? 'justify-end' : 'justify-start';
    },
    get trackColorClasses() {
      return state.isOn
        ? 'bg-components-switch-on-color-track-background-default hover:bg-primary-hover active:bg-primary-pressed'
        : 'bg-components-switch-off-color-track-background-default hover:bg-background-interactive active:bg-neutral-300';
    },
    get thumbColorClasses() {
      return state.isOn
        ? 'bg-components-switch-on-color-thumb-background-default'
        : 'bg-components-switch-off-color-thumb-background-default';
    },
    get containerClasses() {
      return state.isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';
    },
    get labelTextColorClasses() {
      return state.isDisabled ? 'text-foreground-muted' : 'text-foreground-default';
    },
    toggle() {
      if (state.isDisabled) return;
      const nextValue = !state.isOn;
      state.internalChecked = nextValue;
      if (props.onChange) {
        props.onChange(nextValue);
      }
    },
  });

  return (
    <button
      type="button"
      role="switch"
      id={props.id}
      name={props.name}
      aria-checked={state.isOn}
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      class={cn(
        'inline-flex select-none items-center gap-2-5 rounded-xl font-sans transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none',
        state.containerClasses,
        props.className
      )}
      onClick={() => state.toggle()}
    >
      <Show when={props.leftLabel}>
        <span
          class={cn(
            'px-2 leading-none',
            state.labelTextClasses,
            state.labelTextColorClasses
          )}
        >
          {props.leftLabelText}
        </span>
      </Show>

      <span
        class={cn(
          'inline-flex shrink-0 items-center rounded-full transition-colors',
          state.trackSizeClasses,
          state.trackAlignClasses,
          state.trackColorClasses
        )}
      >
        <span
          class={cn(
            'inline-block shrink-0 rounded-full shadow-xs transition-colors',
            state.thumbSizeClasses,
            state.thumbColorClasses
          )}
        />
      </span>

      <Show when={props.rightLabel}>
        <span
          class={cn(
            'px-2 leading-none',
            state.labelTextClasses,
            state.labelTextColorClasses
          )}
        >
          {props.rightLabelText}
        </span>
      </Show>
    </button>
  );
}
