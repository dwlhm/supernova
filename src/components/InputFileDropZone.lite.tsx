import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getFileState, handleFileSelectEvent, clearFileInputEvent, handleFileDragEnter, handleFileDragOver, handleFileDragLeave, handleFileDropEvent, ICON_PATHS, bindControllerProps } from './utils';

export interface InputFileDropZoneProps {
  id?: string; name?: string; label?: string; primaryText?: string; supportingText?: string;
  browseText?: string; replaceText?: string; removeText?: string; value?: string; fileName?: string; fileMetadata?: string;
  hint?: string | ((fileName: string) => string); error?: boolean; errorMessage?: string; validating?: boolean; accept?: string;
  icon?: any; state?: 'default' | 'focus' | 'filled' | 'error' | 'disabled'; isDragging?: boolean;
  disabled?: boolean; required?: boolean; showLabel?: boolean; showHint?: boolean; className?: string;
  onValueChange?: (value: string) => void; onFileNameChange?: (fileName: string) => void;
  onFilesChange?: (files: unknown[]) => void; onDragStateChange?: (isDragging: boolean) => void;
  onRemove?: () => void; onBlur?: (event: unknown) => void;
}

export default function InputFileDropZone(props: InputFileDropZoneProps) {
  useDefaultProps({
    id: 'file-drop-zone', name: 'drop-file', label: '', primaryText: 'Drag and drop files here, or',
    supportingText: '', browseText: 'Browse', replaceText: 'Replace', removeText: 'Remove',
    value: '', fileName: '', fileMetadata: '', hint: '', error: false, errorMessage: '', validating: false,
    accept: '', state: 'default', isDragging: false, disabled: false, required: false, showLabel: true, showHint: true, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-3', (props.disabled || props.state === 'disabled') && 'cursor-not-allowed opacity-50', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <label for={props.id} class="flex items-center gap-1 text-sm font-medium text-foreground-default">
          {props.label}
          <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
        </label>
      </Show>
      <label
        for={props.id}
        data-dragging={props.isDragging ? 'true' : undefined}
        class={cn(
          'group flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-background-default px-6 py-6 text-center shadow-sm transition-colors',
          'data-[dragging=true]:border-primary-default data-[dragging=true]:bg-primary-subtle data-[dragging=true]:ring-2 data-[dragging=true]:ring-focus-ring-primary',
          getFileState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : props.state === 'focus' ? 'border-primary-default ring-2 ring-focus-ring-primary' : 'border-border-default focus-within:border-primary-default focus-within:ring-2 focus-within:ring-focus-ring-primary',
          props.disabled || props.state === 'disabled' ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer'
        )}
        onDragEnter={(event) => !(props.disabled || props.state === 'disabled') && handleFileDragEnter(event, props.onDragStateChange)}
        onDragOver={(event) => !(props.disabled || props.state === 'disabled') && handleFileDragOver(event)}
        onDragLeave={(event) => !(props.disabled || props.state === 'disabled') && handleFileDragLeave(event, props.onDragStateChange)}
        onDrop={(event) => !(props.disabled || props.state === 'disabled') && handleFileDropEvent(event, props.onFileNameChange, props.onFilesChange, props.onDragStateChange)}
      >
        {props.icon}
        <Show when={!props.icon}>
          <svg aria-hidden="true" class="h-6 w-6 shrink-0 text-foreground-default transition-colors group-data-[dragging=true]:text-primary-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d={ICON_PATHS.upload} stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
        <Show when={!getFileState(props).hasFile && props.state !== 'filled'}>
          <span class="inline-flex flex-wrap items-center justify-center gap-1 text-sm font-medium text-foreground-default">
            <span>{props.primaryText}</span>
            <span class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground">{props.browseText}</span>
          </span>
          <Show when={props.supportingText !== ''}><span class="text-sm font-normal text-foreground-muted">{props.supportingText}</span></Show>
        </Show>
        <Show when={getFileState(props).hasFile || props.state === 'filled'}>
          <span class="inline-flex items-center gap-1 text-sm font-medium text-foreground-default">{props.fileName}</span>
          <Show when={props.fileMetadata !== ''}><span class="text-sm font-normal text-foreground-muted">{props.fileMetadata}</span></Show>
          <span class="flex flex-row items-start justify-start gap-2">
            <span class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground">{props.replaceText}</span>
            <button type="button" disabled={props.disabled || props.state === 'disabled'} class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-destructive-background px-2 py-0.5 text-sm font-medium text-primary-foreground hover:bg-destructive-hover" onClick={(event) => !(props.disabled || props.state === 'disabled') && clearFileInputEvent(event, props.onFileNameChange, props.onFilesChange, props.onRemove)}>{props.removeText}</button>
          </span>
        </Show>
        <input id={props.id} name={props.name} type="file" accept={props.accept} disabled={props.disabled || props.state === 'disabled'} required={props.required} aria-invalid={getFileState(props).hasError} aria-describedby={(props.showHint || getFileState(props).hasError) && getFileState(props).helpText !== '' ? props.id + '-hint' : undefined} class="sr-only" onChange={(event) => !(props.disabled || props.state === 'disabled') && handleFileSelectEvent(event, props.onFileNameChange, props.onFilesChange)} onBlur={(event) => !(props.disabled || props.state === 'disabled') && props.onBlur && props.onBlur(event)} />
      </label>
      <Show when={(props.showHint || getFileState(props).hasError) && getFileState(props).helpText !== ''}>
        <span id={props.id + '-hint'} class={cn('text-sm', getFileState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getFileState(props).helpText}</span>
      </Show>
    </div>
  );
}
