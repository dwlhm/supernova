import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputFileInputProps {
  id?: string;
  label?: string;
  buttonText?: string;
  fileName?: string;
  hint?: string;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onFileNameChange?: (fileName: string) => void;
}

export default function InputFileInput(props: InputFileInputProps) {
  useDefaultProps({
    id: 'input-file',
    label: 'Picture',
    buttonText: 'Choose File',
    fileName: '',
    hint: 'Supported formats: PNG, JPG, or PDF.',
    errorMessage: '',
    accept: 'image/png,image/jpeg,application/pdf',
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
    get hasFile() {
      return props.fileName !== '';
    },
    get containerClasses() {
      if (state.hasError) {
        return 'border-components-input-file-input-color-container-border-error';
      }
      return 'border-components-input-file-input-color-container-border-default focus-within:border-components-input-file-input-color-container-border-focus';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-input-file-input-color-supporting-text-foreground-error'
        : 'text-components-input-file-input-color-supporting-text-foreground-default';
    },
    get displayName() {
      return state.hasFile ? props.fileName : 'No file chosen';
    },
    setName(fileName: string) {
      if (props.onFileNameChange) {
        props.onFileNameChange(fileName);
      }
    },
    clear() {
      state.setName('');
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex items-center gap-1 text-sm font-medium text-components-input-file-input-color-label-foreground-default">
          {props.label}
          <Show when={props.required}>
            <span
              aria-hidden="true"
              class="text-components-input-file-input-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </span>
      </Show>
      <label
        class={cn(
          'flex items-center gap-2.5 rounded-rounded-lg border bg-components-input-file-input-color-container-background-default px-3 py-1 transition-colors',
          state.containerClasses,
          props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
      >
        <span class="inline-flex h-7 shrink-0 items-center rounded-rounded-sm bg-components-button-secondary-color-container-background-default px-3 text-xs font-medium text-components-input-file-input-color-button-label-foreground-default">
          {props.buttonText}
        </span>
        <span
          class={cn(
            'truncate py-1 text-sm',
            state.hasFile
              ? 'text-components-input-file-input-color-file-name-foreground-filled'
              : 'text-components-input-file-input-color-file-name-foreground-default'
          )}
        >
          {state.displayName}
        </span>
        <input
          id={props.id}
          type="file"
          accept={props.accept}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={state.hasError}
          class="sr-only"
          onChange={(event) =>
            state.setName(
              event.target.files && event.target.files.length > 0 ? event.target.files[0].name : ''
            )
          }
        />
        <Show when={state.hasFile}>
          <button
            type="button"
            aria-label="Remove file"
            class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-input-file-input-color-file-name-foreground-filled hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            onClick={() => state.clear()}
          >
            <svg
              aria-hidden="true"
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
            </svg>
          </button>
        </Show>
      </label>
      <Show when={props.showHint}>
        <span class={cn('text-xs', state.supportingClasses)}>{state.supportingText}</span>
      </Show>
    </div>
  );
}
