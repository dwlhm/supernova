import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface TopbarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  showSidebarToggle?: boolean;
  sidebarToggleLabel?: string;
  breadcrumbRoot?: string;
  breadcrumbCurrent?: string;
  className?: string;
  children?: any;
  onSearchChange?: (value: string) => void;
  onToggleSidebar?: () => void;
}

export default function Topbar(props: TopbarProps) {
  useDefaultProps({
    showSearch: false, searchPlaceholder: 'Search', searchValue: '',
    showSidebarToggle: true, sidebarToggleLabel: 'Toggle sidebar',
    breadcrumbRoot: 'Home', breadcrumbCurrent: 'Breadcrumb', className: '',
  });

  return (
    <header
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex h-16 w-full items-center gap-2 border-b border-border-default bg-background-default px-6',
        props.className
      )}
    >
      <Show when={props.showSidebarToggle}>
        <button
          type="button"
          aria-label={props.sidebarToggleLabel}
          class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md p-2 text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={() => props.onToggleSidebar && props.onToggleSidebar()}
        >
          <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" stroke-linecap="round" />
          </svg>
        </button>
      </Show>
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
        <span class="text-foreground-muted">{props.breadcrumbRoot}</span>
        <span aria-hidden="true" class="text-foreground-muted">/</span>
        <span aria-current="page" class="font-normal text-foreground-default">{props.breadcrumbCurrent}</span>
      </nav>
      <Show when={props.showSearch}>
        <div class="ml-4 flex h-8 w-full max-w-xs items-center gap-2 rounded-lg border border-border-default bg-background-default px-3 focus-within:ring-2 focus-within:ring-focus-ring-primary">
          <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d={ICON_PATHS.search} stroke-linecap="round" />
          </svg>
          <input
            type="search"
            value={props.searchValue}
            placeholder={props.searchPlaceholder}
            aria-label={props.searchPlaceholder}
            class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-muted"
            onInput={(event) => props.onSearchChange && props.onSearchChange(event.target.value)}
          />
        </div>
      </Show>
      <div class="ml-auto flex flex-1 items-center justify-end gap-2">{props.children}</div>
    </header>
  );
}
