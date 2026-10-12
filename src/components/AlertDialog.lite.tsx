import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface AlertDialogProps {
  open?: boolean;
  heading?: string;
  description?: string;
  showDescription?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  className?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export default function AlertDialog(props: AlertDialogProps) {
  useDefaultProps({
    open: false,
    heading: 'Are you absolutely sure?',
    description: 'This action cannot be undone. Please confirm that you want to continue.',
    showDescription: true,
    cancelLabel: 'Cancel',
    confirmLabel: 'Continue',
    destructive: false,
    className: '',
  });

  const state = useStore({
    get headingId() {
      return 'alert-dialog-heading';
    },
    get descriptionId() {
      return 'alert-dialog-description';
    },
    get confirmClasses() {
      return props.destructive
        ? 'bg-destructive-default text-destructive-on-destructive hover:bg-destructive-hover active:bg-destructive-pressed'
        : 'bg-primary-default text-primary-on-primary hover:bg-primary-hover active:bg-primary-pressed';
    },
    handleCancel() {
      if (props.onCancel) {
        props.onCancel();
      }
    },
    handleConfirm() {
      if (props.onConfirm) {
        props.onConfirm();
      }
    },
  });

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-overlay-backdrop"
          aria-hidden="true"
          onClick={() => state.handleCancel()}
        ></div>
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={state.headingId}
          aria-describedby={state.descriptionId}
          class={cn(
            'relative z-10 w-full max-w-md rounded-rounded-xl border border-components-alert-dialog-default-color-dialog-border-default bg-components-alert-dialog-default-color-dialog-background-default p-6 shadow-xl',
            props.className
          )}
        >
          <h2
            id={state.headingId}
            class="text-lg font-semibold text-components-alert-dialog-default-color-heading-text-default"
          >
            {props.heading}
          </h2>
          <Show when={props.showDescription}>
            <p
              id={state.descriptionId}
              class="mt-2 text-sm text-components-alert-dialog-default-color-description-text-default"
            >
              {props.description}
            </p>
          </Show>
          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              class="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-secondary-color-container-background-default px-4 text-sm font-medium text-components-button-secondary-color-label-foreground-default transition-colors hover:bg-components-button-secondary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              onClick={() => state.handleCancel()}
            >
              {props.cancelLabel}
            </button>
            <button
              type="button"
              class={cn(
                'inline-flex h-9 items-center justify-center rounded-rounded-lg px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                state.confirmClasses
              )}
              onClick={() => state.handleConfirm()}
            >
              {props.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
