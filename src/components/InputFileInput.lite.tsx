import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputFileInputProps {
  labelText?: string;
  buttonText?: string;
  fileName?: string;
  hintErrorText?: string;
  showRequired?: boolean;
  showHint?: boolean;
  showLabel?: boolean;
  state?: 'Default' | 'Focus' | 'Filled' | 'Error' | 'Disabled';
  accept?: string;
  previewSrc?: string;
  fileMeta?: string;
  removeLabel?: string;
  className?: string;
  onChange?: (fileName: string) => void;
  onRemove?: () => void;
}

export default function InputFileInput(props: InputFileInputProps) {
  useDefaultProps({
    labelText: 'Picture',
    buttonText: 'Choose File',
    fileName: 'No file chosen',
    hintErrorText: 'Supported formats: PNG, JPG, or PDF.',
    showRequired: false,
    showHint: true,
    showLabel: true,
    state: 'Default',
    accept: '',
    previewSrc: '',
    fileMeta: '',
    removeLabel: 'Remove',
    className: '',
  });

  const state = useStore({
    selectedFileName: '',
    get isDefaultState() {
      return props.state === 'Default';
    },
    get isDisabled() {
      return props.state === 'Disabled';
    },
    get isError() {
      return props.state === 'Error';
    },
    get isFilled() {
      return props.state === 'Filled';
    },
    get isForcedFocus() {
      return props.state === 'Focus';
    },
    get displayFileName() {
      return state.selectedFileName !== '' ? state.selectedFileName : props.fileName;
    },
    get showRemoveButton() {
      return state.isFilled && props.onRemove !== undefined;
    },
    get containerClasses() {
      const base =
        'flex w-full items-center gap-2-5 rounded-lg border bg-background-default px-3 py-1 transition-colors';
      if (state.isDisabled) {
        return cn(base, 'border-border-default opacity-50');
      }
      if (state.isError) {
        return cn(
          base,
          'border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error'
        );
      }
      if (state.isForcedFocus) {
        return cn(base, 'border-primary-default ring-2 ring-focus-ring-primary');
      }
      return cn(
        base,
        'border-border-default hover:border-primary-default focus-within:border-primary-default focus-within:ring-2 focus-within:ring-focus-ring-primary'
      );
    },
    get chipClasses() {
      const base =
        'inline-flex shrink-0 cursor-pointer items-center gap-1-5 rounded-md px-2 py-0-75 text-sm font-medium leading-5 transition-colors focus-within:ring-2 focus-within:ring-focus-ring-primary';
      if (state.isDisabled) {
        return cn(base, 'cursor-not-allowed bg-background-muted text-foreground-default');
      }
      if (state.isFilled) {
        return cn(base, 'bg-primary-default text-primary-foreground hover:bg-primary-hover');
      }
      return cn(base, 'bg-background-muted text-foreground-default hover:bg-background-interactive');
    },
    get fileNameClasses() {
      const base = 'min-w-0 flex-1 truncate text-sm leading-5';
      if (state.isDefaultState || state.isDisabled) {
        return cn(base, 'text-foreground-muted');
      }
      return cn(base, 'text-foreground-base');
    },
    get hintClasses() {
      return cn(
        'text-xs leading-4',
        state.isError ? 'text-destructive-foreground' : 'text-foreground-muted'
      );
    },
    get removeButtonClasses() {
      return 'ml-0-5 inline-flex shrink-0 items-center justify-center rounded-md p-1 text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary';
    },
    handleChange(event) {
      const input = event.target as HTMLInputElement;
      const files = input.files;
      const nextName = files !== null && files.length > 0 ? files[0].name : '';
      state.selectedFileName = nextName;
      if (props.onChange !== undefined) {
        props.onChange(nextName);
      }
    },
    handleRemove() {
      state.selectedFileName = '';
      if (props.onRemove !== undefined) {
        props.onRemove();
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col items-start justify-start gap-3', props.className)}>
      <Show when={props.showLabel}>
        <div class="flex flex-row items-center gap-2">
          <span class="text-sm font-medium leading-5 text-foreground-default">
            {props.labelText}
          </span>
          <Show when={props.showRequired}>
            <span class="text-sm leading-5 text-destructive-foreground" aria-hidden="true">
              *
            </span>
          </Show>
        </div>
      </Show>

      <div class={state.containerClasses}>
        <Show when={state.isFilled}>
          <span class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-default bg-background-muted">
            <Show
              when={props.previewSrc !== ''}
              else={
                <svg
                  class="h-4 w-4 fill-none stroke-foreground-muted"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.25 3.75H7.5a2.25 2.25 0 0 0-2.25 2.25v12a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V8.25L14.25 3.75Z"
                  />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 3.75v4.5h4.5" />
                </svg>
              }
            >
              <img src={props.previewSrc} alt="" class="h-full w-full object-cover" />
            </Show>
          </span>
        </Show>

        <label class={state.chipClasses}>
          <span>{props.buttonText}</span>
          <input
            type="file"
            class="sr-only"
            aria-label={props.labelText}
            aria-invalid={state.isError}
            accept={props.accept}
            disabled={state.isDisabled}
            onChange={(event) => state.handleChange(event)}
          />
        </label>

        <span class={state.fileNameClasses} aria-live="polite">
          {state.displayFileName}
        </span>

        <Show when={state.showRemoveButton}>
          <button
            type="button"
            class={state.removeButtonClasses}
            aria-label={props.removeLabel}
            onClick={() => state.handleRemove()}
          >
            <svg
              class="h-4 w-4 fill-none stroke-foreground-muted"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </Show>
      </div>

      <Show when={state.isFilled && props.fileMeta !== ''}>
        <span class="text-xs leading-4 text-foreground-muted">{props.fileMeta}</span>
      </Show>

      <Show when={props.showHint && props.hintErrorText !== ''}>
        <span class={state.hintClasses}>{props.hintErrorText}</span>
      </Show>
    </div>
  );
}
