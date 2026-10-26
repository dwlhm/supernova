import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SidebarProps {
  expanded?: boolean;
  brandLabel?: string;
  brandInitials?: string;
  navigationLabel?: string;
  accountLabel?: string;
  accountMeta?: string;
  accountInitials?: string;
  showAccount?: boolean;
  onAccountClick?: () => void;
  className?: string;
  children?: any;
}

export default function Sidebar(props: SidebarProps) {
  useDefaultProps({
    expanded: true,
    brandLabel: 'Komerce',
    brandInitials: 'K',
    navigationLabel: 'Main',
    accountLabel: 'Account',
    accountMeta: '',
    accountInitials: 'A',
    showAccount: true,
    className: '',
  });

  const state = useStore({
    get isExpanded() {
      return props.expanded === true;
    },
    get isCollapsed() {
      return props.expanded !== true;
    },
    get widthClasses() {
      return state.isExpanded ? 'w-60' : 'w-16';
    },
    get brandClasses() {
      return cn(
        'flex items-center gap-2',
        state.isExpanded ? 'px-2 py-4' : 'justify-center pb-2 pl-2 pr-4 pt-4'
      );
    },
    get navigationClasses() {
      return 'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2';
    },
    get accountClasses() {
      return cn(
        'flex w-full items-center gap-2 rounded-xl bg-background-subtle p-2 text-left transition-colors hover:bg-background-muted focus:outline-none focus:ring-2 focus:ring-focus-ring-primary',
        state.isExpanded ? '' : 'justify-center'
      );
    },
    get showAccountSection() {
      return props.showAccount === true;
    },
    get hasAccountMeta() {
      return props.accountMeta !== '' && props.accountMeta !== undefined;
    },
    handleAccountClick() {
      if (props.onAccountClick) {
        props.onAccountClick();
      }
    },
  });

  return (
    <aside
      aria-label={props.brandLabel}
      class={cn(
        'flex h-full shrink-0 flex-col overflow-hidden border-r border-border-default bg-background-default pb-2',
        state.widthClasses,
        props.className
      )}
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <div class={state.brandClasses}>
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-default text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {props.brandInitials}
          </span>
          <Show when={state.isExpanded}>
            <span class="truncate text-sm font-semibold text-foreground-default">
              {props.brandLabel}
            </span>
          </Show>
          <Show when={state.isCollapsed}>
            <span class="sr-only">{props.brandLabel}</span>
          </Show>
        </div>

        <nav aria-label={props.navigationLabel} class={state.navigationClasses}>
          {props.children}
        </nav>
      </div>

      <Show when={state.showAccountSection}>
        <div class="shrink-0 px-2">
          <button
            type="button"
            class={state.accountClasses}
            onClick={() => state.handleAccountClick()}
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-muted text-xs font-medium text-foreground-subtle"
              aria-hidden="true"
            >
              {props.accountInitials}
            </span>
            <Show when={state.isExpanded}>
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium text-foreground-default">
                  {props.accountLabel}
                </span>
                <Show when={state.hasAccountMeta}>
                  <span class="truncate text-xs text-foreground-subtle">
                    {props.accountMeta}
                  </span>
                </Show>
              </span>
              <svg
                class="ml-auto h-4 w-4 shrink-0 text-foreground-muted"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M8 2.5 12.5 7H3.5L8 2.5Z" fill="currentColor" />
                <path d="M8 13.5 3.5 9h9L8 13.5Z" fill="currentColor" />
              </svg>
            </Show>
            <Show when={state.isCollapsed}>
              <span class="sr-only">{props.accountLabel}</span>
            </Show>
          </button>
        </div>
      </Show>
    </aside>
  );
}
