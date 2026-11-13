import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface MainMenuProps {
  active?: boolean;
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

export default function MainMenu(props: MainMenuProps) {
  useDefaultProps({
    active: false, disabled: false, showLabel: true, showLeadingIcon: true,
    showTrailingIcon: true, showBadge: false, badgeLabel: '', className: '',
  });

  return (
    <button
      data-ctrl={typeof bindControllerProps}
      type="button"
      disabled={props.disabled}
      aria-disabled={props.disabled}
      aria-current={props.active ? 'page' : undefined}
      class={cn(
        'flex w-full items-center justify-center gap-2 rounded-lg px-2 py-3 text-sm font-normal select-none transition-colors duration-150 [&>svg]:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        props.active
          ? 'bg-primary-default text-primary-foreground'
          : cn('text-foreground-default', !props.disabled && 'hover:bg-background-interactive active:bg-background-muted'),
        props.className
      )}
      onClick={() => !props.disabled && props.onClick && props.onClick()}
    >
      {props.leadingIcon}
      <Show when={props.showLeadingIcon && !props.leadingIcon}>
        <span class={cn('flex shrink-0 items-center', props.active ? 'text-foreground-inverse' : 'text-foreground-default')}>
          <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </span>
      </Show>
      <Show when={props.showLabel}>
        <span class={cn('flex-1 truncate text-left', props.active ? 'text-primary-foreground' : 'text-foreground-default')}>{props.children}</span>
      </Show>
      <Show when={props.showBadge}>
        <span class={cn('inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none', props.active ? 'bg-primary-foreground text-foreground-default' : 'bg-primary-default text-foreground-inverse')}>
          {props.badgeLabel}
        </span>
      </Show>
      {props.trailingIcon}
      <Show when={props.showTrailingIcon && !props.trailingIcon}>
        <svg aria-hidden="true" class={cn('h-4 w-4 shrink-0', props.active ? 'text-foreground-inverse' : 'text-foreground-default')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d={ICON_PATHS.chevronRight} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </Show>
    </button>
  );
}
