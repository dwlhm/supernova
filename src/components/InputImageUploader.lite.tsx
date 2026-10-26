import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ImageUploaderFileInfo {
  name: string;
  size: number;
  type: string;
}

export interface InputImageUploaderProps {
  id?: string;
  labelText?: string;
  hintErrorText?: string;
  showRequired?: boolean;
  showHint?: boolean;
  showLabel?: boolean;
  primaryText?: string;
  supportingText?: string;
  fileName?: string;
  fileMetadata?: string;
  imageSrc?: string;
  accept?: string;
  state?: 'Default' | 'Focus' | 'Filled' | 'Error' | 'Disabled';
  disabled?: boolean;
  className?: string;
  onFileSelect?: (file: ImageUploaderFileInfo) => void;
  onRemove?: () => void;
}

export default function InputImageUploader(props: InputImageUploaderProps) {
  useDefaultProps({
    id: 'image-uploader',
    labelText: 'Profile image',
    hintErrorText: 'For best results, use a 1:1 image.',
    showRequired: true,
    showHint: true,
    showLabel: true,
    primaryText: 'Upload an image',
    supportingText: 'Square JPG or PNG, up to 5 MB',
    fileName: 'profile-photo.jpg',
    fileMetadata: '1200 × 1200 · 1.8 MB',
    imageSrc: '',
    accept: 'image/png,image/jpeg',
    state: 'Default',
    disabled: false,
    className: '',
  });

  const state = useStore({
    isDragging: false,
    pickedName: '',
    pickedMetadata: '',
    wasRemoved: false,
    get isDisabled() {
      return props.disabled === true || props.state === 'Disabled';
    },
    get isError() {
      return props.state === 'Error';
    },
    get isLabelVisible() {
      return (props.showLabel ?? true) && (props.labelText ?? '') !== '';
    },
    get hasSelection() {
      if (state.wasRemoved) {
        return false;
      }
      return state.pickedName !== '' || props.state === 'Filled';
    },
    get displayFileName() {
      return state.pickedName !== '' ? state.pickedName : props.fileName;
    },
    get displayMetadata() {
      return state.pickedMetadata !== '' ? state.pickedMetadata : props.fileMetadata;
    },
    get previewSource() {
      return props.imageSrc ?? '';
    },
    get labelId() {
      return props.id + '-label';
    },
    get hintId() {
      return props.id + '-hint';
    },
    get containerClasses() {
      const base =
        'bg-components-input-image-uploader-color-container-background-default rounded-components-input-image-uploader-radius-container-radius-default';
      if (state.isDisabled) {
        return cn(
          base,
          'border-components-input-image-uploader-color-container-border-default opacity-50'
        );
      }
      if (state.isError) {
        return cn(base, 'border-components-input-image-uploader-color-container-border-error');
      }
      if (props.state === 'Focus' || state.isDragging) {
        return cn(
          base,
          'border-components-input-image-uploader-color-container-border-focus bg-background-subtle'
        );
      }
      return cn(base, 'border-components-input-image-uploader-color-container-border-default');
    },
    get dropZoneClasses() {
      return cn(
        'flex w-full flex-col items-center justify-center gap-3 px-4 py-6 text-center transition-colors',
        state.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      );
    },
    get helperClasses() {
      return state.isError
        ? 'text-components-input-image-uploader-color-helper-text-foreground-error'
        : 'text-components-input-image-uploader-color-helper-text-foreground-default';
    },
    get supportingTextClasses() {
      return state.isError
        ? 'text-components-input-image-uploader-color-supporting-text-foreground-error'
        : 'text-components-input-image-uploader-color-supporting-text-foreground-default';
    },
    get primaryTextClasses() {
      return state.isError
        ? 'text-components-input-image-uploader-color-primary-text-foreground-error'
        : 'text-components-input-image-uploader-color-primary-text-foreground-default';
    },
    formatSize(bytes) {
      if (bytes <= 0) {
        return '';
      }
      const inMb = bytes / (1024 * 1024);
      if (inMb >= 1) {
        return Math.round(inMb * 10) / 10 + ' MB';
      }
      return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    },
    setDragging(value) {
      state.isDragging = value;
    },
    handleFile(file) {
      if (state.isDisabled || !file) {
        return;
      }
      state.pickedName = file.name;
      state.pickedMetadata = state.formatSize(file.size);
      state.wasRemoved = false;
      if (props.onFileSelect) {
        props.onFileSelect(file);
      }
    },
    handleRemove() {
      if (state.isDisabled) {
        return;
      }
      state.pickedName = '';
      state.pickedMetadata = '';
      state.wasRemoved = true;
      if (props.onRemove) {
        props.onRemove();
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col justify-start items-start gap-3', props.className)}>
      <Show when={state.isLabelVisible}>
        <span
          id={state.labelId}
          class="flex items-center gap-1 text-sm font-medium text-components-input-image-uploader-color-label-foreground-default"
        >
          {props.labelText}
          <Show when={props.showRequired}>
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
        class={cn('flex w-full flex-col gap-4 border p-3', state.containerClasses)}
        onDragEnter={() => state.setDragging(true)}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => state.setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          state.setDragging(false);
          const droppedFiles = event.dataTransfer ? event.dataTransfer.files : null;
          state.handleFile(droppedFiles && droppedFiles.length > 0 ? droppedFiles[0] : null);
        }}
      >
        <input
          id={props.id}
          type="file"
          accept={props.accept}
          disabled={state.isDisabled}
          aria-invalid={state.isError}
          aria-labelledby={state.isLabelVisible ? state.labelId : undefined}
          aria-describedby={props.showHint ? state.hintId : undefined}
          class="sr-only"
          onChange={(event) => {
            const selectedFiles = event.target.files;
            state.handleFile(selectedFiles && selectedFiles.length > 0 ? selectedFiles[0] : null);
          }}
        />

        <Show when={!state.hasSelection}>
          <label for={props.id} class={state.dropZoneClasses}>
            <svg
              aria-hidden="true"
              class="h-6 w-6 shrink-0 text-components-input-image-uploader-color-icon-stroke-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" stroke-linecap="round" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-4.5-4.5L7 20" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="flex flex-col items-center gap-1">
              <span class={cn('text-sm font-medium', state.primaryTextClasses)}>
                {props.primaryText}
              </span>
              <span class={cn('text-xs', state.supportingTextClasses)}>{props.supportingText}</span>
            </span>
          </label>
        </Show>

        <Show when={state.hasSelection}>
          <div class="flex w-full items-start gap-3">
            <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-rounded-md bg-components-input-image-uploader-color-preview-background-default">
              <Show when={state.previewSource !== ''}>
                <img
                  src={state.previewSource}
                  alt={state.displayFileName}
                  class="h-full w-full object-cover"
                />
              </Show>
              <Show when={state.previewSource === ''}>
                <svg
                  aria-hidden="true"
                  class="h-6 w-6 shrink-0 text-components-input-image-uploader-color-icon-stroke-default"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-linecap="round" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-4.5-4.5L7 20" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </Show>
            </div>

            <div class="flex min-w-0 flex-1 flex-col gap-2.5">
              <div class="flex min-w-0 flex-col gap-1">
                <span class="truncate text-sm font-medium text-components-input-image-uploader-color-primary-text-foreground-filled">
                  {state.displayFileName}
                </span>
                <Show when={state.displayMetadata !== ''}>
                  <span class={cn('truncate text-xs', state.supportingTextClasses)}>
                    {state.displayMetadata}
                  </span>
                </Show>
              </div>

              <div class="flex items-center gap-2">
                <label
                  for={props.id}
                  class={cn(
                    'rounded-rounded-sm px-2 py-1 text-xs font-medium hover:bg-background-muted focus-within:ring-2 focus-within:ring-focus-ring-primary',
                    'text-components-input-image-uploader-color-label-foreground-default',
                    state.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  )}
                >
                  Replace
                </label>
                <button
                  type="button"
                  disabled={state.isDisabled}
                  class="rounded-rounded-sm px-2 py-1 text-xs font-medium text-destructive-default hover:bg-destructive-subtle hover:text-destructive-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => state.handleRemove()}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </Show>
      </div>

      <Show when={props.showHint}>
        <span id={state.hintId} class={cn('text-xs', state.helperClasses)}>
          {props.hintErrorText}
        </span>
      </Show>
    </div>
  );
}
