import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export type InputMultipleFileUploadState =
  | 'Default'
  | 'Focus'
  | 'Filled'
  | 'Error'
  | 'Disabled';

export interface InputMultipleFileUploadFile {
  id?: string;
  name: string;
  status?: string;
}

export interface InputMultipleFileUploadProps {
  id?: string;
  labelText?: string;
  hintErrorText?: string;
  showLabel?: boolean;
  showRequired?: boolean;
  showHint?: boolean;
  instruction?: string;
  fileCount?: string;
  file1Name?: string;
  file1Status?: string;
  file2Name?: string;
  file2Status?: string;
  files?: InputMultipleFileUploadFile[];
  useFileListSlot?: boolean;
  visualState?: InputMultipleFileUploadState;
  className?: string;
  children?: any;
  onBrowse?: () => void;
  onRemoveFile?: (file: InputMultipleFileUploadFile, index: number) => void;
  onRetryFile?: (file: InputMultipleFileUploadFile, index: number) => void;
}

export default function InputMultipleFileUpload(props: InputMultipleFileUploadProps) {
  useDefaultProps({
    id: 'multiple-file-upload',
    labelText: 'Attachments',
    hintErrorText: 'Up to 5 files, 10 MB each.',
    showLabel: true,
    showRequired: true,
    showHint: true,
    instruction: 'Choose one or more files',
    fileCount: '0 of 5',
    file1Name: 'brand-guidelines.pdf',
    file1Status: 'Uploaded',
    file2Name: 'campaign-assets.zip',
    file2Status: 'Uploading · 64%',
    files: [],
    useFileListSlot: false,
    visualState: 'Default',
    className: '',
  });

  const state = useStore({
    get isDisabled() {
      return props.visualState === 'Disabled';
    },
    get labelId() {
      return props.id + '-label';
    },
    get hintId() {
      return props.id + '-hint';
    },
    get describedBy() {
      return props.showHint ? state.hintId : '';
    },
    get resolvedFiles() {
      const provided = props.files;
      const list: InputMultipleFileUploadFile[] = [];
      if (provided && provided.length > 0) {
        for (let i = 0; i < provided.length; i++) {
          const entry = provided[i];
          list.push({
            id: entry.id || 'file-' + i,
            name: entry.name,
            status: entry.status,
          });
        }
        return list;
      }
      if (props.file1Name) {
        list.push({ id: 'file-0', name: props.file1Name, status: props.file1Status });
      }
      if (props.file2Name) {
        list.push({ id: 'file-1', name: props.file2Name, status: props.file2Status });
      }
      return list;
    },
    get labelClasses() {
      return 'text-sm font-medium text-components-input-multiple-file-upload-color-label-foreground-default';
    },
    get requiredIndicatorClasses() {
      return 'text-sm font-medium text-components-input-multiple-file-upload-color-required-indicator-fill-default';
    },
    get containerClasses() {
      const base =
        'flex w-full flex-col items-stretch gap-3 rounded-md border bg-components-input-multiple-file-upload-color-container-background-default px-3 py-3';
      switch (props.visualState) {
        case 'Focus':
          return cn(
            base,
            'border-components-input-multiple-file-upload-color-container-border-focus ring-2 ring-focus-ring-primary'
          );
        case 'Error':
          return cn(
            base,
            'border-components-input-multiple-file-upload-color-container-border-error ring-2 ring-focus-ring-error'
          );
        case 'Disabled':
          return cn(
            base,
            'border-components-input-multiple-file-upload-color-container-border-disabled opacity-50'
          );
        case 'Filled':
          return cn(
            base,
            'border-components-input-multiple-file-upload-color-container-border-filled'
          );
        default:
          return cn(
            base,
            'border-components-input-multiple-file-upload-color-container-border-default'
          );
      }
    },
    get triggerClasses() {
      return [
        'flex w-full flex-row items-center justify-between gap-2 rounded-sm bg-ghost-default p-0 text-left',
        'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
      ].join(' ');
    },
    get instructionClasses() {
      return cn(
        'text-sm font-medium',
        'text-components-input-multiple-file-upload-color-instruction-text-default'
      );
    },
    get instructionFocusClasses() {
      return 'text-components-input-multiple-file-upload-color-instruction-text-focus';
    },
    get fileCountClasses() {
      return cn(
        'shrink-0 text-xs',
        'text-components-input-multiple-file-upload-color-file-count-text-default'
      );
    },
    get helperClasses() {
      return cn('text-xs', 'text-components-input-multiple-file-upload-color-helper-text-default');
    },
    get helperErrorClasses() {
      return 'text-components-input-multiple-file-upload-color-helper-text-error';
    },
    get fileListClasses() {
      return 'm-0 flex w-full list-none flex-col gap-2 p-0';
    },
    get fileRowClasses() {
      return cn(
        'flex w-full flex-row items-center justify-between gap-2 rounded-md border p-3',
        'border-components-input-multiple-file-upload-color-file-row-border-filled bg-components-input-multiple-file-upload-color-file-row-background-filled'
      );
    },
    get fileNameClasses() {
      return 'truncate text-sm font-medium text-components-input-multiple-file-upload-color-file-name-text-filled';
    },
    get fileStatusClasses() {
      return 'text-xs text-components-input-multiple-file-upload-color-status-text-filled';
    },
    get fileIconClasses() {
      return 'h-4 w-4 shrink-0 stroke-components-input-multiple-file-upload-color-file-icon-stroke-filled';
    },
    get completeIconClasses() {
      return 'h-4 w-4 shrink-0 stroke-components-input-multiple-file-upload-color-status-icon-stroke-filled';
    },
    get uploadingIconClasses() {
      return 'h-4 w-4 shrink-0 stroke-components-input-multiple-file-upload-color-loading-icon-stroke-filled';
    },
    get errorIconClasses() {
      return 'h-4 w-4 shrink-0 stroke-destructive-default';
    },
    get removeButtonClasses() {
      return [
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-ghost-default',
        'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
      ].join(' ');
    },
    get retryButtonClasses() {
      return [
        'shrink-0 rounded-sm bg-ghost-default px-1 text-xs font-medium',
        'text-primary-default hover:text-primary-hover',
        'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
      ].join(' ');
    },
    statusKind(file) {
      const value = (file.status || '').toLowerCase();
      if (value.indexOf('error') !== -1 || value.indexOf('fail') !== -1) {
        return 'error';
      }
      if (value.indexOf('%') !== -1 || value.indexOf('uploading') !== -1) {
        return 'uploading';
      }
      return 'complete';
    },
    handleBrowse() {
      if (state.isDisabled) {
        return;
      }
      if (props.onBrowse) {
        props.onBrowse();
      }
    },
    handleRemove(file, index) {
      if (state.isDisabled) {
        return;
      }
      if (props.onRemoveFile) {
        props.onRemoveFile(file, index);
      }
    },
    handleRetry(file, index) {
      if (state.isDisabled) {
        return;
      }
      if (props.onRetryFile) {
        props.onRetryFile(file, index);
      }
    },
  });

  return (
    <div
      class={cn(
        'flex flex-col items-start justify-start gap-4 rounded-md px-6 py-6',
        props.className
      )}
    >
      <div
        role="group"
        aria-labelledby={state.labelId}
        aria-describedby={state.describedBy}
        class="flex w-full flex-col items-stretch justify-start gap-3"
      >
        <Show when={props.showLabel}>
          <div class="flex flex-row items-center gap-1">
            <span id={state.labelId} class={state.labelClasses}>
              {props.labelText}
            </span>
            <Show when={props.showRequired}>
              <span aria-hidden="true" class={state.requiredIndicatorClasses}>
                *
              </span>
            </Show>
          </div>
        </Show>

        <div class={state.containerClasses}>
          <button
            type="button"
            class={state.triggerClasses}
            disabled={state.isDisabled}
            aria-describedby={state.describedBy}
            onClick={() => state.handleBrowse()}
          >
            <span
              class={cn(
                state.instructionClasses,
                props.visualState === 'Focus' ? state.instructionFocusClasses : ''
              )}
            >
              {props.instruction}
            </span>
            <span class={state.fileCountClasses}>{props.fileCount}</span>
          </button>

          <Show when={!props.useFileListSlot}>
            <Show when={state.resolvedFiles.length > 0}>
              <ul class={state.fileListClasses}>
                <For each={state.resolvedFiles}>
                  {(file, index) => (
                    <li key={file.id} class={state.fileRowClasses}>
                      <div class="flex min-w-0 flex-row items-center gap-2">
                        <svg
                          class={state.fileIconClasses}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                          <path d="M18 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2Z" />
                        </svg>
                        <div class="flex min-w-0 flex-col gap-1">
                          <span class={state.fileNameClasses}>{file.name}</span>
                          <Show when={file.status}>
                            <span class={state.fileStatusClasses}>{file.status}</span>
                          </Show>
                        </div>
                      </div>
                      <div class="flex shrink-0 flex-row items-center gap-1">
                        <Show when={state.statusKind(file) === 'uploading'}>
                          <svg
                            class={state.uploadingIconClasses}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke-width="2"
                            stroke-linecap="round"
                            aria-hidden="true"
                          >
                            <path d="M12 3a9 9 0 1 0 9 9" />
                          </svg>
                        </Show>
                        <Show when={state.statusKind(file) === 'error'}>
                          <svg
                            class={state.errorIconClasses}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8v4" />
                            <path d="M12 16h.01" />
                          </svg>
                          <Show when={props.onRetryFile}>
                            <button
                              type="button"
                              class={state.retryButtonClasses}
                              disabled={state.isDisabled}
                              onClick={() => state.handleRetry(file, index)}
                            >
                              Retry
                            </button>
                          </Show>
                        </Show>
                        <Show when={state.statusKind(file) === 'complete'}>
                          <svg
                            class={state.completeIconClasses}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="m8.5 12.5 2.5 2.5 4.5-5" />
                          </svg>
                        </Show>
                        <button
                          type="button"
                          class={state.removeButtonClasses}
                          disabled={state.isDisabled}
                          aria-label={'Remove ' + file.name}
                          onClick={() => state.handleRemove(file, index)}
                        >
                          <svg
                            class="h-4 w-4 stroke-foreground-muted"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </Show>

          {props.children}
        </div>

        <Show when={props.showHint}>
          <p
            id={state.hintId}
            class={cn(
              state.helperClasses,
              props.visualState === 'Error' ? state.helperErrorClasses : ''
            )}
          >
            {props.hintErrorText}
          </p>
        </Show>
      </div>
    </div>
  );
}
