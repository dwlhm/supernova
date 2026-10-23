import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface FABProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'regular' | 'large' | 'extended';
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function FAB(props: FABProps) {
  useDefaultProps({
    variant: 'primary',
    size: 'regular',
    disabled: false,
    label: 'Label',
    showLabel: true,
    ariaLabel: '',
    className: '',
  });

  const state = useStore({
    get variantClasses() {
      switch (props.variant) {
        case 'secondary':
          return 'bg-components-fab-secondary-color-container-background-default text-components-fab-secondary-color-label-foreground-default hover:bg-components-fab-secondary-color-container-background-hover';
        case 'outline':
          return 'bg-components-fab-surface-color-container-background-default text-components-fab-surface-color-label-foreground-default border border-border-default hover:bg-components-fab-surface-color-container-background-hover';
        case 'primary':
        default:
          return 'bg-components-fab-primary-color-container-background-default text-components-fab-primary-color-label-foreground-default hover:bg-components-fab-primary-color-container-background-hover';
      }
    },
    get sizeClasses() {
      switch (props.size) {
        case 'small':
          return 'h-10 w-10';
        case 'large':
          return 'h-24 w-24';
        case 'extended':
          return 'h-14 w-auto gap-3 px-4';
        case 'regular':
        default:
          return 'h-14 w-14';
      }
    },
    get iconClasses() {
      switch (props.size) {
        case 'small':
          return 'h-4 w-4';
        case 'large':
          return 'h-7 w-7';
        case 'regular':
        case 'extended':
        default:
          return 'h-5 w-5';
      }
    },
    get accessibleName() {
      return props.ariaLabel !== '' ? props.ariaLabel : props.label;
    },
    handleClick() {
      if (!props.disabled && props.onClick) {
        props.onClick();
      }
    },
  });

  return (
    <button
      type="button"
      aria-label={state.accessibleName}
      disabled={props.disabled}
      class={cn(
        'inline-flex shrink-0 items-center justify-center rounded-rounded-full shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
        state.variantClasses,
        state.sizeClasses,
        props.className
      )}
      onClick={() => state.handleClick()}
    >
      <Show when={props.children}>
        {props.children}
      </Show>
      <Show when={!props.children}>
        <svg
          aria-hidden="true"
          class={cn('shrink-0', state.iconClasses)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M12 5v14M5 12h14" stroke-linecap="round" />
        </svg>
      </Show>
      <Show when={props.size === 'extended' && props.showLabel}>
        <span class="truncate text-sm font-medium">{props.label}</span>
      </Show>
    </button>
  );
}
