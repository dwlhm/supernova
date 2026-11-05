import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getFileState, handleFileSelectEvent, clearFileInputEvent, ICON_PATHS, bindControllerProps } from './utils';

export interface InputImageUploaderProps {
  id?: string;
  name?: string;
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
  onFilesChange?: (files: unknown[]) => void;
  onPreviewChange?: (url: string) => void;
}

export default function InputImageUploader(props: InputImageUploaderProps) {
  useDefaultProps({
    id: 'image-uploader', name: 'image-file', label: 'Profile image', primaryText: 'Upload an image',
    supportingText: 'Square JPG or PNG, up to 5 MB', fileName: '', fileMetadata: '', imageSrc: '',
    hint: 'For best results, use a 1:1 image.', errorMessage: '', accept: 'image/png,image/jpeg',
    disabled: false, required: true, showLabel: true, showHint: true, className: '',
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
          'flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-xs transition-colors',
          getFileState(props).hasError
            ? 'border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error'
            : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary',
          props.disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <span aria-hidden="true" class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-muted">
          <Show when={props.imageSrc !== ''}><img src={props.imageSrc} alt="" class="h-full w-full object-cover" /></Show>
          <Show when={props.imageSrc === ''}>
            <svg class="h-8 w-8 text-foreground-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.image} stroke-linecap="round" stroke-linejoin="round" /></svg>
          </Show>
        </span>
        <span class="flex min-w-0 flex-1 flex-col gap-2">
          <span class="truncate text-sm font-medium text-foreground-default">{getFileState(props).hasFile ? props.fileName : props.primaryText}</span>
          <span class="truncate text-sm text-foreground-muted">{getFileState(props).hasFile && props.fileMetadata !== '' ? props.fileMetadata : props.supportingText}</span>
          <span class="flex items-center gap-2">
            <label for={props.id} class={cn('inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary', props.disabled ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer')}>
              {getFileState(props).hasFile ? 'Replace' : 'Choose image'}
              <input id={props.id} name={props.name} type="file" accept={props.accept} disabled={props.disabled} required={props.required} aria-invalid={getFileState(props).hasError} class="sr-only" onChange={(event) => !props.disabled && handleFileSelectEvent(event, props.onFileNameChange, props.onFilesChange, props.onPreviewChange)} />
            </label>
            <Show when={getFileState(props).hasFile}>
              <button type="button" disabled={props.disabled} class="inline-flex items-center rounded-lg px-2 py-0.5 text-sm font-medium text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={(event) => !props.disabled && clearFileInputEvent(event, props.onFileNameChange, props.onFilesChange)}>Remove</button>
            </Show>
          </span>
        </span>
      </div>
      <Show when={props.showHint}>
        <span id={props.id + '-hint'} class={cn('text-sm', getFileState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getFileState(props).helpText}</span>
      </Show>
    </div>
  );
}
