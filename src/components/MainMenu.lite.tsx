import { Show, useDefaultProps, useStore } from '@builder.io/mitosis';
import { cn } from './utils';

export interface MainMenuProps {
  /** Sets the menu item text. */
  label?: string;
  /** Shows or hides the text label. */
  showLabel?: boolean;
  /** Shows or hides the leading icon. */
  showLeadingIcon?: boolean;
  /** Shows or hides the trailing affordance icon. */
  showTrailingIcon?: boolean;
  /** Shows or hides the status badge. */
  showBadge?: boolean;
  /** Sets the badge text. */
  badgeLabel?: string;
  /**
   * Marks the item as the current destination ("Active" in Figma).
   * Hover and pressed visuals are handled with CSS pseudo-classes, never props.
   */
  active?: boolean;
  /** Optional destination; when provided the item renders as a link. */
  href?: string;
  /** Disables interaction with the menu item. */
  disabled?: boolean;
  /** Additional classes merged onto the interactive element. */
  className?: string;
  /** Fired when the item is activated by pointer or keyboard. */
  onClick?: () => void;
}

export default function MainMenu(props: MainMenuProps) {
  useDefaultProps({
    label: 'Menu',
    showLabel: true,
    showLeadingIcon: true,
    showTrailingIcon: true,
    showBadge: false,
    badgeLabel: 'New',
    active: false,
    disabled: false,
    className: '',
  });

  const state = useStore({
    get isActive() {
      return props.active === true;
    },
    get ariaCurrent() {
      return state.isActive ? 'page' : undefined;
    },
    get ariaLabel() {
      return props.showLabel === false ? props.label : undefined;
    },
    get itemClasses() {
      return cn(
        'group relative flex w-full items-center gap-2 rounded-lg px-2 py-3 text-left text-sm font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2',
        state.isActive
          ? 'bg-background-accent text-primary-foreground hover:bg-primary-default active:bg-primary-pressed'
          : 'bg-transparent text-foreground-default hover:bg-background-interactive active:bg-background-accent',
        props.disabled ? 'pointer-events-none opacity-50' : '',
        props.className
      );
    },
    get leadingIconClasses() {
      return cn(
        'h-4 w-4 shrink-0',
        state.isActive ? 'text-foreground-inverse' : 'text-foreground-default'
      );
    },
    get trailingIconClasses() {
      return cn(
        'h-4 w-4 shrink-0',
        state.isActive ? 'text-foreground-inverse' : 'text-foreground-default'
      );
    },
    get trailingGroupClasses() {
      return 'ml-auto flex shrink-0 items-center gap-2';
    },
    get labelClasses() {
      return 'min-w-0 flex-1 truncate';
    },
    get badgeClasses() {
      return cn(
        'inline-flex h-4 shrink-0 items-center justify-center rounded-xl px-2 text-xs font-medium leading-none',
        state.isActive
          ? 'bg-primary-foreground text-foreground-default'
          : 'bg-primary-default text-foreground-inverse group-active:bg-primary-foreground group-active:text-foreground-default'
      );
    },
    handleClick() {
      if (props.disabled) {
        return;
      }
      if (props.onClick) {
        props.onClick();
      }
    },
  });

  return (
    <Show
      when={props.href}
      else={
        <button
          type="button"
          class={state.itemClasses}
          disabled={props.disabled}
          aria-current={state.ariaCurrent}
          aria-label={state.ariaLabel}
          onClick={() => state.handleClick()}
        >
          <Show when={props.showLeadingIcon}>
            <svg
              class={state.leadingIconClasses}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="2" y="2" width="4.5" height="4.5" rx="1" />
              <rect x="9.5" y="2" width="4.5" height="4.5" rx="1" />
              <rect x="2" y="9.5" width="4.5" height="4.5" rx="1" />
              <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="1" />
            </svg>
          </Show>
          <Show when={props.showLabel}>
            <span class={state.labelClasses}>{props.label}</span>
          </Show>
          <span class={state.trailingGroupClasses}>
            <Show when={props.showBadge}>
              <span class={state.badgeClasses}>{props.badgeLabel}</span>
            </Show>
            <Show when={props.showTrailingIcon}>
              <svg
                class={state.trailingIconClasses}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M6 3.5 10.5 8 6 12.5" />
              </svg>
            </Show>
          </span>
        </button>
      }
    >
      <a
        href={props.href}
        class={state.itemClasses}
        aria-current={state.ariaCurrent}
        aria-label={state.ariaLabel}
        aria-disabled={props.disabled ? 'true' : undefined}
        onClick={() => state.handleClick()}
      >
        <Show when={props.showLeadingIcon}>
          <svg
            class={state.leadingIconClasses}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="2" y="2" width="4.5" height="4.5" rx="1" />
            <rect x="9.5" y="2" width="4.5" height="4.5" rx="1" />
            <rect x="2" y="9.5" width="4.5" height="4.5" rx="1" />
            <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="1" />
          </svg>
        </Show>
        <Show when={props.showLabel}>
          <span class={state.labelClasses}>{props.label}</span>
        </Show>
        <span class={state.trailingGroupClasses}>
          <Show when={props.showBadge}>
            <span class={state.badgeClasses}>{props.badgeLabel}</span>
          </Show>
          <Show when={props.showTrailingIcon}>
            <svg
              class={state.trailingIconClasses}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 3.5 10.5 8 6 12.5" />
            </svg>
          </Show>
        </span>
      </a>
    </Show>
  );
}
