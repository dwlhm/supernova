import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TopbarBreadcrumbItem {
  label: string;
  href?: string;
}

export interface TopbarProps {
  /** Trail of page-context links rendered left of the content slot. */
  breadcrumbItems?: TopbarBreadcrumbItem[];
  /** Visual separator between breadcrumb entries. */
  breadcrumbSeparator?: string;
  /** Accessible label for the breadcrumb navigation landmark. */
  breadcrumbLabel?: string;
  /** Renders the sidebar-collapse control at the leading edge. */
  showSidebarToggle?: boolean;
  /** Accessible label for the sidebar-collapse control. */
  sidebarToggleLabel?: string;
  /** Reflects the expanded state of the sidebar controlled by the toggle. */
  sidebarToggleExpanded?: boolean;
  /** Fired when the sidebar-collapse control is activated. */
  onSidebarToggle?: () => void;
  /** Keeps the bar pinned to the top of the scroll container. */
  sticky?: boolean;
  /** Accessible label for the banner landmark. */
  ariaLabel?: string;
  /** Additional utility classes applied to the header element. */
  className?: string;
  /** Topbar content slot: page context, search, notifications, account actions. */
  children?: any;
}

export default function Topbar(props: TopbarProps) {
  useDefaultProps({
    breadcrumbSeparator: '/',
    breadcrumbLabel: 'Breadcrumb',
    sidebarToggleLabel: 'Toggle sidebar',
    showSidebarToggle: false,
    sidebarToggleExpanded: false,
    sticky: false,
    className: '',
  });

  const state = useStore({
    get hasBreadcrumb() {
      const trail = props.breadcrumbItems;
      return !!trail && trail.length > 0;
    },
    get breadcrumbEntries() {
      const trail = props.breadcrumbItems || [];
      const total = trail.length;
      return trail.map((entry, index) => ({
        key: entry.label + '-' + index,
        label: entry.label,
        href: entry.href,
        isLast: index === total - 1,
      }));
    },
    get separator() {
      return props.breadcrumbSeparator || '/';
    },
    get headerClasses() {
      return cn(
        'flex w-full flex-row items-center justify-start gap-2.5 px-4 py-3',
        'bg-background-default border-b border-border-default',
        props.sticky && 'sticky top-0 z-20',
        props.className
      );
    },
    get toggleClasses() {
      return cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-none',
        'bg-background-default text-foreground-default transition-colors',
        'hover:bg-background-muted active:bg-background-interactive',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2'
      );
    },
    get breadcrumbLinkClasses() {
      return cn(
        'inline-flex items-center rounded-sm px-0.5 text-sm text-foreground-muted transition-colors',
        'hover:text-foreground-default',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2'
      );
    },
    handleSidebarToggle() {
      if (props.onSidebarToggle) {
        props.onSidebarToggle();
      }
    },
  });

  return (
    <header class={state.headerClasses} aria-label={props.ariaLabel}>
      <Show when={props.showSidebarToggle}>
        <button
          type="button"
          class={state.toggleClasses}
          aria-label={props.sidebarToggleLabel}
          aria-expanded={props.sidebarToggleExpanded ? 'true' : 'false'}
          onClick={() => state.handleSidebarToggle()}
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      </Show>

      <Show when={state.hasBreadcrumb}>
        <nav class="flex flex-row items-center gap-1.5" aria-label={props.breadcrumbLabel}>
          <For each={state.breadcrumbEntries}>
            {(entry) => (
              <div class="flex flex-row items-center gap-1.5" key={entry.key}>
                <Show
                  when={entry.isLast}
                  else={
                    <a href={entry.href} class={state.breadcrumbLinkClasses}>
                      {entry.label}
                    </a>
                  }
                >
                  <span
                    class="inline-flex items-center px-0.5 text-sm font-medium text-foreground-default"
                    aria-current="page"
                  >
                    {entry.label}
                  </span>
                </Show>
                <Show when={!entry.isLast}>
                  <span class="text-sm text-foreground-muted select-none" aria-hidden="true">
                    {state.separator}
                  </span>
                </Show>
              </div>
            )}
          </For>
        </nav>
      </Show>

      <div class="flex min-w-0 flex-1 flex-row items-center justify-end gap-2.5">
        {props.children}
      </div>
    </header>
  );
}
