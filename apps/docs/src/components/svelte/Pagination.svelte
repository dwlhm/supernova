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
  import { cn } from "./utils";

  export let totalPages: PaginationProps["totalPages"] = 1;
  export let currentPage: PaginationProps["currentPage"] = 1;
  export let onPageChange: PaginationProps["onPageChange"];
  export let className: PaginationProps["className"] = "";
  export let previousLabel: PaginationProps["previousLabel"] = "Previous";
  export let nextLabel: PaginationProps["nextLabel"] = "Next";

  function goTo(page: number) {
    const total = totalPages > 0 ? totalPages : 1;
    let current = currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    if (page < 1 || page > total || page === current) {
      return;
    }
    if (onPageChange) {
      onPageChange(page);
    }
  }
  $: currentPageSafe = () => {
    const total = totalPages > 0 ? totalPages : 1;
    const current = currentPage;
    if (current < 1) {
      return 1;
    }
    if (current > total) {
      return total;
    }
    return current;
  };
  $: canGoPrevious = () => {
    const total = totalPages > 0 ? totalPages : 1;
    let current = currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    return current > 1;
  };
  $: canGoNext = () => {
    const total = totalPages > 0 ? totalPages : 1;
    let current = currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    return current < total;
  };
  $: entries = () => {
    const total = totalPages > 0 ? totalPages : 1;
    let current = currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    const rows: PaginationEntry[] = [];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    rows.push({
      key: "page-1",
      label: "1",
      page: 1,
      isCurrent: current === 1,
      isEllipsis: false,
    });
    if (start > 2) {
      rows.push({
        key: "ellipsis-start",
        label: "...",
        page: 0,
        isCurrent: false,
        isEllipsis: true,
      });
    }
    for (let i = start; i <= end; i++) {
      rows.push({
        key: "page-" + i,
        label: String(i),
        page: i,
        isCurrent: i === current,
        isEllipsis: false,
      });
    }
    if (end < total - 1) {
      rows.push({
        key: "ellipsis-end",
        label: "...",
        page: 0,
        isCurrent: false,
        isEllipsis: true,
      });
    }
    if (total > 1) {
      rows.push({
        key: "page-" + total,
        label: String(total),
        page: total,
        isCurrent: current === total,
        isEllipsis: false,
      });
    }
    return rows;
  };
</script>

<nav aria-label="Pagination" class={cn("flex items-center gap-1", className)}>
  <button
    type="button"
    class="inline-flex h-9 items-center gap-1 rounded-rounded-lg border border-components-pagination-active-color-page-item-border-default bg-components-pagination-active-color-page-item-background-default px-3 text-sm font-medium text-components-pagination-default-color-label-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
    disabled={!canGoPrevious()}
    aria-label={previousLabel}
    on:click={(event) => {
      goTo(currentPageSafe() - 1);
    }}
    ><svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      ><path
        d="m14 6-6 6 6 6"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    ><span class="hidden sm:inline">{previousLabel}</span></button
  >
  <ol class="flex items-center gap-1">
    {#each entries() as entry (entry.key)}
      <li>
        {#if entry.isEllipsis}
          <span
            class="inline-flex h-9 w-9 items-center justify-center text-sm text-components-pagination-default-color-label-foreground-default"
            aria-hidden="true">{entry.label}</span
          >
        {/if}
        {#if !entry.isEllipsis}
          <button
            type="button"
            aria-current={entry.isCurrent ? "page" : undefined}
            aria-label={"Page " + entry.label}
            class={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
              entry.isCurrent
                ? "border-components-pagination-active-color-page-item-border-default bg-components-pagination-active-color-page-item-background-default text-components-pagination-default-color-label-foreground-default"
                : "border-transparent bg-transparent text-components-pagination-default-color-label-foreground-default hover:bg-background-muted"
            )}
            on:click={(event) => {
              goTo(entry.page);
            }}>{entry.label}</button
          >
        {/if}
      </li>
    {/each}
  </ol>
  <button
    type="button"
    class="inline-flex h-9 items-center gap-1 rounded-rounded-lg border border-components-pagination-active-color-page-item-border-default bg-components-pagination-active-color-page-item-background-default px-3 text-sm font-medium text-components-pagination-default-color-label-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
    disabled={!canGoNext()}
    aria-label={nextLabel}
    on:click={(event) => {
      goTo(currentPageSafe() + 1);
    }}
    ><span class="hidden sm:inline">{nextLabel}</span><svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      ><path
        d="m10 6 6 6-6 6"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    ></button
  >
</nav>