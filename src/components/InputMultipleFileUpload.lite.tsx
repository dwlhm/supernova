import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getFileState, handleFileSelectEvent, ICON_PATHS, bindControllerProps } from './utils';

export interface UploadedFile { id: string; name: string; status: string; }

export interface InputMultipleFileUploadProps {
  id?: string;
  name?: string;
  label?: string;
  instruction?: string;
  browseText?: string;
  files?: UploadedFile[];
  fileCount?: string;
  hint?: string;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onRemove?: (id: string) => void;
  onFilesChange?: (files: unknown[]) => void;
}

export default function InputMultipleFileUpload(props: InputMultipleFileUploadProps) {
  useDefaultProps({
    id: 'multiple-file-upload', name: 'files', label: 'Attachments', instruction: 'Choose one or more files',
    browseText: 'Browse', files: [], fileCount: '0 of 5', hint: 'Up to 5 files, 10 MB each.', errorMessage: '',
    accept: 'image/png,image/jpeg,application/pdf,application/zip',
    disabled: false, required: true, showLabel: true, showHint: true, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <span class="flex items-center justify-between gap-3">
          <label for={props.id} class="flex items-center gap-1 text-sm font-medium text-foreground-default">
            {props.label}
            <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
          </label>
          <span class="text-sm text-foreground-muted">{props.fileCount}</span>
        </span>
      </Show>
      <label
        for={props.id}
        class={cn(
          'flex h-[52px] w-full items-center gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors',
          getFileState(props).hasError ? 'border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error' : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary',
          props.disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
      >
        <span class="flex-1 truncate text-base text-foreground-muted">{props.instruction}</span>
        <span class="inline-flex shrink-0 items-center justify-center rounded-lg bg-secondary-default px-3 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover">{props.browseText}</span>
        <input id={props.id} name={props.name} type="file" multiple accept={props.accept} disabled={props.disabled} required={props.required} aria-invalid={getFileState(props).hasError} class="sr-only" onChange={(event) => !props.disabled && handleFileSelectEvent(event, undefined, props.onFilesChange)} />
      </label>
      <Show when={getFileState(props).files.length > 0}>
        <ul class="flex flex-col gap-2">
          <For each={getFileState(props).files}>
            {(file) => (
              <li key={file.id} class="flex items-center justify-between gap-2 rounded-md border border-border-default bg-background-subtle p-3">
                <span class="flex min-w-0 items-center gap-2">
                  <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.file} stroke-linecap="round" stroke-linejoin="round" /></svg>
                  <span class="flex min-w-0 flex-col"><span class="truncate text-sm font-medium text-foreground-default">{file.name}</span><span class="truncate text-xs text-foreground-muted">{file.status}</span></span>
                </span>
                <button type="button" disabled={props.disabled} aria-label={'Remove ' + file.name} class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => !props.disabled && props.onRemove && props.onRemove(file.id)}>
                  <svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d={ICON_PATHS.close} stroke-linecap="round" /></svg>
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <Show when={props.showHint}>
        <span id={props.id + '-hint'} class={cn('text-sm', getFileState(props).hasError ? 'text-destructive-default' : 'text-foreground-muted')}>{getFileState(props).helpText}</span>
      </Show>
    </div>
  );
}
