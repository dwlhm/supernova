import { useStore, useDefaultProps, Show, Slot } from '@builder.io/mitosis';
import { cn } from './utils';

export type ButtonVariant = 'Primary' | 'Secondary' | 'Outline' | 'Ghost' | 'Destructive' | 'Link';
export type ButtonSize = 'Large' | 'Regular' | 'Small' | 'Mini';
export type ButtonRoundness = 'Default' | 'Round';
export type ButtonState = 'Default' | 'Focus' | 'Pressed' | 'Disabled';

export interface ButtonProps {
  /** Maps to the Figma `Style` property: visual emphasis and semantic intent. */
  variant?: ButtonVariant;
  /** Maps to the Figma `Size` property: dimensions and density. */
  size?: ButtonSize;
  /** Maps to the Figma `Roundness` property: corner treatment. */
  roundness?: ButtonRoundness;
  /**
   * Maps to the Figma `State` property. Interaction feedback is primarily handled by
   * `hover:` / `focus-visible:` / `active:` pseudo-classes; this prop only pins a state
   * for static specs, and `Disabled` doubles as the availability flag.
   */
  state?: ButtonState;
  /** Visible button text (Figma `Label`). */
  label?: string;
  /** Maps to the Figma `Show Label` property. */
  showLabel?: boolean;
  /** Maps to the Figma `Show left icon` property. */
  showLeftIcon?: boolean;
  /** Maps to the Figma `Show right icon` property. */
  showRightIcon?: boolean;
  /** Explicit accessible name — required for icon-only buttons whose label is not rendered. */
  ariaLabel?: string;
  /** Destination for `variant="Link"` buttons, which render as a semantic anchor. */
  href?: string;
  target?: string;
  /** Disables the control. Equivalent to `state="Disabled"`. */
  disabled?: boolean;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  useDefaultProps({
    variant: 'Primary',
    size: 'Regular',
    roundness: 'Default',
    state: 'Default',
    label: 'Label',
    showLabel: true,
    showLeftIcon: false,
    showRightIcon: false,
    disabled: false,
    className: '',
  });

  const state = useStore({
    get isDisabled() {
      return props.disabled === true || props.state === 'Disabled';
    },
    get isLink() {
      return props.variant === 'Link';
    },
    get accessibleLabel() {
      if (props.ariaLabel) {
        return props.ariaLabel;
      }
      if (props.showLabel === false) {
        return props.label;
      }
      return undefined;
    },
    get iconAriaHidden() {
      return props.showLabel === false ? undefined : 'true';
    },
    get variantClasses() {
      switch (props.variant) {
        case 'Secondary':
          return 'bg-secondary-default text-secondary-foreground hover:bg-secondary-hover active:bg-background-interactive';
        case 'Outline':
          return 'border border-border-default bg-background-default text-foreground-default hover:bg-secondary-default active:bg-secondary-default focus-visible:border-components-button-outline-color-container-border-focus';
        case 'Ghost':
          return 'bg-ghost-default text-foreground-default hover:bg-ghost-hover active:bg-background-interactive';
        case 'Destructive':
          return 'bg-destructive-background text-destructive-on-destructive hover:bg-destructive-hover active:bg-destructive-pressed';
        case 'Link':
          return 'bg-ghost-default text-primary-muted hover:bg-ghost-hover hover:text-primary-on-surface active:text-primary-on-surface';
        case 'Primary':
        default:
          return 'bg-primary-default text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed';
      }
    },
    get sizeClasses() {
      switch (props.size) {
        case 'Large':
          return 'px-6 py-2-5 gap-2 font-font-size-sm font-line-height-21';
        case 'Small':
          return 'px-3 py-2 gap-1-5 font-font-size-xs font-line-height-16';
        case 'Mini':
          return 'px-2 py-1 gap-1-5 font-font-size-xs font-line-height-16';
        case 'Regular':
        default:
          return 'px-4 py-2 gap-2 font-font-size-sm font-line-height-21';
      }
    },
    get roundnessClasses() {
      return props.roundness === 'Round' ? 'rounded-rounded-full' : 'rounded-rounded-lg';
    },
    get focusRingClasses() {
      return props.variant === 'Link'
        ? 'focus-visible:ring-components-button-link-color-container-focus-ring-focus'
        : 'focus-visible:ring-focus-ring-primary';
    },
    get forcedStateClasses() {
      if (props.state === 'Pressed') {
        switch (props.variant) {
          case 'Secondary':
            return 'bg-background-interactive';
          case 'Outline':
            return 'bg-secondary-default';
          case 'Ghost':
            return 'bg-background-interactive';
          case 'Destructive':
            return 'bg-destructive-pressed';
          case 'Link':
            return 'text-primary-on-surface';
          case 'Primary':
          default:
            return 'bg-primary-pressed';
        }
      }
      if (props.state === 'Focus') {
        return props.variant === 'Link'
          ? 'ring-2 ring-offset-2 ring-components-button-link-color-container-focus-ring-focus'
          : 'ring-2 ring-offset-2 ring-focus-ring-primary';
      }
      return '';
    },
    get containerClasses() {
      return cn(
        'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-weight-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        state.variantClasses,
        state.sizeClasses,
        state.roundnessClasses,
        state.focusRingClasses,
        state.forcedStateClasses,
        props.className,
      );
    },
    handleClick(event) {
      if (state.isDisabled) {
        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        return;
      }
      if (props.onClick) {
        props.onClick();
      }
    },
  });

  return (
    <Show
      when={state.isLink}
      else={
        <button
          type="button"
          disabled={state.isDisabled}
          aria-disabled={state.isDisabled ? 'true' : undefined}
          aria-label={state.accessibleLabel}
          class={state.containerClasses}
          onClick={(event) => state.handleClick(event)}
        >
          <Show when={props.showLeftIcon}>
            <span
              class="inline-flex shrink-0 items-center justify-center"
              aria-hidden={state.iconAriaHidden}
            >
              <Slot name="leftIcon" />
            </span>
          </Show>

          <Show when={props.showLabel}>
            <span>{props.label}</span>
          </Show>
          <Show when={!props.showLabel}>{props.children}</Show>

          <Show when={props.showRightIcon}>
            <span
              class="inline-flex shrink-0 items-center justify-center"
              aria-hidden={state.iconAriaHidden}
            >
              <Slot name="rightIcon" />
            </span>
          </Show>
        </button>
      }
    >
      <a
        href={state.isDisabled ? undefined : props.href}
        target={props.target}
        role={state.isDisabled ? 'link' : undefined}
        aria-disabled={state.isDisabled ? 'true' : undefined}
        aria-label={state.accessibleLabel}
        class={state.containerClasses}
        onClick={(event) => state.handleClick(event)}
      >
        <Show when={props.showLeftIcon}>
          <span
            class="inline-flex shrink-0 items-center justify-center"
            aria-hidden={state.iconAriaHidden}
          >
            <Slot name="leftIcon" />
          </span>
        </Show>

        <Show when={props.showLabel}>
          <span>{props.label}</span>
        </Show>
        <Show when={!props.showLabel}>{props.children}</Show>

        <Show when={props.showRightIcon}>
          <span
            class="inline-flex shrink-0 items-center justify-center"
            aria-hidden={state.iconAriaHidden}
          >
            <Slot name="rightIcon" />
          </span>
        </Show>
      </a>
    </Show>
  );
}
