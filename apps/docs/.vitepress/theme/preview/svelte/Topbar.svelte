<script context="module" lang="ts">
  export interface TopbarProps {
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchValue?: string;
    showSidebarToggle?: boolean;
    sidebarToggleLabel?: string;
    breadcrumbRoot?: string;
    breadcrumbCurrent?: string;
    className?: string;

    onSearchChange?: (value: string) => void;
    onToggleSidebar?: () => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, ICON_PATHS, bindControllerProps } from "./utils";

  export let className: TopbarProps["className"] = "";
  export let showSidebarToggle: TopbarProps["showSidebarToggle"] = true;
  export let sidebarToggleLabel: TopbarProps["sidebarToggleLabel"] =
    "Toggle sidebar";
  export let onToggleSidebar: TopbarProps["onToggleSidebar"];
  export let breadcrumbRoot: TopbarProps["breadcrumbRoot"] = "Home";
  export let breadcrumbCurrent: TopbarProps["breadcrumbCurrent"] = "Breadcrumb";
  export let showSearch: TopbarProps["showSearch"] = false;
  export let searchValue: TopbarProps["searchValue"] = "";
  export let searchPlaceholder: TopbarProps["searchPlaceholder"] = "Search";
  export let onSearchChange: TopbarProps["onSearchChange"];
</script>

<header
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex h-16 w-full items-center gap-2 border-b border-border-default bg-background-default px-6",
    className
  )}
>
  {#if showSidebarToggle}
    <button
      type="button"
      class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md p-2 text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
      aria-label={sidebarToggleLabel}
      on:click={(event) => {
        onToggleSidebar && onToggleSidebar();
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
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
    <span class="text-foreground-muted">{breadcrumbRoot}</span><span
      aria-hidden="true"
      class="text-foreground-muted">/</span
    ><span aria-current="page" class="font-normal text-foreground-default"
      >{breadcrumbCurrent}</span
    >
  </nav>
  {#if showSearch}
    <div
      class="ml-4 flex h-8 w-full max-w-xs items-center gap-2 rounded-lg border border-border-default bg-background-default px-3 focus-within:ring-2 focus-within:ring-focus-ring-primary"
    >
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-foreground-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        ><path stroke-linecap="round" d={ICON_PATHS.search} /></svg
      ><input
        type="search"
        class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-muted"
        value={searchValue}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        on:input={(event) => {
          onSearchChange && onSearchChange(event.target.value);
        }}
      />
    </div>
  {/if}
  <div class="ml-auto flex flex-1 items-center justify-end gap-2"><slot /></div>
</header>