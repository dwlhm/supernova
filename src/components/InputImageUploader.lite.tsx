import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getFileState, handleFileSelectEvent, clearFileInputEvent, ICON_PATHS, bindControllerProps } from './utils';

export interface InputImageUploaderProps {
  id?: string; name?: string; label?: string; labelText?: string; primaryText?: string; supportingText?: string;
  chooseText?: string; replaceText?: string; removeText?: string; value?: string; fileName?: string;
  fileMetadata?: string; imageSrc?: string; icon?: any; state?: 'default' | 'focus' | 'filled' | 'error' | 'disabled';
  hint?: string | ((fileName: string) => string); hintErrorText?: string; error?: boolean; errorMessage?: string;
  validating?: boolean; accept?: string; disabled?: boolean; required?: boolean; showRequired?: boolean;
  showLabel?: boolean; showHint?: boolean; className?: string;
  onValueChange?: (value: string) => void; onFileNameChange?: (fileName: string) => void;
  onFilesChange?: (files: unknown[]) => void; onPreviewChange?: (url: string) => void;
  onRemove?: () => void; onBlur?: (event: unknown) => void;
}

export default function InputImageUploader(props: InputImageUploaderProps) {
  useDefaultProps({
    id: 'image-uploader', name: 'image-file', label: 'Profile image', primaryText: 'Upload an image',
    supportingText: 'Square JPG or PNG, up to 5 MB', chooseText: 'Choose image', replaceText: 'Replace', removeText: 'Remove',
    value: '', fileName: '', fileMetadata: '', imageSrc: '', state: 'default', hint: 'For best results, use a 1:1 image.',
    error: false, errorMessage: '', validating: false, accept: 'image/png,image/jpeg', disabled: false, required: true,
    showRequired: true, showLabel: true, showHint: true, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-3', props.className)}>
      <Show when={props.showLabel && (props.labelText || props.label)}>
        <label for={props.id} class="flex items-center gap-1 text-sm font-medium text-foreground-default">
          <span>{props.labelText || props.label}</span>
          <Show when={props.showRequired !== false && (props.required || props.showRequired)}>
            <span aria-hidden="true" class="text-destructive-foreground">*</span>
          </Show>
        </label>
      </Show>
      <div
        class={cn(
          'flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-sm transition-colors',
          (props.state === 'error' || getFileState(props).hasError)
            ? 'border-destructive-border ring-2 ring-focus-ring-error'
            : 'border-border-default',
          (props.disabled || props.state === 'disabled') && 'pointer-events-none cursor-not-allowed opacity-50'
        )}
      >
        <span aria-hidden="true" class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-muted">
          <Show when={props.imageSrc !== ''}><img src={props.imageSrc} alt="" class="h-full w-full object-cover" /></Show>
          <Show when={props.imageSrc === ''}>
            {props.icon}
            <Show when={!props.icon}>
              <svg class={cn('h-6 w-6', (props.disabled || props.state === 'disabled') ? 'text-foreground-subtle' : 'text-foreground-default')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d={ICON_PATHS.imageUpload || ICON_PATHS.image} stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Show>
          </Show>
        </span>
        <span class="flex min-w-0 flex-1 flex-col gap-2.5">
          <span class="truncate text-base font-normal text-foreground-default">
            {Boolean(props.fileName || props.imageSrc || getFileState(props).hasFile) ? (props.fileName || getFileState(props).displayName) : props.primaryText}
          </span>
          <span class="truncate text-sm font-normal text-foreground-muted">
            {Boolean(props.fileName || props.imageSrc || getFileState(props).hasFile) ? (props.fileMetadata || props.supportingText) : props.supportingText}
          </span>
          <span class="flex items-center gap-2">
            <label for={props.id} class={cn('inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary', (props.disabled || props.state === 'disabled') ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer')}>
              {Boolean(props.fileName || props.imageSrc || getFileState(props).hasFile) ? props.replaceText : props.chooseText}
              <input id={props.id} name={props.name} type="file" accept={props.accept} disabled={props.disabled || props.state === 'disabled'} required={props.required} aria-invalid={props.state === 'error' || getFileState(props).hasError} aria-describedby={(props.showHint || props.state === 'error' || getFileState(props).hasError) ? props.id + '-hint' : undefined} class="sr-only" onChange={(event) => !(props.disabled || props.state === 'disabled') && handleFileSelectEvent(event, props.onFileNameChange, props.onFilesChange, props.onPreviewChange)} onBlur={(event) => !(props.disabled || props.state === 'disabled') && props.onBlur && props.onBlur(event)} />
            </label>
            <Show when={Boolean(props.fileName || props.imageSrc || getFileState(props).hasFile)}>
              <button type="button" disabled={props.disabled || props.state === 'disabled'} class={cn('inline-flex items-center justify-center gap-1.5 rounded-lg bg-destructive-background px-2 py-0.5 text-sm font-medium text-primary-foreground hover:bg-destructive-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-error', (props.disabled || props.state === 'disabled') && 'pointer-events-none cursor-not-allowed opacity-50')} onClick={(event) => !(props.disabled || props.state === 'disabled') && clearFileInputEvent(event, props.onFileNameChange, props.onFilesChange, props.onRemove, props.onPreviewChange, props.onValueChange)}>{props.removeText}</button>
            </Show>
          </span>
        </span>
      </div>
      <Show when={props.showHint || props.state === 'error' || getFileState(props).hasError}>
        <span id={props.id + '-hint'} class={cn('text-sm font-normal', (props.state === 'error' || getFileState(props).hasError) ? 'text-destructive-foreground' : 'text-foreground-muted')}>
          {props.errorMessage && props.errorMessage !== '' ? props.errorMessage : (props.hintErrorText || getFileState(props).helpText || 'For best results, use a 1:1 image.')}
        </span>
      </Show>
    </div>
  );
}
