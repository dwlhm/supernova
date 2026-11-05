import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface SidebarProps {
  expanded?: boolean;
  brand?: string;
  accountLabel?: string;
  accountMeta?: string;
  accountInitials?: string;
  brandInitials?: string;
  className?: string;
  children?: any;
}

export default function Sidebar(props: SidebarProps) {
  useDefaultProps({
    expanded: false, brand: 'Komerce', accountLabel: 'Lionel Messi',
    accountMeta: 'messi@gmail.com', accountInitials: 'LM', brandInitials: 'K', className: '',
  });

  return (
    <aside
      data-ctrl={typeof bindControllerProps}
      aria-label={props.brand}
      class={cn(
        'flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pb-2',
        props.expanded ? 'w-60' : 'w-16',
        props.className
      )}
    >
      <div class="flex flex-col">
        <div class={cn('flex items-center gap-2 px-2 py-4', props.expanded ? '' : 'justify-center')}>
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-default text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {props.brandInitials}
          </span>
          <Show when={props.expanded}>
            <span class="truncate text-sm font-semibold text-foreground-default">
              {props.brand}
            </span>
          </Show>
        </div>
        <nav aria-label="Main" class="flex flex-col gap-2 px-2">
          {props.children}
        </nav>
      </div>
      <Show when={props.accountLabel !== '' || props.accountMeta !== ''}>
        <div class={cn('px-2', props.expanded ? '' : 'flex justify-center')}>
          <div class={cn('flex items-center gap-2 rounded-xl bg-background-muted px-2 py-2', props.expanded ? '' : 'justify-center')}>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-subtle text-xs font-medium text-foreground-muted"
              aria-hidden="true"
            >
              {props.accountInitials}
            </span>
            <Show when={props.expanded}>
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium text-foreground-default">{props.accountLabel}</span>
                <span class="truncate text-xs text-foreground-muted">{props.accountMeta}</span>
              </span>
            </Show>
          </div>
        </div>
      </Show>
    </aside>
  );
}
