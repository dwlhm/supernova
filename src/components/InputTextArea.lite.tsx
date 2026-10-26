import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export type InputTextAreaVisualState = 'Default' | 'Focus' | 'Filled' | 'Error' | 'Disabled';

export interface InputTextAreaProps {
  value?: string;
  name?: string;
  id?: string;
  label?: string;
  labelText?: string;
  placeholder?: string;
  placeholderText?: string;
  hint?: string;
  hintErrorText?: string;
  errorMessage?: string;
  characterCount?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  showRequired?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  visualState?: InputTextAreaVisualState;
  className?: string;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function InputTextArea(props: InputTextAreaProps) {
  useDefaultProps({
    value: '',
    name: 'input-text-area',
    id: 'input-text-area',
    label: 'Your message',
    labelText: '',
    placeholder: '',
    placeholderText: 'Type your message here.',
    hint: '',
    hintErrorText: 'Your message will be copied to the support team.',
    errorMessage: '',
    characterCount: '',
    maxLength: 200,
    rows: 4,
    disabled: false,
    required: false,
    showRequired: false,
    showLabel: true,
    showHint: true,
    showCharacterCount: true,
    showLeftIcon: false,
    showRightIcon: false,
    visualState: 'Default',
    className: '',
  });

  const state = useStore({
    get isDisabled() {
      return props.disabled || props.visualState === 'Disabled';
    },
    get hasError() {
      return props.visualState === 'Error' || props.errorMessage !== '';
    },
    get isFocusState() {
      return props.visualState === 'Focus';
    },
    get isFilledState() {
      return props.visualState === 'Filled';
    },
    get isRequired() {
      return props.required || props.showRequired;
    },
    get resolvedLabel() {
      return props.labelText !== '' ? props.labelText : props.label;
    },
    get resolvedPlaceholder() {
      return props.placeholder !== '' ? props.placeholder : props.placeholderText;
    },
    get resolvedHint() {
      if (state.hasError) {
        return props.errorMessage !== '' ? props.errorMessage : props.hintErrorText;
      }
      return props.hint !== '' ? props.hint : props.hintErrorText;
    },
    get resolvedCount() {
      if (props.characterCount !== '') {
        return props.characterCount;
      }
      return props.value.length + ' / ' + props.maxLength;
    },
    get hintId() {
      return props.id + '-hint';
    },
    get describedBy() {
      return props.showHint ? state.hintId : '';
    },
    get containerClasses() {
      if (state.isDisabled) {
        return 'border-components-input-text-area-color-container-border-disabled';
      }
      if (state.hasError) {
        return 'border-components-input-text-area-color-container-border-error ring-focus-ring-error focus-within:ring-2';
      }
      if (state.isFocusState) {
        return 'border-components-input-text-area-color-container-border-focus ring-2 ring-focus-ring-primary';
      }
      if (state.isFilledState) {
        return 'border-components-input-text-area-color-container-border-filled ring-focus-ring-primary focus-within:border-components-input-text-area-color-container-border-focus focus-within:ring-2';
      }
      return 'border-components-input-text-area-color-container-border-default ring-focus-ring-primary focus-within:border-components-input-text-area-color-container-border-focus focus-within:ring-2';
    },
    get leftIconClasses() {
      if (state.isDisabled) {
        return 'text-components-input-text-area-color-left-icon-foreground-disabled';
      }
      if (state.hasError) {
        return 'text-components-input-text-area-color-left-icon-foreground-error';
      }
      if (state.isFocusState) {
        return 'text-components-input-text-area-color-left-icon-foreground-focus';
      }
      if (state.isFilledState) {
        return 'text-components-input-text-area-color-left-icon-foreground-filled';
      }
      return 'text-components-input-text-area-color-left-icon-foreground-default';
    },
    get rightIconClasses() {
      if (state.isDisabled) {
        return 'text-components-input-text-area-color-right-icon-foreground-disabled';
      }
      if (state.hasError) {
        return 'text-components-input-text-area-color-right-icon-foreground-error';
      }
      if (state.isFocusState) {
        return 'text-components-input-text-area-color-right-icon-foreground-focus';
      }
      if (state.isFilledState) {
        return 'text-components-input-text-area-color-right-icon-foreground-filled';
      }
      return 'text-components-input-text-area-color-right-icon-foreground-default';
    },
    get hintClasses() {
      if (state.hasError) {
        return 'text-components-input-text-area-color-supporting-text-foreground-error';
      }
      if (state.isDisabled) {
        return 'text-components-input-text-area-color-supporting-text-foreground-disabled';
      }
      return 'text-components-input-text-area-color-supporting-text-foreground-default';
    },
    get countClasses() {
      if (state.hasError) {
        return 'text-components-input-text-area-color-character-count-foreground-error';
      }
      if (state.isDisabled) {
        return 'text-components-input-text-area-color-character-count-foreground-disabled';
      }
      return 'text-components-input-text-area-color-character-count-foreground-default';
    },
    handleInput(rawValue) {
      if (state.isDisabled) {
        return;
      }
      const nextValue = rawValue.slice(0, props.maxLength);
      if (props.onValueChange) {
        props.onValueChange(nextValue);
      }
    },
    handleFocus() {
      if (props.onFocus) {
        props.onFocus();
      }
    },
    handleBlur() {
      if (props.onBlur) {
        props.onBlur();
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && state.resolvedLabel !== ''}>
        <label
          for={props.id}
          class="flex items-center gap-1 text-sm font-medium text-components-input-text-area-color-label-foreground-default"
        >
          <span>{state.resolvedLabel}</span>
          <Show when={state.isRequired}>
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
          'flex w-full items-start gap-2-5 rounded-rounded-lg border bg-components-input-text-area-color-container-background-default px-3 py-1 transition-colors',
          state.containerClasses,
          state.isDisabled && 'opacity-50'
        )}
      >
        <Show when={props.showLeftIcon}>
          <span aria-hidden="true" class={cn('flex shrink-0 items-start pt-2', state.leftIconClasses)}>
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </Show>

        <textarea
          id={props.id}
          name={props.name}
          rows={props.rows}
          value={props.value}
          placeholder={state.resolvedPlaceholder}
          maxLength={props.maxLength}
          disabled={state.isDisabled}
          required={state.isRequired}
          aria-invalid={state.hasError}
          aria-describedby={state.describedBy}
          class="w-full resize-y bg-transparent py-2 text-sm text-foreground-default outline-none placeholder:text-components-input-text-area-color-placeholder-foreground-default disabled:cursor-not-allowed"
          onInput={(event) => state.handleInput(event.target.value)}
          onFocus={() => state.handleFocus()}
          onBlur={() => state.handleBlur()}
        ></textarea>

        <Show when={props.showRightIcon}>
          <span aria-hidden="true" class={cn('flex shrink-0 items-start pt-2', state.rightIconClasses)}>
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="m8.5 12 2.5 2.5 4.5-5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </Show>
      </div>

      <Show when={props.showHint || props.showCharacterCount}>
        <div class="flex items-start justify-between gap-2-5">
          <Show when={props.showHint && state.resolvedHint !== ''}>
            <p id={state.hintId} class={cn('text-xs', state.hintClasses)}>
              {state.resolvedHint}
            </p>
          </Show>
          <Show when={props.showCharacterCount}>
            <span class={cn('ml-auto shrink-0 text-xs', state.countClasses)}>{state.resolvedCount}</span>
          </Show>
        </div>
      </Show>
    </div>
  );
}
