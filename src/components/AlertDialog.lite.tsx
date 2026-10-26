import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface AlertDialogProps {
  /** Controls whether the alert dialog is rendered. */
  open?: boolean;
  /** Base id used to wire aria-labelledby / aria-describedby. */
  id?: string;
  /** Heading. Should state the decision the user must make. */
  heading?: string;
  /** Supporting copy explaining the consequence and affected item. */
  description?: string;
  /** Hides the supporting description (only for low-risk actions). */
  showDescription?: boolean;
  /** Shows the dismiss (X) control in the header. */
  showClose?: boolean;
  /** Label of the safe / cancel action. */
  cancelLabel?: string;
  /** Label of the primary / confirming action. */
  continueLabel?: string;
  /** Style of the confirming action. Use destructive for risky actions. */
  continueVariant?: 'primary' | 'destructive';
  /** Fired when the safe action is chosen, or when the dialog is dismissed. */
  onCancel?: () => void;
  /** Fired when the primary action is confirmed. */
  onContinue?: () => void;
  /** Fired when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Additional classes on the overlay root. */
  className?: string;
  /** Custom body content rendered between the header and the actions. */
  children?: any;
}

export default function AlertDialog(props: AlertDialogProps) {
  useDefaultProps({
    open: true,
    id: 'alert-dialog',
    heading: 'Are you absolutely sure?',
    description:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    showDescription: true,
    showClose: true,
    cancelLabel: 'Cancel',
    continueLabel: 'Continue',
    continueVariant: 'primary',
    className: '',
  });

  const state = useStore({
    get headingId() {
      return props.id + '-heading';
    },
    get descriptionId() {
      return props.id + '-description';
    },
    get hasDescription() {
      return props.showDescription === true && !!props.description;
    },
    get baseButtonClasses() {
      return 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';
    },
    get cancelButtonClasses() {
      return (
        state.baseButtonClasses +
        ' bg-components-button-secondary-color-container-background-default text-components-button-secondary-color-label-foreground-default hover:bg-components-button-secondary-color-container-background-hover active:bg-components-button-secondary-color-container-background-pressed focus-visible:ring-focus-ring-default'
      );
    },
    get continueButtonClasses() {
      if (props.continueVariant === 'destructive') {
        return (
          state.baseButtonClasses +
          ' bg-components-button-destructive-color-container-background-default text-components-button-destructive-color-label-foreground-default hover:bg-components-button-destructive-color-container-background-hover active:bg-components-button-destructive-color-container-background-pressed focus-visible:ring-focus-ring-error'
        );
      }
      return (
        state.baseButtonClasses +
        ' bg-components-button-primary-color-container-background-default text-components-button-primary-color-label-foreground-default hover:bg-components-button-primary-color-container-background-hover active:bg-components-button-primary-color-container-background-pressed focus-visible:ring-focus-ring-primary'
      );
    },
    requestClose() {
      if (props.onCancel) {
        props.onCancel();
      }
      if (props.onOpenChange) {
        props.onOpenChange(false);
      }
    },
    handleCancel() {
      state.requestClose();
    },
    handleContinue() {
      if (props.onContinue) {
        props.onContinue();
      }
    },
    handleKeyDown(key) {
      if (key === 'Escape') {
        state.requestClose();
      }
    },
  });

  return (
    <Show when={props.open}>
      <div
        class={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          props.className
        )}
      >
        <div
          aria-hidden="true"
          class="absolute inset-0 bg-components-alert-dialog-default-color-backdrop-background-default"
          onClick={() => state.requestClose()}
        />
        <div
          id={props.id}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={state.headingId}
          aria-describedby={state.hasDescription ? state.descriptionId : undefined}
          tabIndex={0}
          onKeyDown={(event) => state.handleKeyDown(event.key)}
          class="relative flex w-full max-w-md flex-col items-start justify-start gap-4 rounded-xl border border-components-alert-dialog-default-color-dialog-border-default bg-components-alert-dialog-default-color-dialog-background-default p-6 shadow-lg focus:outline-none"
        >
          <div class="flex w-full flex-col items-start justify-start gap-2">
            <div class="flex w-full flex-row items-center justify-between gap-2.5">
              <h2
                id={state.headingId}
                class="text-xl font-semibold leading-6 tracking-normal text-components-alert-dialog-default-color-heading-text-default"
              >
                {props.heading}
              </h2>
              <Show when={props.showClose}>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => state.requestClose()}
                  class="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-components-alert-dialog-default-color-icon-stroke-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-default"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </Show>
            </div>
            <Show when={state.hasDescription}>
              <p
                id={state.descriptionId}
                class="text-sm font-normal leading-5 text-components-alert-dialog-default-color-description-text-default"
              >
                {props.description}
              </p>
            </Show>
          </div>
          {props.children}
          <div class="flex w-full flex-row items-center justify-end gap-2">
            <button
              type="button"
              class={cn(state.cancelButtonClasses)}
              onClick={() => state.handleCancel()}
            >
              {props.cancelLabel}
            </button>
            <button
              type="button"
              class={cn(state.continueButtonClasses)}
              onClick={() => state.handleContinue()}
            >
              {props.continueLabel}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
