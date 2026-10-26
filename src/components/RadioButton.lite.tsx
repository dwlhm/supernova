import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export type RadioButtonSize = 'Small' | 'Medium' | 'Large';

export interface RadioButtonProps {
  /**
   * Option text. The control and its label form one interaction target because
   * the input is nested inside the <label> element.
   */
  label?: string;
  /** Renders the label before the radio circle. */
  leftLabel?: boolean;
  /** Renders the label after the radio circle. Prefer one position at a time. */
  rightLabel?: boolean;
  /** Selected ("on") / unselected ("off") state of the control. */
  checked?: boolean;
  /** Makes the option unavailable for interaction. */
  disabled?: boolean;
  /** Small, Medium or Large — use one size consistently within a group. */
  size?: RadioButtonSize;
  /** Shared group name so the browser keeps exactly one option selected. */
  name?: string;
  /** Value emitted through `onChange` when this option is selected. */
  value?: string;
  /** Optional DOM id for the underlying input element. */
  id?: string;
  className?: string;
  /** Called with the option value when the user selects this radio. */
  onChange?: (value: string) => void;
}

export default function RadioButton(props: RadioButtonProps) {
  useDefaultProps({
    label: '',
    leftLabel: false,
    rightLabel: false,
    checked: false,
    disabled: false,
    size: 'Medium',
    className: '',
  });

  const state = useStore({
    get isChecked() {
      return props.checked === true;
    },
    get hasLabel() {
      return props.label !== undefined && props.label !== '';
    },
    get showLabelLeft() {
      return state.hasLabel && props.leftLabel === true;
    },
    get showLabelRight() {
      return state.hasLabel && props.rightLabel === true;
    },
    /**
     * Only expose the option text as an accessible name when it is not already
     * rendered as visible label content.
     */
    get ariaLabel() {
      if (!state.hasLabel) return undefined;
      if (state.showLabelLeft || state.showLabelRight) return undefined;
      return props.label;
    },
    get circleSizeClasses() {
      switch (props.size) {
        case 'Small':
          return 'h-3 w-3';
        case 'Large':
          return 'size-4';
        case 'Medium':
        default:
          return 'size-3';
      }
    },
    get dotSizeClasses() {
      switch (props.size) {
        case 'Small':
          return 'h-1 w-1';
        case 'Large':
          return 'size-2';
        case 'Medium':
        default:
          return 'size-1.5';
      }
    },
    get labelSizeClasses() {
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
    get containerClasses() {
      return cn(
        'inline-flex select-none flex-row items-center gap-2',
        props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      );
    },
    get circleClasses() {
      return cn(
        'shrink-0 appearance-none rounded-full border bg-background-default shadow-xs transition-colors',
        'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-0',
        state.circleSizeClasses,
        state.isChecked ? 'border-primary-default' : 'border-border-default',
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      );
    },
    get labelClasses() {
      return cn('text-foreground-default', state.labelSizeClasses);
    },
    get dotClasses() {
      return cn(
        'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-default',
        state.dotSizeClasses
      );
    },
    handleChange() {
      if (props.disabled) return;
      if (props.onChange) {
        props.onChange(props.value === undefined ? '' : props.value);
      }
    },
  });

  return (
    <label class={cn(state.containerClasses, props.className)}>
      <Show when={state.showLabelLeft}>
        <span class={state.labelClasses}>{props.label}</span>
      </Show>

      <span class="relative inline-flex shrink-0 items-center justify-center">
        <input
          type="radio"
          id={props.id}
          name={props.name}
          value={props.value}
          checked={state.isChecked}
          disabled={props.disabled}
          aria-label={state.ariaLabel}
          class={state.circleClasses}
          onChange={() => state.handleChange()}
        />
        <Show when={state.isChecked}>
          <span class={state.dotClasses} aria-hidden="true" />
        </Show>
      </span>

      <Show when={state.showLabelRight}>
        <span class={state.labelClasses}>{props.label}</span>
      </Show>
    </label>
  );
}
