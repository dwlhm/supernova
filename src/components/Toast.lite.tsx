import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export type ToastType = 'Default' | 'Success' | 'Error' | 'Warning' | 'Info';

export interface ToastProps {
  /** Primary message. Keep it short and action oriented. */
  toastText?: string;
  /** Supporting details shown when showDescription is true. */
  descriptionText?: string;
  /** Label for the optional single action. */
  actionText?: string;
  /** Shows or hides the supporting description line. */
  showDescription?: boolean;
  /** Shows or hides the optional action button. */
  showActionButton?: boolean;
  /** Shows or hides the dismiss control. */
  showCloseButton?: boolean;
  /** Shows or hides the timestamp. */
  clock?: boolean;
  /** Human readable recency label, e.g. "2 min ago". Rendered only when clock is true. */
  timestampText?: string;
  /** Message intent. Drives icon badge and title color. */
  type?: ToastType;
  className?: string;
  /** Fired when the optional action is activated. */
  onAction?: () => void;
  /** Fired when the toast is dismissed. */
  onClose?: () => void;
}

export default function Toast(props: ToastProps) {
  useDefaultProps({
    toastText: 'Toast Text',
    descriptionText: 'Toast description text here',
    actionText: 'Undo',
    showDescription: false,
    showActionButton: false,
    showCloseButton: false,
    clock: true,
    type: 'Default',
    className: '',
  });

  const state = useStore({
    get roleType() {
      return props.type === 'Error' ? 'alert' : 'status';
    },
    get ariaLiveMode() {
      return props.type === 'Error' ? 'assertive' : 'polite';
    },
    get rootClasses() {
      return cn(
        'flex w-fit max-w-full flex-row items-start gap-2xs-plus rounded-full bg-background-default px-sm py-xs shadow-sm',
        'transition-colors hover:bg-background-muted active:bg-background-muted',
        props.className
      );
    },
    get iconContainerClasses() {
      return cn(
        'flex shrink-0 items-center justify-center rounded-full p-2xs-plus text-foreground-static-white',
        props.type === 'Success' && 'bg-success-default',
        props.type === 'Error' && 'bg-destructive-default',
        props.type === 'Warning' && 'bg-warning-default',
        props.type === 'Info' && 'bg-info-default',
        (props.type === 'Default' || !props.type) && 'bg-foreground-subtle'
      );
    },
    get titleClasses() {
      return cn(
        'text-sm font-semibold',
        props.type === 'Success' && 'text-success-default',
        props.type === 'Error' && 'text-destructive-foreground',
        props.type === 'Warning' && 'text-warning-default',
        props.type === 'Info' && 'text-info-default',
        (props.type === 'Default' || !props.type) && 'text-foreground-default'
      );
    },
    get hasDescription() {
      return props.showDescription === true && !!props.descriptionText;
    },
    get showTimestamp() {
      return props.clock === true && !!props.timestampText;
    },
    handleAction() {
      if (props.onAction) {
        props.onAction();
      }
    },
    handleClose() {
      if (props.onClose) {
        props.onClose();
      }
    },
  });

  return (
    <div
      role={state.roleType}
      aria-live={state.ariaLiveMode}
      aria-atomic="true"
      class={state.rootClasses}
    >
      <span class={state.iconContainerClasses} aria-hidden="true">
        <Show when={props.type === 'Success'}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="h-4 w-4"
          >
            <path d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </Show>
        <Show when={props.type === 'Error'}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="h-4 w-4"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="m15 9-6 6M9 9l6 6" />
          </svg>
        </Show>
        <Show when={props.type === 'Warning'}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="h-4 w-4"
          >
            <path d="M12 9v3.75M12 15.75h.008" />
            <path d="M2.697 16.126 10.05 3.378c.867-1.5 3.033-1.5 3.9 0l7.353 12.748c.865 1.5-.218 3.374-1.949 3.374H4.646c-1.73 0-2.814-1.874-1.949-3.374Z" />
          </svg>
        </Show>
        <Show when={props.type === 'Info'}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="h-4 w-4"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
        </Show>
        <Show when={props.type === 'Default' || !props.type}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="h-4 w-4"
          >
            <path d="M14.857 17.082a23.85 23.85 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </Show>
      </span>

      <div class="flex min-w-0 flex-1 flex-col gap-3xs">
        <span class={state.titleClasses}>{props.toastText}</span>
        <Show when={state.hasDescription}>
          <span class="text-xs text-foreground-muted">{props.descriptionText}</span>
        </Show>
      </div>

      <Show when={props.showActionButton}>
        <button
          type="button"
          class="inline-flex shrink-0 items-center justify-center self-center rounded-full px-2xs py-3xs text-xs font-semibold text-foreground-default transition-colors hover:bg-background-muted active:bg-background-interactive focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2"
          onClick={() => state.handleAction()}
        >
          {props.actionText}
        </button>
      </Show>

      <Show when={state.showTimestamp}>
        <time class="shrink-0 self-center text-xs text-foreground-muted">{props.timestampText}</time>
      </Show>

      <Show when={props.showCloseButton}>
        <button
          type="button"
          aria-label="Dismiss notification"
          class="inline-flex shrink-0 items-center justify-center self-center rounded-full p-3xs text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground-default active:bg-background-interactive focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2"
          onClick={() => state.handleClose()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </Show>
    </div>
  );
}
