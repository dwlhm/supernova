import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS } from './utils';

export interface InputMultipleFileUploadItemProps {
  children?: any;
  statusText?: string;
  status?: 'uploading' | 'completed' | 'error';
  removeText?: string;
  disabled?: boolean;
  className?: string;
  onRemove?: () => void;
}

export default function InputMultipleFileUploadItem(props: InputMultipleFileUploadItemProps) {
  useDefaultProps({
    statusText: '',
    status: 'completed',
    removeText: 'Remove',
    disabled: false,
    className: '',
  });

  return (
    <li class={cn('flex w-full flex-row items-center justify-start gap-2 rounded-lg border border-border-default bg-background-default px-3 py-3', props.className)}>
      <svg aria-hidden="true" class="h-6 w-6 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d={ICON_PATHS.file} stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="flex min-w-0 flex-1 flex-col items-start justify-start gap-2">
        <div class="flex w-full flex-row items-start justify-between gap-2">
          <span class="truncate text-sm font-medium text-foreground-default">{props.children}</span>
          <Show when={props.statusText !== ''}>
            <span class={cn('shrink-0 text-xs font-normal', props.status === 'error' ? 'text-destructive-default' : 'text-foreground-muted')}>
              {props.statusText}
            </span>
          </Show>
        </div>
      </div>
      <span class="flex h-6 w-6 shrink-0 flex-row items-center justify-center">
        <Show when={props.status === 'completed'}>
          <svg aria-hidden="true" class="h-6 w-6 text-success-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d={ICON_PATHS.check} stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
        <Show when={props.status === 'uploading'}>
          <svg aria-hidden="true" class="h-6 w-6 animate-spin text-primary-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke-linecap="round" />
          </svg>
        </Show>
        <Show when={props.status === 'error'}>
          <svg aria-hidden="true" class="h-6 w-6 text-destructive-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d={ICON_PATHS.close} stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
      </span>
      <button
        type="button"
        disabled={props.disabled}
        class="inline-flex shrink-0 flex-row items-center justify-center gap-1.5 rounded-lg px-2 py-0.5 text-center text-sm font-medium text-foreground-muted hover:bg-background-subtle hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50"
        onClick={() => !props.disabled && props.onRemove && props.onRemove()}
      >
        {props.removeText}
      </button>
    </li>
  );
}
