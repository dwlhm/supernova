import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

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
    label: 'Menu', active: false, showLabel: true, showLeadingIcon: true,
    showTrailingIcon: true, showBadge: false, badgeLabel: 'New', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col', props.className)}>
      <button
        type="button"
        aria-current={props.active ? 'page' : undefined}
        class={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
          props.active
            ? 'bg-primary-subtle font-medium'
            : 'hover:bg-background-muted active:bg-background-interactive'
        )}
        onClick={() => props.onClick && props.onClick()}
      >
        <Show when={props.showLeadingIcon}>
          <span class={cn('flex shrink-0 items-center', props.active ? 'text-primary-subtle-foreground' : 'text-foreground-default')}>
            <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
        </Show>
        <Show when={props.showLabel}>
          <span class={cn('flex-1 truncate text-left', props.active ? 'text-primary-subtle-foreground' : 'text-foreground-default')}>{props.label}</span>
        </Show>
        <Show when={props.showBadge}>
          <span class={cn('inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none', props.active ? 'bg-primary-default text-primary-foreground' : 'bg-primary-subtle text-primary-subtle-foreground')}>
            {props.badgeLabel}
          </span>
        </Show>
        <Show when={props.showTrailingIcon}>
          <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0', props.active ? 'text-primary-subtle-foreground' : 'text-foreground-muted')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
      </button>
      <Show when={props.children}>
        <div class={cn('ml-4 flex flex-col gap-1 border-l py-1 pl-2', props.active ? 'border-primary-default' : 'border-border-default')}>
          {props.children}
        </div>
      </Show>
    </div>
  );
}
