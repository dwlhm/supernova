import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface MenuItemProps {
  /** Visible item text. */
  label?: string;
  /** Selected / current destination, or an expanded submenu parent. */
  active?: boolean;
  /** Expansion state of the nested submenu. Omit for leaf items. */
  expanded?: boolean;
  /** Prevents interaction. */
  disabled?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  showBadge?: boolean;
  /** Short status text rendered in the trailing badge. */
  badgeLabel?: string;
  className?: string;
  /** Submenu content slot for nested navigation. */
  children?: any;
  onClick?: () => void;
}

export default function MenuItem(props: MenuItemProps) {
  useDefaultProps({
    label: 'Menu',
    active: false,
    disabled: false,
    showLabel: true,
    showLeadingIcon: true,
    showTrailingIcon: true,
    showBadge: false,
    badgeLabel: 'New',
    className: '',
  });

  const state = useStore({
    get containerClasses() {
      if (props.active) {
        return 'bg-components-menu-item-active-color-container-background-active-rebind';
      }
      return 'hover:bg-components-menu-item-hover-color-container-background-hover-rebind active:bg-components-menu-item-hover-color-container-background-hover-rebind';
    },
    get foregroundClasses() {
      return props.active
        ? 'text-components-menu-item-active-color-label-foreground-active-rebind'
        : 'text-components-menu-item-default-color-label-foreground-default-rebind';
    },
    get trailingIconClasses() {
      const colorClasses = props.active
        ? 'text-components-menu-item-active-color-trailing-icon-foreground-active-rebind'
        : 'text-components-menu-item-default-color-trailing-icon-foreground-default-rebind';
      const rotationClasses = props.expanded ? 'rotate-90' : '';
      return cn('h-4 w-4 shrink-0 transition-transform', colorClasses, rotationClasses);
    },
    get submenuClasses() {
      const borderClasses = props.active
        ? 'border-components-menu-item-active-color-submenu-content-border-active-rebind'
        : 'border-border-default';
      return cn('ml-4 flex flex-col gap-1 border-l py-1 pl-2', borderClasses);
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
    <div class={cn('flex w-full flex-col', props.className)}>
      <button
        type="button"
        disabled={props.disabled}
        aria-current={props.active ? 'page' : undefined}
        aria-expanded={props.expanded}
        class={cn(
          'flex w-full items-center gap-2 rounded-rounded-lg px-2 py-3 text-left text-sm transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          state.containerClasses
        )}
        onClick={() => state.handleClick()}
      >
        <Show when={props.showLeadingIcon}>
          <span class={cn('flex shrink-0 items-center', state.foregroundClasses)}>
            <svg
              aria-hidden="true"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
        </Show>

        <Show when={props.showLabel}>
          <span class={cn('min-w-0 flex-1 truncate', state.foregroundClasses)}>{props.label}</span>
        </Show>

        <Show when={props.showBadge}>
          <span
            class={cn(
              'inline-flex h-4 shrink-0 items-center rounded-rounded-xl bg-primary-default px-2-5 text-xs font-medium leading-none text-foreground-inverse'
            )}
          >
            {props.badgeLabel}
          </span>
        </Show>

        <Show when={props.showTrailingIcon}>
          <svg
            aria-hidden="true"
            class={state.trailingIconClasses}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </Show>
      </button>

      <Show when={props.children}>
        <div role="group" class={state.submenuClasses}>
          {props.children}
        </div>
      </Show>
    </div>
  );
}
