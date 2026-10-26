import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface FABProps {
  /** Editable text label, rendered only for the `extended` size. */
  label?: string;
  /** Visual emphasis level. */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Container size: small (40x40), regular (56x56), large (96x96), extended (120x56). */
  size?: 'small' | 'regular' | 'large' | 'extended';
  /** Disabled state (use sparingly; prefer validation / guidance). */
  disabled?: boolean;
  /** Accessible name used when no visible label is rendered. */
  ariaLabel?: string;
  /** Additional classes for the root button element. */
  className?: string;
  /** Icon content (SVG) rendered inside the FAB. */
  children?: any;
  /** Fired on activation of the FAB. */
  onClick?: () => void;
}

export default function FAB(props: FABProps) {
  useDefaultProps({
    label: 'Label',
    variant: 'primary',
    size: 'small',
    disabled: false,
    ariaLabel: '',
    className: '',
  });

  const state = useStore({
    get isExtended() {
      return props.size === 'extended';
    },
    get accessibleName() {
      return props.ariaLabel || props.label || 'Action';
    },
    get variantClasses() {
      switch (props.variant) {
        case 'secondary':
          return 'bg-secondary-default text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-default';
        case 'outline':
          return 'border border-border-default bg-background-default text-foreground-default hover:bg-background-muted active:bg-background-muted';
        case 'primary':
        default:
          return 'bg-primary-default text-primary-on-primary hover:bg-primary-hover active:bg-primary-pressed';
      }
    },
    get containerSizeClasses() {
      switch (props.size) {
        case 'regular':
          return 'h-14 w-14';
        case 'large':
          return 'h-24 w-24';
        case 'extended':
          return 'h-14 px-4 py-2 gap-3';
        case 'small':
        default:
          return 'h-10 w-10';
      }
    },
    get iconSizeClasses() {
      switch (props.size) {
        case 'regular':
          return 'h-5 w-5';
        case 'large':
          return 'h-7 w-7';
        case 'extended':
          return 'h-5 w-5';
        case 'small':
        default:
          return 'h-4 w-4';
      }
    },
    get labelClasses() {
      return 'text-sm font-medium whitespace-nowrap';
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
        'inline-flex items-center justify-center shrink-0 rounded-full font-body shadow-md transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none',
        state.variantClasses,
        state.containerSizeClasses,
        props.className
      )}
      onClick={() => state.handleClick()}
    >
      <Show when={props.children}>
        <span
          aria-hidden="true"
          class={cn('inline-flex items-center justify-center shrink-0', state.iconSizeClasses)}
        >
          {props.children}
        </span>
      </Show>
      <Show when={state.isExtended}>
        <span class={state.labelClasses}>{props.label}</span>
      </Show>
    </button>
  );
}
