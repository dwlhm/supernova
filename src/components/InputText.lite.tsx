import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputTextProps {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  value?: string;
  autoComplete?: string;
  labelText?: string;
  placeholderText?: string;
  hintErrorText?: string;
  characterCount?: string;
  maxLength?: number;
  showLabel?: boolean;
  showRequired?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  visualState?: 'Default' | 'Focus' | 'Filled' | 'Error' | 'Disabled';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

export default function InputText(props: InputTextProps) {
  useDefaultProps({
    id: 'input-text',
    name: 'input-text',
    type: 'text',
    value: '',
    autoComplete: 'off',
    labelText: 'Username',
    placeholderText: 'Max Leiter',
    hintErrorText: 'Choose a unique username for your account.',
    characterCount: '',
    maxLength: 200,
    showLabel: true,
    showRequired: true,
    showHint: true,
    showCharacterCount: false,
    showLeftIcon: false,
    showRightIcon: true,
    leftIcon: 'search',
    rightIcon: 'check',
    visualState: 'Default',
    disabled: false,
    required: false,
    className: '',
  });

  const state = useStore({
    internalValue: '',
    get isDisabled() {
      return props.disabled || props.visualState === 'Disabled';
    },
    get hasError() {
      return props.visualState === 'Error';
    },
    get currentValue() {
      return props.value !== '' ? props.value : state.internalValue;
    },
    get hasSupportingText() {
      return props.showHint && props.hintErrorText !== '';
    },
    get hasCount() {
      return props.showCharacterCount;
    },
    get countText() {
      if (props.characterCount !== '') {
        return props.characterCount;
      }
      return state.currentValue.length + ' / ' + props.maxLength;
    },
    get describedBy() {
      if (state.hasSupportingText && state.hasCount) {
        return props.id + '-hint ' + props.id + '-count';
      }
      if (state.hasSupportingText) {
        return props.id + '-hint';
      }
      if (state.hasCount) {
        return props.id + '-count';
      }
      return undefined;
    },
    get containerClasses() {
      if (state.isDisabled) {
        return 'border-components-input-text-color-container-border-disabled bg-components-input-text-color-container-background-disabled';
      }
      if (state.hasError) {
        return 'border-components-input-text-color-container-border-error bg-components-input-text-color-container-background-error focus-within:ring-2 focus-within:ring-focus-ring-error';
      }
      if (props.visualState === 'Focus') {
        return 'border-components-input-text-color-container-border-focus bg-components-input-text-color-container-background-focus ring-2 ring-focus-ring-primary';
      }
      if (props.visualState === 'Filled') {
        return 'border-components-input-text-color-container-border-filled bg-components-input-text-color-container-background-filled focus-within:border-components-input-text-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary';
      }
      return 'border-components-input-text-color-container-border-default bg-components-input-text-color-container-background-default focus-within:border-components-input-text-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary';
    },
    get leftIconClasses() {
      if (state.isDisabled) {
        return 'text-components-input-text-color-left-icon-foreground-disabled';
      }
      if (state.hasError) {
        return 'text-components-input-text-color-left-icon-foreground-error';
      }
      if (props.visualState === 'Focus') {
        return 'text-components-input-text-color-left-icon-foreground-focus';
      }
      if (props.visualState === 'Filled') {
        return 'text-components-input-text-color-left-icon-foreground-filled';
      }
      return 'text-components-input-text-color-left-icon-foreground-default';
    },
    get rightIconClasses() {
      if (state.isDisabled) {
        return 'text-components-input-text-color-right-icon-foreground-disabled';
      }
      if (state.hasError) {
        return 'text-components-input-text-color-right-icon-foreground-error';
      }
      if (props.visualState === 'Focus') {
        return 'text-components-input-text-color-right-icon-foreground-focus';
      }
      if (props.visualState === 'Filled') {
        return 'text-components-input-text-color-right-icon-foreground-filled';
      }
      return 'text-components-input-text-color-right-icon-foreground-default';
    },
    get supportingClasses() {
      if (state.hasError) {
        return 'text-components-input-text-color-supporting-text-foreground-error';
      }
      if (state.isDisabled) {
        return 'text-components-input-text-color-supporting-text-foreground-disabled';
      }
      return 'text-components-input-text-color-supporting-text-foreground-default';
    },
    get countClasses() {
      if (state.hasError) {
        return 'text-components-input-text-color-character-count-foreground-error';
      }
      if (state.isDisabled) {
        return 'text-components-input-text-color-character-count-foreground-disabled';
      }
      return 'text-components-input-text-color-character-count-foreground-default';
    },
    get leftIconPath() {
      switch (props.leftIcon) {
        case 'user':
          return 'M12 11.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM4.5 20.25c0-3.05 3.36-5.5 7.5-5.5s7.5 2.45 7.5 5.5';
        case 'user-circle':
          return 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM7.5 18.25c.75-2 2.5-3.25 4.5-3.25s3.75 1.25 4.5 3.25';
        case 'mail':
          return 'M3.75 6.25h16.5v11.5H3.75zM4.25 6.75 12 12.75l7.75-6';
        case 'lock':
          return 'M8.25 10.5V8.25a3.75 3.75 0 0 1 7.5 0v2.25M6.5 10.5h11v9.25h-11z';
        case 'none':
          return '';
        case 'search':
        default:
          return 'M10.75 17.25a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20.25 20.25';
      }
    },
    get rightIconPath() {
      switch (props.rightIcon) {
        case 'info':
          return 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM12 11.25v5.5M12 7.75v.5';
        case 'search':
          return 'M10.75 17.25a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20.25 20.25';
        case 'user':
          return 'M12 11.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM4.5 20.25c0-3.05 3.36-5.5 7.5-5.5s7.5 2.45 7.5 5.5';
        case 'none':
          return '';
        case 'check':
        default:
          return 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM8 12l2.75 2.75L16.5 9.25';
      }
    },
    handleInput(rawValue) {
      if (state.isDisabled) {
        return;
      }
      state.internalValue = rawValue;
      if (props.onValueChange) {
        props.onValueChange(rawValue);
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.labelText !== ''}>
        <label
          for={props.id}
          class="flex items-center gap-2 text-sm font-medium text-components-input-text-color-label-foreground-default"
        >
          {props.labelText}
          <Show when={props.showRequired}>
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
          'flex h-9 w-full items-center gap-2.5 rounded-rounded-lg border px-3 py-1 transition-colors',
          state.containerClasses,
          state.isDisabled && 'opacity-50'
        )}
      >
        <Show when={props.showLeftIcon && state.leftIconPath !== ''}>
          <svg
            aria-hidden="true"
            focusable="false"
            class={cn('h-4 w-4 shrink-0', state.leftIconClasses)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d={state.leftIconPath} />
          </svg>
        </Show>

        <input
          id={props.id}
          name={props.name}
          type={props.type}
          value={state.currentValue}
          placeholder={props.placeholderText}
          maxLength={props.maxLength}
          autoComplete={props.autoComplete}
          disabled={state.isDisabled}
          required={props.required}
          aria-invalid={state.hasError}
          aria-required={props.required}
          aria-describedby={state.describedBy}
          class="h-full w-full min-w-0 bg-transparent text-sm text-foreground-default outline-none placeholder:text-components-input-text-color-placeholder-foreground-default disabled:cursor-not-allowed"
          onInput={(event) => state.handleInput(event.target.value)}
        />

        <Show when={props.showRightIcon && state.rightIconPath !== ''}>
          <svg
            aria-hidden="true"
            focusable="false"
            class={cn('h-4 w-4 shrink-0', state.rightIconClasses)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d={state.rightIconPath} />
          </svg>
        </Show>
      </div>

      <Show when={state.hasSupportingText || state.hasCount}>
        <div class="flex items-start justify-between gap-2.5">
          <Show when={state.hasSupportingText}>
            <span
              id={props.id + '-hint'}
              class={cn('text-xs leading-normal', state.supportingClasses)}
            >
              {props.hintErrorText}
            </span>
          </Show>
          <Show when={state.hasCount}>
            <span
              id={props.id + '-count'}
              class={cn('ml-auto shrink-0 text-xs leading-normal', state.countClasses)}
            >
              {state.countText}
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
}
