import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, createDialogState, bindControllerProps } from './utils';

export interface AlertDialogProps {
  id?: string;
  open?: boolean;
  inline?: boolean;
  heading?: string;
  description?: string;
  showDescription?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  closeIcon?: any;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  className?: string;
  children?: any;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export default function AlertDialog(props: AlertDialogProps) {
  useDefaultProps({
    id: 'alert-dialog', open: true, inline: false, heading: '', description: '',
    showDescription: true, showCloseButton: true, closeLabel: 'Close', cancelLabel: 'Cancel', confirmLabel: 'Continue', destructive: false, className: '',
  });

  return (
    <Show when={props.open}>
      <div data-ctrl={typeof bindControllerProps} class={props.inline ? 'relative flex w-full items-center justify-center p-4' : 'fixed inset-0 z-50 flex items-center justify-center p-4'}>
        <Show when={!props.inline}>
          <div class="absolute inset-0 bg-overlay-backdrop" aria-hidden="true" onClick={() => props.onCancel && props.onCancel()} />
        </Show>
        <div
          role="alertdialog" aria-modal="true" tabIndex={-1}
          aria-labelledby={createDialogState({ id: props.id || 'alert-dialog' }).titleId}
          aria-describedby={props.showDescription ? createDialogState({ id: props.id || 'alert-dialog' }).descriptionId : undefined}
          onKeyDown={(event) => event.key === 'Escape' && props.onCancel && props.onCancel()}
          class={cn('relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border-default bg-background-default p-6 shadow-lg', props.className)}
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2.5">
              <h2 id={createDialogState({ id: props.id || 'alert-dialog' }).titleId} class="flex-1 text-xl leading-6 font-semibold text-foreground-default">{props.heading}</h2>
              <Show when={props.showCloseButton}>
                <button type="button" aria-label={props.closeLabel} class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-foreground-muted select-none transition-all duration-150 hover:bg-background-muted hover:text-foreground-default active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => props.onCancel && props.onCancel()}>
                  {props.closeIcon}
                  <Show when={!props.closeIcon}>
                    <svg class="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 3L3 11M3 3l8 8" /></svg>
                  </Show>
                </button>
              </Show>
            </div>
            <Show when={props.showDescription}>
              <p id={createDialogState({ id: props.id || 'alert-dialog' }).descriptionId} class="text-sm leading-5 text-foreground-muted">{props.description}</p>
            </Show>
          </div>
          <Show when={props.children}>{props.children}</Show>
          <div class="flex items-center justify-end gap-2">
            <button type="button" class="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-secondary-default px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs select-none transition-all duration-150 hover:bg-secondary-hover active:bg-background-interactive active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => props.onCancel && props.onCancel()}>
              {props.cancelLabel}
            </button>
            <button
              type="button"
              class={cn(
                'inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs select-none transition-all duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                props.destructive
                  ? 'bg-destructive-background hover:bg-destructive-hover active:bg-destructive-pressed'
                  : 'bg-primary-default hover:bg-primary-hover active:bg-primary-pressed'
              )}
              onClick={() => props.onConfirm && props.onConfirm()}
            >
              {props.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
