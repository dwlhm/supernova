import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ToggleProps {
  pressed?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  label?: string;
  className?: string;
  children?: any;
  ariaLabel?: string;
  onPressedChange?: (pressed: boolean) => void;
}

export default function Toggle(props: ToggleProps) {
  useDefaultProps({
    pressed: false,
    disabled: false,
    size: 'medium',
    showText: false,
    label: 'Toggle',
    className: '',
    ariaLabel: '',
  });

  const state = useStore({
    get sizeClasses() {
      switch (props.size) {
        case 'small':
          return 'p-0.5 gap-0.5 text-xs';
        case 'large':
          return 'p-2 gap-1 text-base';
        case 'medium':
        default:
          return 'p-1 gap-1 text-sm';
      }
    },
    get iconClasses() {
      switch (props.size) {
        case 'small':
          return 'h-3 w-3';
        case 'large':
          return 'h-5 w-5';
        case 'medium':
        default:
          return 'h-4 w-4';
      }
    },
    get pressedClasses() {
      return props.pressed ? 'bg-components-toggle-active-color-container-background-default' : 'bg-transparent';
    },
    handleToggle() {
      if (props.disabled) {
        return;
      }
      if (props.onPressedChange) {
        props.onPressedChange(!props.pressed);
      }
    },
  });

  return (
    <button
      type="button"
      aria-pressed={props.pressed}
      aria-label={props.ariaLabel !== '' ? props.ariaLabel : props.label}
      disabled={props.disabled}
      class={cn(
        'inline-flex items-center justify-center rounded-rounded-lg text-components-toggle-all-color-label-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
        state.sizeClasses,
        state.pressedClasses,
        props.className
      )}
      onClick={() => state.handleToggle()}
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
          <path d="M12 3v18M3 12h18" stroke-linecap="round" />
        </svg>
      </Show>
      <Show when={props.showText}>
        <span class="truncate">{props.label}</span>
      </Show>
    </button>
  );
}
