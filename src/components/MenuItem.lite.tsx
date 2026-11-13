import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface MenuItemProps {
  label?: string;
  active?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  leadingIcon?: any;
  trailingIcon?: any;
  showBadge?: boolean;
  badgeLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function MenuItem(props: MenuItemProps) {
  useDefaultProps({
    label: 'Menu Item', active: false, expanded: false, disabled: false, showLabel: true, showLeadingIcon: true,
    showTrailingIcon: true, showBadge: false, badgeLabel: '', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-1', props.className)}>
      <button
        type="button"
        disabled={props.disabled}
        aria-disabled={props.disabled}
        aria-current={props.active ? 'page' : undefined}
        aria-expanded={props.expanded}
        class={cn(
          'flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm select-none transition-colors duration-150 [&>svg]:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
          props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          props.active
            ? 'bg-background-muted font-medium text-foreground-default'
            : cn('font-normal text-foreground-default', !props.disabled && 'hover:bg-background-muted active:bg-background-interactive')
        )}
        onClick={() => !props.disabled && props.onClick && props.onClick()}
      >
        {props.leadingIcon}
        <Show when={props.showLeadingIcon && !props.leadingIcon}>
          <span class="flex shrink-0 items-center text-foreground-default">
            <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
        </Show>
        <Show when={props.showLabel}>
          <span class="flex-1 truncate text-left text-foreground-default">{props.label}</span>
        </Show>
        <Show when={props.showBadge}>
          <span class="inline-flex shrink-0 items-center rounded-xl bg-primary-default px-2 py-0.5 text-xs font-medium leading-none text-foreground-inverse">
            {props.badgeLabel}
          </span>
        </Show>
        {props.trailingIcon}
        <Show when={props.showTrailingIcon && !props.trailingIcon}>
          <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0 text-foreground-default transition-transform duration-150', props.expanded && 'rotate-90')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
      </button>
      <Show when={props.expanded}>
        <div class="ml-4 flex flex-col gap-1 border-l border-border-default py-1 pl-2 text-sm text-foreground-default">
          {props.children}
        </div>
      </Show>
    </div>
  );
}
