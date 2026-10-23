import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface OtpDigit {
  index: number;
  char: string;
}

export interface InputOTPProps {
  value?: string;
  length?: number;
  id?: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

export default function InputOTP(props: InputOTPProps) {
  useDefaultProps({
    value: '',
    length: 6,
    id: 'input-otp',
    label: 'Label',
    hint: 'Please enter the one-time password sent to your phone.',
    errorMessage: '',
    disabled: false,
    required: false,
    showLabel: true,
    showHint: true,
    className: '',
  });

  const state = useStore({
    get hasError() {
      return props.errorMessage !== '';
    },
    get digits() {
      const total = props.length;
      const chars = props.value ? props.value.split('') : [];
      const rows: OtpDigit[] = [];
      for (let i = 0; i < total; i++) {
        rows.push({ index: i, char: i < chars.length ? chars[i] : '' });
      }
      return rows;
    },
    get boxClasses() {
      if (state.hasError) {
        return 'border-components-input-otp-color-box-border-error';
      }
      return 'border-components-input-otp-color-box-border-default focus:border-components-input-otp-color-box-border-focus';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-input-otp-color-supporting-text-foreground-error'
        : 'text-components-input-otp-color-supporting-text-foreground-default';
    },
    handleDigit(index: number, rawValue: string) {
      if (props.disabled) {
        return;
      }
      const total = props.length;
      const current = props.value || '';
      const chars: string[] = [];
      for (let i = 0; i < total; i++) {
        chars.push(i < current.length ? current[i] : '');
      }
      const nextChar = rawValue !== '' ? rawValue.slice(rawValue.length - 1) : '';
      chars[index] = nextChar;
      if (props.onChange) {
        props.onChange(chars.join(''));
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex items-center gap-1 text-sm font-medium text-components-input-otp-color-label-foreground-default">
          {props.label}
          <Show when={props.required}>
            <span
              aria-hidden="true"
              class="text-components-input-otp-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </span>
      </Show>
      <div class="flex items-center gap-2.5" role="group" aria-label={props.label}>
        <For each={state.digits}>
          {(digit) => (
            <input
              key={digit.index}
              type="text"
              maxlength="1"
              value={digit.char}
              disabled={props.disabled}
              aria-label={props.label + ' digit ' + (digit.index + 1)}
              aria-invalid={state.hasError}
              class={cn(
                'h-12 w-10 rounded-rounded-md border bg-components-input-otp-color-box-background-default text-center text-base font-medium text-components-input-otp-color-otp-value-foreground-filled outline-none transition-colors focus:ring-2 focus:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50',
                state.boxClasses
              )}
              onInput={(event) => state.handleDigit(digit.index, event.target.value)}
            />
          )}
        </For>
      </div>
      <Show when={props.showHint}>
        <span class={cn('text-xs', state.supportingClasses)}>{state.supportingText}</span>
      </Show>
    </div>
  );
}
