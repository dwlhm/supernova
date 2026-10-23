import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputImageUploaderProps {
  id?: string;
  label?: string;
  primaryText?: string;
  supportingText?: string;
  fileName?: string;
  fileMetadata?: string;
  imageSrc?: string;
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

export default function InputImageUploader(props: InputImageUploaderProps) {
  useDefaultProps({
    id: 'image-uploader',
    label: 'Profile image',
    primaryText: 'Upload an image',
    supportingText: 'Square JPG or PNG, up to 5 MB',
    fileName: '',
    fileMetadata: '',
    imageSrc: '',
    hint: 'For best results, use a 1:1 image.',
    errorMessage: '',
    accept: 'image/png,image/jpeg',
    disabled: false,
    required: true,
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
        return 'border-components-input-image-uploader-color-container-border-error';
      }
      return 'border-components-input-image-uploader-color-container-border-default focus-within:border-components-input-image-uploader-color-container-border-focus';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-input-image-uploader-color-helper-text-foreground-error'
        : 'text-components-input-image-uploader-color-helper-text-foreground-default';
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
        <span class="flex items-center gap-1 text-sm font-medium text-components-input-image-uploader-color-label-foreground-default">
          {props.label}
          <Show when={props.required}>
            <span
              aria-hidden="true"
              class="text-components-input-image-uploader-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </span>
      </Show>
      <div
        class={cn(
          'flex items-center gap-4 rounded-rounded-lg border bg-components-input-image-uploader-color-container-background-default p-3 transition-colors',
          state.containerClasses,
          props.disabled && 'opacity-50'
        )}
      >
        <span
          class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-rounded-lg bg-components-input-image-uploader-color-preview-background-default"
          aria-hidden="true"
        >
          <Show when={props.imageSrc !== ''}>
            <img src={props.imageSrc} alt="" class="h-full w-full object-cover" />
          </Show>
          <Show when={props.imageSrc === ''}>
            <svg
              class="h-8 w-8 text-components-input-image-uploader-color-icon-fill-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m21 15-5-5L5 21" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          </Show>
        </span>
        <span class="flex min-w-0 flex-1 flex-col gap-2">
          <span class="truncate text-sm font-medium text-components-input-image-uploader-color-primary-text-foreground-default">
            {state.hasFile ? props.fileName : props.primaryText}
          </span>
          <span class="truncate text-xs text-components-input-image-uploader-color-supporting-text-foreground-default">
            {state.hasFile && props.fileMetadata !== '' ? props.fileMetadata : props.supportingText}
          </span>
          <span class="flex items-center gap-2">
            <label class="inline-flex cursor-pointer items-center rounded-rounded-sm border border-components-input-image-uploader-color-container-border-default bg-components-input-image-uploader-color-container-background-default px-3 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default focus-within:ring-2 focus-within:ring-focus-ring-primary">
              {state.hasFile ? 'Replace' : 'Browse'}
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
                    event.target.files && event.target.files.length > 0
                      ? event.target.files[0].name
                      : ''
                  )
                }
              />
            </label>
            <Show when={state.hasFile}>
              <button
                type="button"
                class="inline-flex items-center rounded-rounded-sm px-2 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                onClick={() => state.clear()}
              >
                Remove
              </button>
            </Show>
          </span>
        </span>
      </div>
      <Show when={props.showHint}>
        <span class={cn('text-xs', state.supportingClasses)}>{state.supportingText}</span>
      </Show>
    </div>
  );
}
