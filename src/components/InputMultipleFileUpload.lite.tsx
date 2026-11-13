import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getFileState, handleFileSelectEvent, bindControllerProps } from './utils';

export interface InputMultipleFileUploadProps {
  children?: any;
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  instruction?: string;
  browseText?: string;
  fileCount?: string | ((count: number) => string);
  hint?: string | ((fileName: string) => string);
  error?: boolean;
  errorMessage?: string;
  validating?: boolean;
  accept?: string;
  state?: 'default' | 'focus' | 'filled' | 'error' | 'disabled';
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onValueChange?: (files: unknown[]) => void;
  onFilesChange?: (files: unknown[]) => void;
  onBlur?: (event: unknown) => void;
}

export default function InputMultipleFileUpload(props: InputMultipleFileUploadProps) {
  useDefaultProps({
    id: 'multiple-file-upload', name: 'files', value: '', label: '', instruction: 'Choose one or more files',
    browseText: 'Browse', fileCount: '', hint: '', error: false, errorMessage: '', validating: false,
    accept: 'image/png,image/jpeg,application/pdf,application/zip', state: 'default',
    disabled: false, required: true, showLabel: true, showHint: true, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col items-start justify-start gap-3', props.className)}>
      <Show when={props.showLabel && props.label !== ''}>
        <div class="flex w-full flex-row items-start justify-between gap-3">
          <label for={props.id} class="flex flex-row items-start justify-start gap-1 text-sm font-medium text-foreground-default">
            <span>{props.label}</span>
            <Show when={props.required}>
              <span aria-hidden="true" class="text-sm font-medium text-destructive-default">*</span>
            </Show>
          </label>
          <Show when={getFileState(props).resolvedFileCount !== ''}>
            <span class="text-sm font-normal text-foreground-muted">{getFileState(props).resolvedFileCount}</span>
          </Show>
        </div>
      </Show>
      <label for={props.id} class={cn('flex h-[52px] w-full flex-row items-center justify-start gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors', getFileState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : props.state === 'focus' ? 'border-primary-border-emphasis ring-2 ring-focus-ring-primary' : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary', props.disabled || props.state === 'disabled' ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer')}>
        <span class={cn('flex-1 truncate text-base font-normal', props.state === 'filled' ? 'text-foreground-default' : 'text-foreground-muted')}>{props.instruction}</span>
        <span class="inline-flex h-8 shrink-0 flex-row items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-3 py-1 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary-hover">{props.browseText}</span>
        <input id={props.id} name={props.name} type="file" multiple accept={props.accept} disabled={props.disabled || props.state === 'disabled'} required={props.required} aria-invalid={getFileState(props).hasError} aria-describedby={(props.showHint || getFileState(props).hasError) && getFileState(props).helpText !== '' ? props.id + '-hint' : undefined} class="sr-only" onChange={(event) => !(props.disabled || props.state === 'disabled') && handleFileSelectEvent(event, undefined, props.onFilesChange)} onBlur={(event) => !(props.disabled || props.state === 'disabled') && props.onBlur && props.onBlur(event)} />
      </label>
      <Show when={props.children}>
        <ul class="flex w-full flex-col items-start justify-start gap-2">{props.children}</ul>
      </Show>
      <Show when={(props.showHint || getFileState(props).hasError) && getFileState(props).helpText !== ''}>
        <div class="flex flex-col items-start justify-start">
          <span id={props.id + '-hint'} class={cn('text-sm font-normal', getFileState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getFileState(props).helpText}</span>
        </div>
      </Show>
    </div>
  );
}
