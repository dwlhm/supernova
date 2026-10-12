import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface MenuItemProps {
  label?: string;
  active?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function MenuItem(props: MenuItemProps) {
  useDefaultProps({
    label: 'Menu',
    active: false,
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
      return 'hover:bg-components-menu-item-hover-color-container-background-hover-rebind';
    },
    get labelClasses() {
      return props.active
        ? 'text-components-menu-item-active-color-label-foreground-active-rebind'
        : 'text-components-menu-item-default-color-label-foreground-default-rebind';
    },
    get iconClasses() {
      return props.active
        ? 'text-components-menu-item-active-color-icon-foreground-active-rebind'
        : 'text-components-menu-item-default-color-icon-foreground-default-rebind';
    },
    get badgeClasses() {
      return props.active
        ? 'bg-components-menu-item-active-color-badge-background-active-rebind text-components-menu-item-active-color-badge-label-foreground-active-rebind'
        : 'bg-components-menu-item-default-color-badge-background-default-rebind text-components-menu-item-default-color-badge-label-foreground-default-rebind';
    },
    get submenuBorderClasses() {
      return props.active
        ? 'border-components-menu-item-active-color-submenu-content-border-active-rebind'
        : 'border-border-default';
    },
    handleClick() {
      if (props.onClick) {
        props.onClick();
      }
    },
  });

  return (
    <div class={cn('flex w-full flex-col', props.className)}>
      <button
        type="button"
        class={cn(
          'flex w-full items-center gap-2 rounded-rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
          state.containerClasses
        )}
        onClick={() => state.handleClick()}
      >
        <Show when={props.showLeadingIcon}>
          <span class={cn('flex shrink-0 items-center', state.iconClasses)}>
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
          <span class={cn('flex-1 truncate text-left', state.labelClasses)}>{props.label}</span>
        </Show>
        <Show when={props.showBadge}>
          <span
            class={cn(
              'inline-flex shrink-0 items-center rounded-rounded-xl px-2 py-0.5 text-xs font-medium leading-none',
              state.badgeClasses
            )}
          >
            {props.badgeLabel}
          </span>
        </Show>
        <Show when={props.showTrailingIcon}>
          <svg
            aria-hidden="true"
            class={cn('h-4 w-4 shrink-0', state.iconClasses)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
      </button>
      <Show when={props.children}>
        <div class={cn('ml-4 flex flex-col gap-1 border-l py-1 pl-2', state.submenuBorderClasses)}>
          {props.children}
        </div>
      </Show>
    </div>
  );
}
