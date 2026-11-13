import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getInputState, handleTextInput, ICON_PATHS, bindControllerProps } from './utils';

export interface InputTextProps {
  value?: string; defaultValue?: string; name?: string; id?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  label?: string; placeholder?: string; hint?: string | ((value: string) => string); error?: boolean; errorMessage?: string;
  validating?: boolean; disabled?: boolean; readOnly?: boolean; required?: boolean;
  showLabel?: boolean; showHint?: boolean; showCharacterCount?: boolean; maxLength?: number;
  showLeftIcon?: boolean; showRightIcon?: boolean; leftIcon?: any; rightIcon?: any; className?: string;
  onValueChange?: (value: string) => void; onChange?: (event: unknown) => void;
  onBlur?: (event: unknown) => void; onFocus?: (event: unknown) => void;
}

export default function InputText(props: InputTextProps) {
  useDefaultProps({
    value: '', defaultValue: '', name: 'input-text', id: 'input-text', type: 'text', label: '',
    placeholder: '', hint: '', error: false, errorMessage: '', validating: false,
    disabled: false, readOnly: false, required: false, showLabel: true, showHint: true, showCharacterCount: false,
    maxLength: 200, showLeftIcon: false, showRightIcon: false, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <label for={props.id} class="flex items-center gap-2 text-sm font-medium text-foreground-default">
          {props.label}
          <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
        </label>
      </Show>
      <div
        class={cn(
          'flex items-center gap-3 rounded-lg border px-3 shadow-xs transition-colors',
          props.disabled
            ? 'border-border-default bg-background-muted cursor-not-allowed opacity-50'
            : getInputState(props).hasError
              ? 'border-destructive-border bg-background-default ring-2 ring-focus-ring-error'
              : 'border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary'
        )}
      >
        <Show when={props.leftIcon}>
          <span class={cn('inline-flex shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{props.leftIcon}</span>
        </Show>
        <Show when={props.showLeftIcon && !props.leftIcon}>
          <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.search} stroke-linecap="round" /></svg>
        </Show>
        <input
          id={props.id} name={props.name} type={props.type} value={props.value}
          placeholder={props.placeholder} maxLength={props.maxLength} disabled={props.disabled} readOnly={props.readOnly} required={props.required}
          aria-invalid={getInputState(props).hasError} aria-busy={getInputState(props).isValidating || undefined}
          aria-describedby={(props.showHint || getInputState(props).hasError) && getInputState(props).helpText !== '' ? props.id + '-hint' : undefined}
          class="h-9 w-full bg-transparent text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
          onInput={(event) => handleTextInput(event, props.disabled, props.onValueChange, props.onChange)}
          onBlur={(event) => !props.disabled && props.onBlur && props.onBlur(event)}
          onFocus={(event) => !props.disabled && props.onFocus && props.onFocus(event)}
        />
        <Show when={getInputState(props).isValidating}>
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 animate-spin text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d={ICON_PATHS.loader} stroke-linecap="round" /></svg>
        </Show>
        <Show when={!getInputState(props).isValidating && props.rightIcon}>
          <span class={cn('inline-flex shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{props.rightIcon}</span>
        </Show>
        <Show when={!getInputState(props).isValidating && props.showRightIcon && !props.rightIcon}>
          <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.checkCircle} stroke-linecap="round" stroke-linejoin="round" /></svg>
        </Show>
      </div>
      <Show when={((props.showHint || getInputState(props).hasError) && getInputState(props).helpText !== '') || props.showCharacterCount}>
        <div class="flex items-start justify-between gap-2.5">
          <Show when={(props.showHint || getInputState(props).hasError) && getInputState(props).helpText !== ''}>
            <span id={props.id + '-hint'} class={cn('text-sm', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getInputState(props).helpText}</span>
          </Show>
          <Show when={props.showCharacterCount}>
            <span class={cn('ml-auto shrink-0 text-sm', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getInputState(props).countText}</span>
          </Show>
        </div>
      </Show>
    </div>
  );
}
