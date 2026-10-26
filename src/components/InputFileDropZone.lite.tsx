import { Show, useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputFileDropZoneProps {
  labelText?: string;
  hintErrorText?: string;
  showLabel?: boolean;
  showRequired?: boolean;
  showHint?: boolean;
  primaryText?: string;
  supportingText?: string;
  browseLabel?: string;
  fileName?: string;
  fileMetadata?: string;
  state?: 'Default' | 'Focus' | 'Filled' | 'Error' | 'Disabled';
  accept?: string;
  multiple?: boolean;
  id?: string;
  className?: string;
  onFilesSelected?: (fileName: string, fileCount: number) => void;
  onRemove?: () => void;
  children?: any;
}

export default function InputFileDropZone(props: InputFileDropZoneProps) {
  useDefaultProps({
    labelText: 'Documents',
    hintErrorText: 'You can upload one file.',
    showLabel: true,
    showRequired: false,
    showHint: true,
    primaryText: 'Drag and drop files here, or',
    supportingText: 'PNG, JPG, or PDF up to 10 MB',
    browseLabel: 'Browse files',
    fileName: '',
    fileMetadata: '',
    state: 'Default',
    accept: '',
    multiple: false,
    id: 'file-drop-zone',
    className: '',
  });

  const state = useStore({
    isDragging: false,
    isFocused: false,
    selectedCount: 0,
    selectedName: '',
    selectedSize: 0,

    get inputId() {
      return props.id + '-input';
    },
    get labelId() {
      return props.id + '-label';
    },
    get hintId() {
      return props.id + '-hint';
    },
    get describedBy() {
      if (props.showHint && props.hintErrorText !== '') {
        return state.hintId;
      }
      return undefined;
    },
    get isDisabled() {
      return props.state === 'Disabled';
    },
    get isError() {
      return props.state === 'Error';
    },
    get isHighlighted() {
      return state.isFocused || state.isDragging || props.state === 'Focus';
    },
    get hasFile() {
      return state.selectedCount > 0 || props.state === 'Filled';
    },
    get displayName() {
      if (state.selectedCount > 1) {
        return state.selectedCount + ' files selected';
      }
      if (state.selectedName !== '') {
        return state.selectedName;
      }
      return props.fileName;
    },
    get displayMeta() {
      if (state.selectedCount > 1) {
        return '';
      }
      if (state.selectedName === '') {
        return props.fileMetadata;
      }
      if (state.selectedSize <= 0) {
        return '';
      }
      const bytes = state.selectedSize;
      let value = Math.round(bytes / 1024);
      let unit = 'KB';
      if (bytes >= 1048576) {
        value = Math.round((bytes / 1048576) * 10) / 10;
        unit = 'MB';
      }
      if (value < 1) {
        value = 1;
      }
      return value + ' ' + unit + ' \u00b7 Ready to upload';
    },
    get containerClasses() {
      if (state.isDisabled) {
        return 'cursor-not-allowed border-components-input-file-drop-zone-color-container-border-disabled bg-components-input-file-drop-zone-color-container-background-disabled opacity-50';
      }
      if (state.isError) {
        return cn(
          'border-components-input-file-drop-zone-color-container-border-error bg-components-input-file-drop-zone-color-container-background-error',
          state.isHighlighted ? 'ring-2 ring-focus-ring-error' : ''
        );
      }
      if (state.isHighlighted) {
        return 'border-components-input-file-drop-zone-color-container-border-focus bg-components-input-file-drop-zone-color-container-background-focus ring-2 ring-components-input-file-drop-zone-color-container-border-focus';
      }
      if (state.hasFile) {
        return 'border-components-input-file-drop-zone-color-container-border-filled bg-components-input-file-drop-zone-color-container-background-filled';
      }
      return 'cursor-pointer border-components-input-file-drop-zone-color-container-border-default bg-components-input-file-drop-zone-color-container-background-default hover:border-components-input-file-drop-zone-color-container-border-focus';
    },
    get labelClasses() {
      if (state.isDisabled) {
        return 'text-components-input-file-drop-zone-color-label-foreground-disabled';
      }
      if (state.isError) {
        return 'text-components-input-file-drop-zone-color-label-foreground-error';
      }
      return 'text-components-input-file-drop-zone-color-label-foreground-default';
    },
    get primaryTextClasses() {
      if (state.isDisabled) {
        return 'text-components-input-file-drop-zone-color-primary-text-foreground-disabled';
      }
      if (state.isError) {
        return 'text-components-input-file-drop-zone-color-primary-text-foreground-error';
      }
      return 'text-components-input-file-drop-zone-color-primary-text-foreground-default';
    },
    get supportingTextClasses() {
      if (state.isDisabled) {
        return 'text-components-input-file-drop-zone-color-supporting-text-foreground-disabled';
      }
      if (state.isError) {
        return 'text-components-input-file-drop-zone-color-supporting-text-foreground-error';
      }
      return 'text-components-input-file-drop-zone-color-supporting-text-foreground-default';
    },
    get hintClasses() {
      if (state.isDisabled) {
        return 'text-components-input-file-drop-zone-color-supporting-text-foreground-disabled';
      }
      if (state.isError) {
        return 'text-components-input-file-drop-zone-color-supporting-text-foreground-error';
      }
      return 'text-components-input-file-drop-zone-color-supporting-text-foreground-default';
    },
    get browseClasses() {
      if (state.isDisabled) {
        return 'text-components-input-file-drop-zone-color-primary-text-foreground-disabled';
      }
      return 'text-primary-default underline underline-offset-2';
    },

    applySelection(count, name, size) {
      state.selectedCount = count;
      state.selectedName = name;
      state.selectedSize = size;
      if (props.onFilesSelected) {
        props.onFilesSelected(name, count);
      }
    },
    handleInputChange(event) {
      const files = event && event.target ? event.target.files : null;
      if (!files || files.length === 0) {
        return;
      }
      const first = files[0];
      if (files.length > 1) {
        state.applySelection(files.length, '', 0);
        return;
      }
      state.applySelection(1, first && first.name ? first.name : '', first && first.size ? first.size : 0);
    },
    handleDrop(event) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      state.isDragging = false;
      if (state.isDisabled) {
        return;
      }
      const files = event && event.dataTransfer ? event.dataTransfer.files : null;
      if (!files || files.length === 0) {
        return;
      }
      const first = files[0];
      if (files.length > 1) {
        state.applySelection(files.length, '', 0);
        return;
      }
      state.applySelection(1, first && first.name ? first.name : '', first && first.size ? first.size : 0);
    },
    handleDragOver(event) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      if (state.isDisabled) {
        return;
      }
      state.isDragging = true;
    },
    handleDragLeave() {
      state.isDragging = false;
    },
    handleFocus() {
      state.isFocused = true;
    },
    handleBlur() {
      state.isFocused = false;
    },
    handleRemove() {
      state.selectedCount = 0;
      state.selectedName = '';
      state.selectedSize = 0;
      if (props.onRemove) {
        props.onRemove();
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col items-start gap-4 font-sans', props.className)}>
      <Show when={props.showLabel}>
        <div class="flex w-full flex-wrap items-center gap-1">
          <label id={state.labelId} for={state.inputId} class={cn('text-sm font-medium', state.labelClasses)}>
            {props.labelText}
          </label>
          <Show when={props.showRequired}>
            <span
              class="text-sm font-medium text-components-input-file-drop-zone-color-required-indicator-foreground-default"
              aria-hidden="true"
            >
              *
            </span>
          </Show>
        </div>
      </Show>

      <div
        role="group"
        aria-labelledby={state.labelId}
        class={cn(
          'relative flex w-full flex-col items-center justify-center gap-3 rounded-md border px-6 py-6 transition-colors',
          state.containerClasses
        )}
        onDragOver={(event) => state.handleDragOver(event)}
        onDragLeave={() => state.handleDragLeave()}
        onDrop={(event) => state.handleDrop(event)}
      >
        <input
          id={state.inputId}
          type="file"
          class="sr-only"
          disabled={state.isDisabled}
          required={props.showRequired}
          accept={props.accept}
          multiple={props.multiple}
          aria-describedby={state.describedBy}
          onFocus={() => state.handleFocus()}
          onBlur={() => state.handleBlur()}
          onChange={(event) => state.handleInputChange(event)}
        />

        <Show
          when={state.hasFile}
          else={
            <label
              for={state.inputId}
              class={cn(
                'flex w-full flex-col items-center justify-center gap-2 text-center',
                state.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              <svg
                class="h-6 w-6 shrink-0 stroke-components-input-file-drop-zone-color-vector-stroke-default"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 7.5 12 3m0 0L7.5 7.5M12 3v13.5" />
              </svg>
              <span class="flex flex-col items-center gap-1">
                <span class={cn('text-sm font-medium', state.primaryTextClasses)}>
                  {props.primaryText}{' '}
                  <span class={cn('font-medium', state.browseClasses)}>{props.browseLabel}</span>
                </span>
                <Show when={props.supportingText !== ''}>
                  <span class={cn('text-xs', state.supportingTextClasses)}>{props.supportingText}</span>
                </Show>
              </span>
            </label>
          }
        >
          <div class="flex w-full flex-wrap items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background-muted">
              <svg
                class="h-5 w-5 stroke-components-input-file-drop-zone-color-vector-stroke-filled"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </span>

            <span class="flex min-w-0 flex-1 flex-col gap-1">
              <span class="truncate text-sm font-medium text-components-input-file-drop-zone-color-file-name-foreground-filled">
                {state.displayName}
              </span>
              <Show when={state.displayMeta !== ''}>
                <span class="text-xs text-components-input-file-drop-zone-color-file-metadata-foreground-filled">
                  {state.displayMeta}
                </span>
              </Show>
            </span>

            <span class="flex shrink-0 items-center gap-2">
              <label
                for={state.inputId}
                class={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  state.browseClasses,
                  state.isDisabled ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:text-primary-hover'
                )}
              >
                Replace
              </label>
              <button
                type="button"
                disabled={state.isDisabled}
                class="rounded-md border border-components-input-file-drop-zone-color-container-border-default px-3 py-1 text-xs font-medium text-foreground-default transition-colors hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => state.handleRemove()}
              >
                Remove
              </button>
            </span>
          </div>
        </Show>
      </div>

      <Show when={props.showHint && props.hintErrorText !== ''}>
        <p id={state.hintId} class={cn('text-xs', state.hintClasses)}>
          {props.hintErrorText}
        </p>
      </Show>

      {props.children}
    </div>
  );
}
