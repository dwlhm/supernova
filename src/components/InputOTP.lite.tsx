import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputOTPProps {
  /** Field label text. */
  labelText?: string;
  /** Supporting guidance or validation / error message. */
  hintErrorText?: string;
  /** Toggles the required indicator next to the label. */
  showRequired?: boolean;
  /** Toggles the supporting / error text below the input. */
  showHint?: boolean;
  /** Toggles the field label. */
  showLabel?: boolean;
  /** Visual state — maps to the Figma "State" property. */
  variant?: 'Default' | 'Focus' | 'Filled' | 'Error' | 'Disabled';
  /** Number of OTP cells. */
  length?: number;
  /** Current code value. */
  value?: string;
  /** Native input id used for label association. */
  id?: string;
  /** Native input name. */
  name?: string;
  /** Disables the field. */
  disabled?: boolean;
  /** Forces the error presentation. */
  error?: boolean;
  /** Emitted whenever the sanitized code changes. */
  onValueChange?: (value: string) => void;
  /** Emitted once every cell has been filled. */
  onComplete?: (value: string) => void;
  /** Additional classes for the root element. */
  className?: string;
}

export default function InputOTP(props: InputOTPProps) {
  useDefaultProps({
    labelText: 'Label',
    hintErrorText: 'Please enter the one-time password sent to your phone.',
    showRequired: false,
    showHint: true,
    showLabel: true,
    variant: 'Default',
    length: 6,
    value: '',
    id: 'input-otp',
    name: 'one-time-password',
    disabled: false,
    error: false,
    className: '',
  });

  const state = useStore({
    inputValue: props.value || '',
    isFocused: false,

    get cellCount() {
      const declared = props.length || 6;
      return declared > 0 ? declared : 6;
    },

    get isError() {
      return props.error === true || props.variant === 'Error';
    },

    get isDisabled() {
      return props.disabled === true || props.variant === 'Disabled';
    },

    get isFilledState() {
      return props.variant === 'Filled';
    },

    get isFocusVisible() {
      return state.isFocused === true || props.variant === 'Focus';
    },

    get activeIndex() {
      const lastIndex = state.cellCount - 1;
      if (state.inputValue.length >= lastIndex) {
        return lastIndex;
      }
      return state.inputValue.length;
    },

    get resolvedId() {
      return props.id || 'input-otp';
    },

    get hintId() {
      return (props.id || 'input-otp') + '-hint';
    },

    get describedBy() {
      return props.showHint === false ? undefined : state.hintId;
    },

    get cells() {
      const list: { key: string; char: string; classes: string }[] = [];
      for (let index = 0; index < state.cellCount; index++) {
        const char = state.inputValue.length > index ? state.inputValue.charAt(index) : '';
        const isActive = state.isFocusVisible === true && index === state.activeIndex;
        const showValueColor = char !== '' || state.isFilledState === true;

        list.push({
          key: 'otp-cell-' + index,
          char,
          classes: cn(
            'flex items-center justify-center select-none w-10 h-11 rounded-md border text-base font-medium transition-colors',
            state.isFilledState === true
              ? 'bg-components-input-otp-color-box-background-filled'
              : 'bg-components-input-otp-color-box-background-default',
            state.isError === true
              ? 'border-components-input-otp-color-box-border-error'
              : isActive
                ? 'border-components-input-otp-color-box-border-focus'
                : 'border-components-input-otp-color-box-border-default',
            showValueColor
              ? 'text-components-input-otp-color-otp-value-foreground-filled'
              : 'text-components-input-otp-color-supporting-text-foreground-default',
            state.isError === true
              ? isActive
                ? 'shadow-focus-ring-error'
                : ''
              : isActive
                ? 'ring-1 ring-components-input-otp-color-box-border-focus'
                : '',
          ),
        });
      }
      return list;
    },

    handleInput(rawValue) {
      const digitsOnly = rawValue.replace(/[^0-9]/g, '');
      const nextValue = digitsOnly.slice(0, state.cellCount);
      state.inputValue = nextValue;
      if (props.onValueChange) {
        props.onValueChange(nextValue);
      }
      if (nextValue.length === state.cellCount && props.onComplete) {
        props.onComplete(nextValue);
      }
    },

    handleFocus() {
      state.isFocused = true;
    },

    handleBlur() {
      state.isFocused = false;
    },
  });

  return (
    <div
      class={cn(
        'flex flex-col justify-start items-start gap-3 px-3 py-3 rounded-md',
        state.isDisabled === true ? 'opacity-50' : '',
        props.className,
      )}
    >
      <Show when={props.showLabel !== false}>
        <div class="flex items-center gap-2">
          <label
            for={state.resolvedId}
            class="text-sm font-medium text-components-input-otp-color-label-foreground-default"
          >
            {props.labelText}
          </label>
          <Show when={props.showRequired === true}>
            <span
              aria-hidden="true"
              class="text-sm font-medium text-components-input-otp-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </div>
      </Show>

      <div class="relative">
        <div class="flex flex-row items-center gap-2-5" aria-hidden="true">
          <For each={state.cells}>
            {(cell) => (
              <span key={cell.key} class={cell.classes}>
                {cell.char}
              </span>
            )}
          </For>
        </div>
        <input
          id={state.resolvedId}
          name={props.name}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={state.inputValue}
          disabled={state.isDisabled}
          required={props.showRequired}
          aria-invalid={state.isError}
          aria-required={props.showRequired}
          aria-describedby={state.describedBy}
          onInput={(event) => state.handleInput(event.target.value)}
          onFocus={() => state.handleFocus()}
          onBlur={() => state.handleBlur()}
          class="absolute inset-0 w-full h-full opacity-0 cursor-text focus:outline-none"
        />
      </div>

      <Show when={props.showHint !== false && (props.hintErrorText || '').length > 0}>
        <p
          id={state.hintId}
          class={cn(
            'text-xs',
            state.isError === true
              ? 'text-components-input-otp-color-supporting-text-foreground-error'
              : 'text-components-input-otp-color-supporting-text-foreground-default',
          )}
        >
          {props.hintErrorText}
        </p>
      </Show>
    </div>
  );
}
