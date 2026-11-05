import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, createDialogState, bindControllerProps } from './utils';

export interface AlertDialogProps {
  open?: boolean;
  inline?: boolean;
  heading?: string;
  description?: string;
  showDescription?: boolean;
  showCloseButton?: boolean;
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
    open: true, inline: false, heading: 'Are you absolutely sure?',
    description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    showDescription: true, showCloseButton: true, cancelLabel: 'Cancel', confirmLabel: 'Continue', destructive: false, className: '',
  });

  return (
    <Show when={props.open}>
      <div data-ctrl={typeof bindControllerProps} class={props.inline ? 'relative flex w-full items-center justify-center p-4' : 'fixed inset-0 z-50 flex items-center justify-center p-4'}>
        <Show when={!props.inline}>
          <div class="absolute inset-0 bg-overlay-backdrop" aria-hidden="true" onClick={() => props.onCancel && props.onCancel()} />
        </Show>
        <div
          role="alertdialog" aria-modal="true" tabIndex={-1}
          aria-labelledby={createDialogState({ id: 'alert-dialog' }).titleId}
          aria-describedby={props.showDescription ? createDialogState({ id: 'alert-dialog' }).descriptionId : undefined}
          onKeyDown={(event) => event.key === 'Escape' && props.onCancel && props.onCancel()}
          class={cn('relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border-default bg-background-default p-6 shadow-lg', props.className)}
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2.5">
              <h2 id={createDialogState({ id: 'alert-dialog' }).titleId} class="flex-1 text-xl leading-6 font-semibold text-foreground-default">{props.heading}</h2>
              <Show when={props.showCloseButton}>
                <button type="button" aria-label="Close" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => props.onCancel && props.onCancel()}>
                  <svg class="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 3L3 11M3 3l8 8" /></svg>
                </button>
              </Show>
            </div>
            <Show when={props.showDescription}>
              <p id={createDialogState({ id: 'alert-dialog' }).descriptionId} class="text-sm leading-5 text-foreground-muted">{props.description}</p>
            </Show>
          </div>
          <Show when={props.children}>{props.children}</Show>
          <Show when={!props.children}>
            <div class="flex items-center justify-end gap-2">
              <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg bg-secondary-default px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => props.onCancel && props.onCancel()}>
                {props.cancelLabel}
              </button>
              <button
                type="button"
                class={cn(
                  'inline-flex h-9 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                  props.destructive
                    ? 'bg-destructive-background hover:bg-destructive-hover active:bg-destructive-pressed'
                    : 'bg-primary-default hover:bg-primary-hover active:bg-primary-pressed'
                )}
                onClick={() => props.onConfirm && props.onConfirm()}
              >
                {props.confirmLabel}
              </button>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
}
