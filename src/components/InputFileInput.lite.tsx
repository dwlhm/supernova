import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getFileState, handleFileSelectEvent, clearFileInputEvent, ICON_PATHS, bindControllerProps } from './utils';

export interface InputFileInputProps {
  id?: string;
  name?: string;
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
  onFilesChange?: (files: unknown[]) => void;
}

export default function InputFileInput(props: InputFileInputProps) {
  useDefaultProps({
    id: 'input-file', name: 'file', label: 'Picture', buttonText: 'Choose File', fileName: '',
    hint: 'Supported formats: PNG, JPG, or PDF.', errorMessage: '', accept: 'image/png,image/jpeg,application/pdf',
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
      <div
        class={cn(
          'flex items-center gap-3 rounded-lg border bg-background-default px-3 py-1 shadow-xs transition-colors',
          getFileState(props).hasError
            ? 'border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error'
            : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary',
          props.disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <label for={props.id} class={cn('flex min-w-0 flex-1 items-center gap-3', props.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
          <span class="inline-flex h-7 shrink-0 items-center rounded-sm bg-secondary-default px-3 text-sm font-medium text-secondary-foreground">
            {props.buttonText}
          </span>
          <span class={cn('truncate py-1 text-sm', getFileState(props).hasFile ? 'text-foreground-default' : 'text-foreground-subtle')}>
            {getFileState(props).displayName}
          </span>
          <input
            id={props.id} name={props.name} type="file" accept={props.accept} disabled={props.disabled} required={props.required}
            aria-invalid={getFileState(props).hasError} aria-describedby={props.showHint ? props.id + '-hint' : undefined}
            class="sr-only" onChange={(event) => !props.disabled && handleFileSelectEvent(event, props.onFileNameChange, props.onFilesChange)}
          />
        </label>
        <Show when={getFileState(props).hasFile}>
          <button
            type="button" disabled={props.disabled} aria-label="Remove file"
            class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none"
            onClick={(event) => !props.disabled && clearFileInputEvent(event, props.onFileNameChange, props.onFilesChange)}
          >
            <svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d={ICON_PATHS.close} stroke-linecap="round" /></svg>
          </button>
        </Show>
      </div>
      <Show when={props.showHint}>
        <span id={props.id + '-hint'} class={cn('text-sm', getFileState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getFileState(props).helpText}</span>
      </Show>
    </div>
  );
}
