import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getOtpState, handleOtpInputEvent, handleOtpKeyDownEvent, handleOtpPasteEvent, bindControllerProps } from './utils';

export interface InputOTPProps {
  value?: string;
  length?: number;
  id?: string;
  name?: string;
  label?: string;
  hint?: string | ((value: string) => string);
  error?: boolean;
  errorMessage?: string;
  validating?: boolean;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
  onBlur?: (event: unknown) => void;
}

export default function InputOTP(props: InputOTPProps) {
  useDefaultProps({
    value: '', length: 6, id: 'input-otp', name: 'otp', label: '',
    hint: '', error: false, errorMessage: '', validating: false,
    disabled: false, required: false, showLabel: true, showHint: true, className: '',
  });

  return (
    <div id={props.id} data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex items-center gap-2 text-sm font-medium text-foreground-default">
          {props.label}
          <Show when={props.required}>
            <span aria-hidden="true" class="text-destructive-default">*</span>
          </Show>
        </span>
      </Show>
      <div
        class="flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5"
        role="group"
        aria-label={props.label}
        onPaste={(event) => !props.disabled && handleOtpPasteEvent(event, props.length || 6, props.onValueChange || props.onChange)}
      >
        <For each={getOtpState(props).digits}>
          {(digit) => (
            <input
              key={digit.index}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxlength="1"
              value={digit.char}
              disabled={props.disabled}
              aria-label={props.label + ' digit ' + (digit.index + 1)}
              aria-invalid={getOtpState(props).hasError}
              aria-describedby={(props.showHint || getOtpState(props).hasError) && getOtpState(props).helpText !== '' ? props.id + '-hint' : undefined}
              class={cn(
                'h-9 w-9 shrink-0 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10 sm:text-sm',
                getOtpState(props).hasError
                  ? 'border-destructive-border ring-2 ring-focus-ring-error'
                  : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary'
              )}
              onKeyDown={(event) => !props.disabled && handleOtpKeyDownEvent(event, digit.index, props.value, props.length || 6, props.onValueChange || props.onChange)}
              onInput={(event) => !props.disabled && handleOtpInputEvent(event, digit.index, props.value, props.length || 6, props.onValueChange || props.onChange)}
              onBlur={(event) => !props.disabled && props.onBlur && props.onBlur(event)}
            />
          )}
        </For>
      </div>
      <Show when={(props.showHint || getOtpState(props).hasError) && getOtpState(props).helpText !== ''}>
        <span id={props.id + '-hint'} class={cn('text-sm font-normal', getOtpState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>
          {getOtpState(props).helpText}
        </span>
      </Show>
    </div>
  );
}
