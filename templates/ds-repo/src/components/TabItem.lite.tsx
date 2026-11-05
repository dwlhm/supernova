import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface TabItemProps {
  label?: string;
  active?: boolean;
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function TabItem(props: TabItemProps) {
  useDefaultProps({
    label: 'Label', active: false, showIcon: false, showNum: false, num: '1', className: '',
  });

  return (
    <button
      data-ctrl={typeof bindControllerProps}
      type="button"
      role="tab"
      aria-selected={props.active}
      tabIndex={props.active ? 0 : -1}
      class={cn(
        'inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        props.active
          ? 'bg-background-default text-foreground-default shadow-xs'
          : 'text-foreground-muted hover:text-foreground-default',
        props.className
      )}
      onClick={() => props.onClick && props.onClick()}
    >
      <Show when={props.showIcon}>
        <span class="flex shrink-0 items-center text-foreground-muted">
          <Show when={props.children}>{props.children}</Show>
          <Show when={!props.children}>
            <svg aria-hidden="true" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d={ICON_PATHS.menu} stroke-linecap="round" />
            </svg>
          </Show>
        </span>
      </Show>
      <span class="truncate">{props.label}</span>
      <Show when={props.showNum}>
        <span class="inline-flex shrink-0 items-center rounded-full bg-background-muted px-1 py-0.5 text-xs font-medium leading-none text-foreground-muted">
          {props.num}
        </span>
      </Show>
    </button>
  );
}
