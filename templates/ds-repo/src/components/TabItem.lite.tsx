import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface TabItemProps {
  active?: boolean;
  state?: 'default' | 'active';
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function TabItem(props: TabItemProps) {
  useDefaultProps({
    active: false,
    state: 'default',
    showIcon: false,
    showNum: false,
    num: '',
    className: '',
  });

  return (
    <button
      data-ctrl={typeof bindControllerProps}
      type="button"
      role="tab"
      aria-selected={props.active || props.state === 'active'}
      tabIndex={props.active || props.state === 'active' ? 0 : -1}
      class={cn(
        'inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        props.active || props.state === 'active'
          ? 'border border-border-default bg-background-default text-foreground-default shadow-sm'
          : 'text-foreground-muted hover:text-foreground-default',
        props.className
      )}
      onClick={() => props.onClick && props.onClick()}
    >
      <Show when={props.showIcon}>
        <span class="flex shrink-0 items-center text-foreground-muted">
          <svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d={ICON_PATHS.menu} stroke-linecap="round" />
          </svg>
        </span>
      </Show>
      <span class="truncate">{props.children}</span>
      <Show when={props.showNum}>
        <span class="inline-flex shrink-0 items-center rounded-full bg-background-muted px-1.5 py-0.5 text-xs font-medium leading-none text-foreground-muted">
          {props.num}
        </span>
      </Show>
    </button>
  );
}
