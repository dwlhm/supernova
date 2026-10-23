import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface MainMenuProps {
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

export default function MainMenu(props: MainMenuProps) {
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
      return props.active
        ? 'bg-components-main-menu-active-color-container-background-active-rebind'
        : 'hover:bg-components-main-menu-all-color-container-background-hover';
    },
    get labelClasses() {
      return props.active
        ? 'text-components-main-menu-active-color-label-foreground-active-rebind'
        : 'text-components-main-menu-default-color-label-foreground-default-rebind';
    },
    get iconClasses() {
      return props.active
        ? 'text-components-main-menu-active-color-icon-foreground-active-rebind'
        : 'text-components-main-menu-default-color-icon-foreground-default-rebind';
    },
    get badgeClasses() {
      return props.active
        ? 'bg-components-main-menu-active-color-badge-background-active-rebind text-components-main-menu-active-color-badge-label-foreground-active-rebind'
        : 'bg-components-main-menu-default-color-badge-background-default-rebind text-components-main-menu-default-color-badge-label-foreground-default-rebind';
    },
    handleClick() {
      if (props.onClick) {
        props.onClick();
      }
    },
  });

  return (
    <button
      type="button"
      aria-current={props.active ? 'page' : undefined}
      class={cn(
        'flex w-full items-center gap-2 rounded-rounded-md px-2 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        state.containerClasses,
        props.className
      )}
      onClick={() => state.handleClick()}
    >
      <Show when={props.showLeadingIcon}>
        <span class={cn('flex shrink-0 items-center', state.iconClasses)}>
          <Show when={props.children}>
            {props.children}
          </Show>
          <Show when={!props.children}>
            <svg
              aria-hidden="true"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </Show>
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
  );
}
