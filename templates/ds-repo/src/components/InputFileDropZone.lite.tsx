import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getFileState, handleFileSelectEvent, ICON_PATHS, bindControllerProps } from './utils';

export interface InputFileDropZoneProps {
  id?: string;
  name?: string;
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
  onFilesChange?: (files: unknown[]) => void;
}

export default function InputFileDropZone(props: InputFileDropZoneProps) {
  useDefaultProps({
    id: 'file-drop-zone', name: 'drop-file', label: 'Documents',
    primaryText: 'or drag and drop files here', supportingText: 'PNG, JPG, or PDF up to 10 MB',
    browseText: 'Browse', fileName: '', fileMetadata: '', hint: 'You can upload one file.',
    errorMessage: '', accept: 'image/png,image/jpeg,application/pdf',
    disabled: false, required: false, showLabel: true, showHint: true, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <label for={props.id} class="flex items-center gap-1 text-sm font-medium text-foreground-default">
          {props.label}
          <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
        </label>
      </Show>
      <label
        for={props.id}
        class={cn(
          'flex flex-col items-center justify-center gap-3 rounded-lg border bg-background-default px-6 py-6 text-center shadow-sm transition-colors',
          getFileState(props).hasError
            ? 'border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error'
            : 'border-border-default border-dashed focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary',
          props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => !props.disabled && handleFileSelectEvent(event, props.onFileNameChange, props.onFilesChange)}
      >
        <svg aria-hidden="true" class="h-6 w-6 shrink-0 text-foreground-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.upload} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <Show when={!getFileState(props).hasFile}>
          <span class="flex flex-col items-center gap-1">
            <span class="inline-flex flex-wrap items-center justify-center gap-1.5 text-base text-foreground-default">
              <span class="inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground">{props.browseText}</span>
              <span>{props.primaryText}</span>
            </span>
            <span class="text-sm text-foreground-muted">{props.supportingText}</span>
          </span>
        </Show>
        <Show when={getFileState(props).hasFile}>
          <span class="flex flex-col items-center gap-1">
            <span class="text-sm font-medium text-foreground-default">{props.fileName}</span>
            <Show when={props.fileMetadata !== ''}><span class="text-xs text-foreground-muted">{props.fileMetadata}</span></Show>
          </span>
        </Show>
        <input id={props.id} name={props.name} type="file" accept={props.accept} disabled={props.disabled} required={props.required} aria-invalid={getFileState(props).hasError} aria-describedby={props.showHint ? props.id + '-hint' : undefined} class="sr-only" onChange={(event) => !props.disabled && handleFileSelectEvent(event, props.onFileNameChange, props.onFilesChange)} />
      </label>
      <Show when={props.showHint}>
        <span id={props.id + '-hint'} class={cn('text-sm', getFileState(props).hasError ? 'text-destructive-default' : 'text-foreground-muted')}>{getFileState(props).helpText}</span>
      </Show>
    </div>
  );
}
