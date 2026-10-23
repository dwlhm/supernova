import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputTextProps {
  value?: string;
  name?: string;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

export default function InputText(props: InputTextProps) {
  useDefaultProps({
    value: '',
    name: 'input-text',
    id: 'input-text',
    type: 'text',
    label: 'Username',
    placeholder: 'Max Leiter',
    hint: 'Choose a unique username for your account.',
    errorMessage: '',
    disabled: false,
    required: false,
    showLabel: true,
    showHint: true,
    showCharacterCount: false,
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
        return 'border-components-input-text-color-container-border-error focus-within:ring-2 focus-within:ring-focus-ring-error';
      }
      return 'border-components-input-text-color-container-border-default focus-within:border-components-input-text-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary';
    },
    get iconClasses() {
      if (state.hasError) {
        return 'text-components-input-text-color-left-icon-foreground-error';
      }
      return 'text-components-input-text-color-left-icon-foreground-default';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-input-text-color-supporting-text-foreground-error'
        : 'text-components-input-text-color-supporting-text-foreground-default';
    },
    get countClasses() {
      return state.hasError
        ? 'text-components-input-text-color-character-count-foreground-error'
        : 'text-components-input-text-color-character-count-foreground-default';
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
          class="flex items-center gap-1 text-sm font-medium text-components-input-text-color-label-foreground-default"
        >
          {props.label}
          <Show when={props.required}>
            <span
              aria-hidden="true"
              class="text-components-input-text-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </label>
      </Show>
      <div
        class={cn(
          'flex items-center gap-2.5 rounded-rounded-lg border bg-components-input-text-color-container-background-default px-3 transition-colors',
          state.containerClasses,
          props.disabled && 'opacity-50'
        )}
      >
        <Show when={props.showLeftIcon}>
          <svg
            aria-hidden="true"
            class={cn('h-4 w-4 shrink-0', state.iconClasses)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" stroke-linecap="round" />
          </svg>
        </Show>
        <input
          id={props.id}
          name={props.name}
          type={props.type}
          value={props.value}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={state.hasError}
          aria-describedby={props.showHint ? props.id + '-hint' : undefined}
          class="h-9 w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-components-input-text-color-placeholder-foreground-default disabled:cursor-not-allowed"
          onInput={(event) => state.handleInput(event.target.value)}
        />
        <Show when={props.showRightIcon}>
          <svg
            aria-hidden="true"
            class={cn('h-4 w-4 shrink-0', state.iconClasses)}
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
