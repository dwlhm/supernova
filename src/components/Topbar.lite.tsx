import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TopbarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  showSidebarToggle?: boolean;
  sidebarToggleLabel?: string;
  className?: string;
  children?: any;
  onSearchChange?: (value: string) => void;
  onToggleSidebar?: () => void;
}

export default function Topbar(props: TopbarProps) {
  useDefaultProps({
    showSearch: true,
    searchPlaceholder: 'Search',
    searchValue: '',
    showSidebarToggle: true,
    sidebarToggleLabel: 'Toggle sidebar',
    className: '',
  });

  const state = useStore({
    handleSearch(rawValue: string) {
      if (props.onSearchChange) {
        props.onSearchChange(rawValue);
      }
    },
    handleToggle() {
      if (props.onToggleSidebar) {
        props.onToggleSidebar();
      }
    },
  });

  return (
    <header
      class={cn(
        'flex w-full items-center gap-2.5 border-b border-components-topbar-all-color-container-border-default bg-components-topbar-all-color-container-background-default px-4 py-3',
        props.className
      )}
    >
      <Show when={props.showSidebarToggle}>
        <button
          type="button"
          aria-label={props.sidebarToggleLabel}
          class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md text-components-topbar-all-color-navigation-icon-stroke-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={() => state.handleToggle()}
        >
          <svg
            aria-hidden="true"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" stroke-linecap="round" />
          </svg>
        </button>
      </Show>
      <Show when={props.showSearch}>
        <div class="flex h-8 w-full max-w-sm items-center gap-2 rounded-rounded-lg border border-components-topbar-all-color-search-border-default bg-components-topbar-all-color-search-background-default px-3">
          <svg
            aria-hidden="true"
            class="h-4 w-4 shrink-0 text-components-topbar-all-color-search-placeholder-foreground-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" stroke-linecap="round" />
          </svg>
          <input
            type="search"
            value={props.searchValue}
            placeholder={props.searchPlaceholder}
            aria-label={props.searchPlaceholder}
            class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-components-topbar-all-color-search-placeholder-foreground-default"
            onInput={(event) => state.handleSearch(event.target.value)}
          />
        </div>
      </Show>
      <div class="ml-auto flex items-center gap-2.5">{props.children}</div>
    </header>
  );
}
