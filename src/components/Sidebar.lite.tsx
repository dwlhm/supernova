import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

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
    expanded: true,
    brand: 'Komerce',
    accountLabel: 'Account',
    accountMeta: 'account@example.com',
    accountInitials: 'AB',
    brandInitials: 'K',
    className: '',
  });

  const state = useStore({
    get widthClasses() {
      return props.expanded ? 'w-60' : 'w-16';
    },
    get hasAccount() {
      return props.accountLabel !== '' || props.accountMeta !== '';
    },
  });

  return (
    <aside
      aria-label={props.brand}
      class={cn(
        'flex h-full shrink-0 flex-col justify-between border-r border-components-sidebar-expanded-rebind-color-container-border-default bg-components-sidebar-expanded-rebind-color-container-background-default pb-2',
        state.widthClasses,
        props.className
      )}
    >
      <div class="flex flex-col">
        <div
          class={cn(
            'flex items-center gap-2 px-2 py-4',
            props.expanded ? '' : 'justify-center'
          )}
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md bg-components-sidebar-expanded-rebind-color-container-background-default-2 text-sm font-semibold text-components-sidebar-expanded-rebind-color-label-foreground-default-2"
            aria-hidden="true"
          >
            {props.brandInitials}
          </span>
          <Show when={props.expanded}>
            <span class="truncate text-sm font-semibold text-components-sidebar-expanded-rebind-color-label-foreground-default">
              {props.brand}
            </span>
          </Show>
        </div>
        <nav aria-label="Main" class="flex flex-col gap-2 px-2">
          {props.children}
        </nav>
      </div>
      <Show when={state.hasAccount}>
        <div class={cn('px-2', props.expanded ? '' : 'flex justify-center')}>
          <div
            class={cn(
              'flex items-center gap-2 rounded-rounded-xl bg-background-subtle px-2 py-2',
              props.expanded ? '' : 'justify-center'
            )}
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-background-muted text-xs font-medium text-components-sidebar-expanded-rebind-color-section-label-foreground-default"
              aria-hidden="true"
            >
              {props.accountInitials}
            </span>
            <Show when={props.expanded}>
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium text-components-sidebar-expanded-rebind-color-label-foreground-default">
                  {props.accountLabel}
                </span>
                <span class="truncate text-xs text-components-sidebar-expanded-rebind-color-section-label-foreground-default">
                  {props.accountMeta}
                </span>
              </span>
            </Show>
          </div>
        </div>
      </Show>
    </aside>
  );
}
