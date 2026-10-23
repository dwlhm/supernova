<script context="module" lang="ts">
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
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let onSearchChange: TopbarProps["onSearchChange"];
  export let onToggleSidebar: TopbarProps["onToggleSidebar"];
  export let className: TopbarProps["className"] = "";
  export let showSidebarToggle: TopbarProps["showSidebarToggle"] = true;
  export let sidebarToggleLabel: TopbarProps["sidebarToggleLabel"] =
    "Toggle sidebar";
  export let showSearch: TopbarProps["showSearch"] = true;
  export let searchValue: TopbarProps["searchValue"] = "";
  export let searchPlaceholder: TopbarProps["searchPlaceholder"] = "Search";

  function handleSearch(rawValue: string) {
    if (onSearchChange) {
      onSearchChange(rawValue);
    }
  }
  function handleToggle() {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  }
</script>

<header
  class={cn(
    "flex w-full items-center gap-2.5 border-b border-components-topbar-all-color-container-border-default bg-components-topbar-all-color-container-background-default px-4 py-3",
    className
  )}
>
  {#if showSidebarToggle}
    <button
      type="button"
      class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md text-components-topbar-all-color-navigation-icon-stroke-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
      aria-label={sidebarToggleLabel}
      on:click={(event) => {
        handleToggle();
      }}
      ><svg
        aria-hidden="true"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        ><rect x="3" y="4" width="18" height="16" rx="2" /><path
          d="M9 4v16"
          stroke-linecap="round"
        /></svg
      ></button
    >
  {/if}
  {#if showSearch}
    <div
      class="flex h-8 w-full max-w-sm items-center gap-2 rounded-rounded-lg border border-components-topbar-all-color-search-border-default bg-components-topbar-all-color-search-background-default px-3"
    >
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-components-topbar-all-color-search-placeholder-foreground-default"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        ><circle cx="11" cy="11" r="7" /><path
          d="m20 20-3.5-3.5"
          stroke-linecap="round"
        /></svg
      ><input
        type="search"
        class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-components-topbar-all-color-search-placeholder-foreground-default"
        value={searchValue}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        on:input={(event) => {
          handleSearch(event.target.value);
        }}
      />
    </div>
  {/if}
  <div class="ml-auto flex items-center gap-2.5"><slot /></div>
</header>