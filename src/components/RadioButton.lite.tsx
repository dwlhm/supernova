import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface RadioButtonProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export default function RadioButton(props: RadioButtonProps) {
  useDefaultProps({
    checked: false,
    disabled: false,
    size: 'medium',
    label: 'Label',
    leftLabel: false,
    rightLabel: true,
    name: 'radio-group',
    value: '',
    className: '',
  });

  const state = useStore({
    get circleClasses() {
      switch (props.size) {
        case 'small':
          return 'h-4 w-4';
        case 'large':
          return 'h-6 w-6';
        case 'medium':
        default:
          return 'h-5 w-5';
      }
    },
    get dotClasses() {
      switch (props.size) {
        case 'small':
          return 'h-1.5 w-1.5';
        case 'large':
          return 'h-2.5 w-2.5';
        case 'medium':
        default:
          return 'h-2 w-2';
      }
    },
    get hasLabel() {
      return props.label !== '';
    },
    handleChange() {
      if (props.disabled) {
        return;
      }
      if (props.onChange) {
        props.onChange(props.value);
      }
    },
  });

  return (
    <label
      class={cn(
        'inline-flex items-center gap-2',
        props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        props.className
      )}
    >
      <Show when={props.leftLabel && state.hasLabel}>
        <span class="text-sm text-components-radio-button-all-color-label-foreground-default">
          {props.label}
        </span>
      </Show>
      <span class="relative inline-flex shrink-0 items-center justify-center">
        <input
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          disabled={props.disabled}
          aria-label={state.hasLabel ? props.label : 'Option'}
          class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-rounded-full opacity-0 disabled:cursor-not-allowed"
          onChange={() => state.handleChange()}
        />
        <span
          class={cn(
            'inline-flex items-center justify-center rounded-rounded-full border bg-components-radio-button-all-color-circle-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary',
            state.circleClasses,
            props.checked
              ? 'border-components-radio-button-on-color-indicator-fill-default'
              : 'border-components-radio-button-all-color-circle-border-default'
          )}
          aria-hidden="true"
        >
          <Show when={props.checked}>
            <span
              class={cn(
                'rounded-rounded-full bg-components-radio-button-on-color-indicator-fill-default',
                state.dotClasses
              )}
            />
          </Show>
        </span>
      </span>
      <Show when={props.rightLabel && state.hasLabel}>
        <span class="text-sm text-components-radio-button-all-color-label-foreground-default">
          {props.label}
        </span>
      </Show>
    </label>
  );
}
