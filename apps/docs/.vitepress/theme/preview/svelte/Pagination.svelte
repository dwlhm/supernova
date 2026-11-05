<script context="module" lang="ts">
  export interface PaginationEntry {
    key: string;
    label: string;
    page: number;
    isCurrent: boolean;
    isEllipsis: boolean;
  }

  export interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    previousLabel?: string;
    nextLabel?: string;
    className?: string;
    onPageChange?: (page: number) => void;
  }
</script>

<script lang="ts">
  import {
    cn,
    getPaginationState,
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let className: PaginationProps["className"] = "";
  export let currentPage: PaginationProps["currentPage"] = 1;
  export let totalPages: PaginationProps["totalPages"] = 1;
  export let previousLabel: PaginationProps["previousLabel"] = "Previous";
  export let onPageChange: PaginationProps["onPageChange"];
  export let nextLabel: PaginationProps["nextLabel"] = "Next";
</script>

<nav
  aria-label="Pagination"
  data-ctrl={typeof bindControllerProps}
  class={cn("flex items-center gap-1", className)}
>
  <button
    type="button"
    class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
    disabled={!getPaginationState(currentPage, totalPages).canPrev}
    aria-label={previousLabel}
    on:click={(event) => {
      getPaginationState(currentPage, totalPages).canPrev &&
        onPageChange &&
        onPageChange(getPaginationState(currentPage, totalPages).current - 1);
    }}
    ><svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={ICON_PATHS.chevronLeft}
      /></svg
    ><span class="hidden sm:inline">{previousLabel}</span></button
  >
  <ol class="flex items-center gap-1">
    {#each getPaginationState(currentPage, totalPages).entries as entry (entry.key)}
      <li>
        {#if entry.isEllipsis}
          <span
            class="inline-flex h-9 w-9 items-center justify-center text-sm text-foreground-default"
            aria-hidden="true">{entry.label}</span
          >
        {/if}
        {#if !entry.isEllipsis}
          <button
            type="button"
            aria-current={entry.isCurrent ? "page" : undefined}
            aria-label={"Page " + entry.label}
            class={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
              entry.isCurrent
                ? "border-border-default bg-background-default text-foreground-default shadow-xs"
                : "border-transparent bg-transparent text-foreground-default hover:bg-background-muted"
            )}
            on:click={(event) => {
              !entry.isCurrent && onPageChange && onPageChange(entry.page);
            }}>{entry.label}</button
          >
        {/if}
      </li>
    {/each}
  </ol>
  <button
    type="button"
    class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
    disabled={!getPaginationState(currentPage, totalPages).canNext}
    aria-label={nextLabel}
    on:click={(event) => {
      getPaginationState(currentPage, totalPages).canNext &&
        onPageChange &&
        onPageChange(getPaginationState(currentPage, totalPages).current + 1);
    }}
    ><span class="hidden sm:inline">{nextLabel}</span><svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={ICON_PATHS.chevronRight}
      /></svg
    ></button
  >
</nav>