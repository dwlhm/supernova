import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputFileDropZoneProps {
  id?: string;
  label?: string;
  primaryText?: string;
  supportingText?: string;
  browseText?: string;
  fileName?: string;
  fileMetadata?: string;
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

export default function InputFileDropZone(props: InputFileDropZoneProps) {
  useDefaultProps({
    id: 'file-drop-zone',
    label: 'Documents',
    primaryText: 'Drag and drop files here, or',
    supportingText: 'PNG, JPG, or PDF up to 10 MB',
    browseText: 'browse',
    fileName: '',
    fileMetadata: '',
    hint: 'You can upload one file.',
    errorMessage: '',
    accept: 'image/png,image/jpeg,application/pdf',
    disabled: false,
    required: false,
    showLabel: true,
    showHint: true,
    className: '',
  });

  const state = useStore({
    isDragging: false,
    get hasError() {
      return props.errorMessage !== '';
    },
    get hasFile() {
      return props.fileName !== '';
    },
    get containerClasses() {
      if (state.hasError) {
        return 'border-components-input-file-drop-zone-color-container-border-error';
      }
      if (state.isDragging) {
        return 'border-components-input-file-drop-zone-color-container-border-focus bg-background-subtle';
      }
      return 'border-components-input-file-drop-zone-color-container-border-default border-dashed';
    },
    get supportingText() {
      return state.hasError ? props.errorMessage : props.hint;
    },
    get supportingClasses() {
      return state.hasError
        ? 'text-components-input-file-drop-zone-color-supporting-text-foreground-error'
        : 'text-components-input-file-drop-zone-color-supporting-text-foreground-default';
    },
    setDragging(value: boolean) {
      state.isDragging = value;
    },
    setName(fileName: string) {
      if (props.onFileNameChange) {
        props.onFileNameChange(fileName);
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex items-center gap-1 text-sm font-medium text-components-input-file-drop-zone-color-label-foreground-default">
          {props.label}
          <Show when={props.required}>
            <span
              aria-hidden="true"
              class="text-components-input-file-drop-zone-color-required-indicator-foreground-default"
            >
              *
            </span>
          </Show>
        </span>
      </Show>
      <label
        class={cn(
          'flex flex-col items-center justify-center gap-4 rounded-rounded-lg border bg-components-input-file-drop-zone-color-container-background-default px-6 py-6 text-center transition-colors',
          state.containerClasses,
          props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
        onDragEnter={() => state.setDragging(true)}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => state.setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          state.setDragging(false);
          state.setName(
            event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0
              ? event.dataTransfer.files[0].name
              : ''
          );
        }}
      >
        <svg
          aria-hidden="true"
          class="h-6 w-6 shrink-0 text-components-input-file-drop-zone-color-vector-stroke-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M12 16V4m0 0L8 8m4-4 4 4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke-linecap="round" />
        </svg>
        <Show when={!state.hasFile}>
          <span class="flex flex-col items-center gap-1">
            <span class="text-sm text-components-input-file-drop-zone-color-primary-text-foreground-default">
              {props.primaryText}{' '}
              <span class="font-medium underline underline-offset-2">{props.browseText}</span>
            </span>
            <span class="text-xs text-components-input-file-drop-zone-color-supporting-text-foreground-default">
              {props.supportingText}
            </span>
          </span>
        </Show>
        <Show when={state.hasFile}>
          <span class="flex flex-col items-center gap-1">
            <span class="text-sm font-medium text-components-input-file-drop-zone-color-file-name-foreground-filled">
              {props.fileName}
            </span>
            <Show when={props.fileMetadata !== ''}>
              <span class="text-xs text-components-input-file-drop-zone-color-file-metadata-foreground-filled">
                {props.fileMetadata}
              </span>
            </Show>
          </span>
        </Show>
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
      </label>
      <Show when={props.showHint}>
        <span class={cn('text-xs', state.supportingClasses)}>{state.supportingText}</span>
      </Show>
    </div>
  );
}
