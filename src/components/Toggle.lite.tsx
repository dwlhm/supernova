import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ToggleProps {
  /** Visual state. `Active` renders the toggle as "on", `Disabled` blocks interaction. */
  state?: 'Default' | 'Active' | 'Disabled';
  /** Control size: compact layouts, standard interfaces, or touch-focused layouts. */
  size?: 'Small' | 'Medium' | 'Large';
  /** Shows or hides the accompanying text label. */
  showText?: boolean;
  /** Text label describing the setting. Also used as the accessible name. */
  label?: string;
  /** Controlled pressed (on) value. Leave undefined for uncontrolled usage. */
  pressed?: boolean;
  disabled?: boolean;
  /** Accessible name, required for icon-only usage. */
  ariaLabel?: string;
  className?: string;
  children?: any;
  onPressedChange?: (pressed: boolean) => void;
}

export default function Toggle(props: ToggleProps) {
  useDefaultProps({
    state: 'Default',
    size: 'Small',
    showText: false,
    disabled: false,
    className: '',
  });

  const state = useStore({
    localPressed: null as boolean | null,
    get isDisabled() {
      return props.disabled === true || props.state === 'Disabled';
    },
    get isPressed() {
      if (props.pressed !== undefined) {
        return props.pressed;
      }
      if (state.localPressed !== null) {
        return state.localPressed;
      }
      return props.state === 'Active';
    },
    get accessibleLabel() {
      if (props.ariaLabel) {
        return props.ariaLabel;
      }
      if (props.label) {
        return props.label;
      }
      return undefined;
    },
    get sizeClasses() {
      switch (props.size) {
        case 'Medium':
          return 'gap-1 p-1 text-sm';
        case 'Large':
          return 'gap-1 p-2 text-base';
        case 'Small':
        default:
          return 'gap-0-5 p-0-5 text-xs';
      }
    },
    get iconClasses() {
      switch (props.size) {
        case 'Medium':
          return 'h-4 w-4';
        case 'Large':
          return 'h-5 w-5';
        case 'Small':
        default:
          return 'h-3 w-3';
      }
    },
    get stateClasses() {
      if (state.isDisabled) {
        return 'border-transparent bg-ghost-default text-foreground-default opacity-50';
      }
      if (state.isPressed) {
        return 'border-border-default bg-secondary-default text-foreground-default hover:bg-background-interactive active:bg-background-interactive';
      }
      return 'border-transparent bg-ghost-default text-foreground-default hover:bg-background-subtle active:bg-background-muted';
    },
    get containerClasses() {
      return cn(
        'inline-flex select-none items-center justify-center rounded-md border font-medium leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        state.isDisabled ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer',
        state.sizeClasses,
        state.stateClasses,
        props.className
      );
    },
    toggle() {
      if (state.isDisabled) {
        return;
      }
      const nextPressed = !state.isPressed;
      state.localPressed = nextPressed;
      if (props.onPressedChange) {
        props.onPressedChange(nextPressed);
      }
    },
  });

  return (
    <button
      type="button"
      class={state.containerClasses}
      aria-pressed={state.isPressed}
      aria-label={state.accessibleLabel}
      disabled={state.isDisabled}
      onClick={() => state.toggle()}
    >
      <Show
        when={props.children}
        else={
          <svg
            class={cn(state.iconClasses, 'shrink-0')}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2.6l2.86 5.98 6.52.86-4.79 4.54 1.18 6.52L12 17.17l-5.77 3.33 1.18-6.52L2.62 9.44l6.52-.86L12 2.6z" />
          </svg>
        }
      >
        <span
          class={cn(state.iconClasses, 'inline-flex shrink-0 items-center justify-center')}
          aria-hidden="true"
        >
          {props.children}
        </span>
      </Show>
      <Show when={props.showText && props.label}>
        <span class="whitespace-nowrap">{props.label}</span>
      </Show>
    </button>
  );
}
