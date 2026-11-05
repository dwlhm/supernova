import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getInputState, ICON_PATHS, bindControllerProps } from './utils';

export interface InputTextAreaProps {
  value?: string;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  showLabel?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

export default function InputTextArea(props: InputTextAreaProps) {
  useDefaultProps({
    value: '', name: 'input-textarea', id: 'input-textarea', label: 'Your message',
    placeholder: 'Type your message here.', hint: 'Your message will be copied to the support team.',
    errorMessage: '', disabled: false, required: false, rows: 4, showLabel: true, showHint: true,
    showCharacterCount: true, maxLength: 200, showLeftIcon: false, showRightIcon: false, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <label for={props.id} class="flex items-center gap-1 text-sm font-medium text-foreground-default">
          {props.label}
          <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
        </label>
      </Show>
      <div
        class={cn(
          'flex items-start gap-3 rounded-lg border px-3 py-1 shadow-xs transition-colors',
          props.disabled
            ? 'border-border-default bg-background-muted cursor-not-allowed opacity-50'
            : getInputState(props).hasError
              ? 'border-destructive-border bg-background-default focus-within:ring-2 focus-within:ring-focus-ring-error'
              : 'border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary'
        )}
      >
        <Show when={props.showLeftIcon}>
          <svg aria-hidden="true" class={cn('mt-2 h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.file} stroke-linecap="round" stroke-linejoin="round" /></svg>
        </Show>
        <textarea
          id={props.id} name={props.name} rows={props.rows} value={props.value}
          placeholder={props.placeholder} maxLength={props.maxLength} disabled={props.disabled} required={props.required}
          aria-invalid={getInputState(props).hasError} aria-describedby={props.showHint ? props.id + '-hint' : undefined}
          class="w-full resize-y bg-transparent py-2 text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
          onInput={(event) => !props.disabled && props.onValueChange && props.onValueChange(event.target.value)}
        ></textarea>
        <Show when={props.showRightIcon}>
          <svg aria-hidden="true" class={cn('mt-2 h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.checkCircle} stroke-linecap="round" stroke-linejoin="round" /></svg>
        </Show>
      </div>
      <Show when={props.showHint || props.showCharacterCount}>
        <div class="flex items-start justify-between gap-2.5">
          <Show when={props.showHint}>
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
