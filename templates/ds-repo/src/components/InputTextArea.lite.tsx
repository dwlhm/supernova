import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

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
    value: '',
    name: 'input-textarea',
    id: 'input-textarea',
    label: 'Your message',
    placeholder: 'Type your message here.',
    hint: 'Your message will be copied to the support team.',
    errorMessage: '',
    disabled: false,
    required: false,
    rows: 4,
    showLabel: true,
    showHint: true,
    showCharacterCount: true,
    maxLength: 200,
    showLeftIcon: false,
    showRightIcon: false,
    className: '',
  });

  const state = useStore({
    get hasError() {
      return props.errorMessage !== '';
    },
    get containerClasses() {
      if (state.hasError) {
        return 'border-components-input-text-area-color-container-border-error focus-within:ring-2 focus-within:ring-focus-ring-error';
      }
      return 'border-components-input-text-area-color-container-border-default focus-within:border-components-input-text-area-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary';
    },
    get iconClasses() {
      if (state.hasError) {
        return 'text-components-input-text-area-all-color-icon-foreground-error';
      }
      return 'text-components-input-text-area-all-color-icon-foreground-default';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-input-text-area-color-supporting-text-foreground-error'
        : 'text-components-input-text-area-color-supporting-text-foreground-default';
    },
    get countClasses() {
      return state.hasError
        ? 'text-components-input-text-area-color-character-count-foreground-error'
        : 'text-components-input-text-area-color-character-count-foreground-default';
    },
    get countText() {
      return props.value.length + ' / ' + props.maxLength;
    },
    handleInput(rawValue: string) {
      if (props.disabled) {
        return;
      }
      if (props.onValueChange) {
        props.onValueChange(rawValue);
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <label
          for={props.id}
          class="flex items-center gap-1 text-sm font-medium text-components-input-text-area-color-label-foreground-default"
        >
          {props.label}
          <Show when={props.required}>
            <span
              aria-hidden="true"
              class="text-components-input-text-area-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </label>
      </Show>
      <div
        class={cn(
          'flex items-start gap-2.5 rounded-rounded-lg border bg-components-input-text-area-color-container-background-default px-3 py-1 transition-colors',
          state.containerClasses,
          props.disabled && 'opacity-50'
        )}
      >
        <Show when={props.showLeftIcon}>
          <svg
            aria-hidden="true"
            class={cn('mt-2 h-4 w-4 shrink-0', state.iconClasses)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Show>
        <textarea
          id={props.id}
          name={props.name}
          rows={props.rows}
          value={props.value}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={state.hasError}
          aria-describedby={props.showHint ? props.id + '-hint' : undefined}
          class="w-full resize-y bg-transparent py-2 text-sm text-foreground-default outline-none placeholder:text-components-input-text-area-color-placeholder-foreground-default disabled:cursor-not-allowed"
          onInput={(event) => state.handleInput(event.target.value)}
        ></textarea>
        <Show when={props.showRightIcon}>
          <svg
            aria-hidden="true"
            class={cn('mt-2 h-4 w-4 shrink-0', state.iconClasses)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12 2.5 2.5 4.5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
      </div>
      <Show when={props.showHint || props.showCharacterCount}>
        <div class="flex items-start justify-between gap-2.5">
          <Show when={props.showHint}>
            <span id={props.id + '-hint'} class={cn('text-xs', state.supportingClasses)}>
              {state.supportingText}
            </span>
          </Show>
          <Show when={props.showCharacterCount}>
            <span class={cn('ml-auto shrink-0 text-xs', state.countClasses)}>{state.countText}</span>
          </Show>
        </div>
      </Show>
    </div>
  );
}
