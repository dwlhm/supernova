<script context="module" lang="ts">
  export interface TableColumn {
    id: string;
    label: string;
    align?: "left" | "center" | "right";
  }

  export interface TableRowData {
    id: string;
    cells: TableCellInput[];
    selected?: boolean;
  }

  export interface TableProps {
    state?: "default" | "empty";
    columns?: TableColumn[];
    rows?: TableRowData[];
    caption?: string;
    showCheckbox?: boolean;
    showNo?: boolean;
    showPagination?: boolean;
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    rowsPerPageLabel?: string;
    emptyTitle?: string;
    emptyBody?: string;
    emptyCtaLabel?: string;
    showEmptyCta?: boolean;
    showEmptyIcon?: boolean;
    showEmptyTitle?: boolean;
    showEmptyDescription?: boolean;
    className?: string;

    onRowSelect?: (rowId: string, checked: boolean) => void;
    onSelectAll?: (checked: boolean) => void;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onEmptyCtaClick?: () => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import {
    cn,
    getTableState,
    ICON_PATHS,
    bindControllerProps,
    TableCellInput,
  } from "./utils";
  import TableHeaderRow from "./TableHeaderRow.svelte";
  import TableBodyRow from "./TableBodyRow.svelte";
  import Pagination from "./Pagination.svelte";

  export let className: TableProps["className"] = "";
  export let showEmptyIcon: TableProps["showEmptyIcon"] = true;
  export let showEmptyTitle: TableProps["showEmptyTitle"] = true;
  export let emptyTitle: TableProps["emptyTitle"] = "No Data Available";
  export let showEmptyDescription: TableProps["showEmptyDescription"] = true;
  export let emptyBody: TableProps["emptyBody"] =
    "There's nothing here yet. Try adding some data or adjusting your filters.";
  export let showEmptyCta: TableProps["showEmptyCta"] = true;
  export let onEmptyCtaClick: TableProps["onEmptyCtaClick"];
  export let emptyCtaLabel: TableProps["emptyCtaLabel"] = "Add Data";
  export let caption: TableProps["caption"] = "Data table";
  export let showCheckbox: TableProps["showCheckbox"] = false;
  export let showNo: TableProps["showNo"] = false;
  export let onSelectAll: TableProps["onSelectAll"];
  export let onRowSelect: TableProps["onRowSelect"];
  export let showPagination: TableProps["showPagination"] = true;
  export let rowsPerPageLabel: TableProps["rowsPerPageLabel"] = "Rows per page";
  export let pageSize: TableProps["pageSize"] = 10;
  export let onPageSizeChange: TableProps["onPageSizeChange"];
  export let currentPage: TableProps["currentPage"] = 2;
  export let totalPages: TableProps["totalPages"] = 10;
  export let onPageChange: TableProps["onPageChange"];
  export let state: TableProps["state"] = 'default';
  export let columns: TableProps["columns"] = [];
  export let rows: TableProps["rows"] = [];
  $: props = { className, showEmptyIcon, showEmptyTitle, emptyTitle, showEmptyDescription, emptyBody, showEmptyCta, onEmptyCtaClick, emptyCtaLabel, caption, showCheckbox, showNo, onSelectAll, onRowSelect, showPagination, rowsPerPageLabel, pageSize, onPageSizeChange, currentPage, totalPages, onPageChange, state, columns, rows };
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "w-full overflow-x-auto rounded-lg bg-background-default",
    getTableState(props).isEmpty && !$$slots.default
      ? ""
      : "border border-border-default",
    className
  )}
>
  {#if getTableState(props).isEmpty && !$$slots.default}
    <div
      class="flex flex-col items-center justify-center gap-4 px-8 py-10 text-center"
    >
      {#if showEmptyIcon}
        <span
          class="flex h-16 w-16 items-center justify-center rounded-full bg-background-muted"
          aria-hidden="true"
          ><svg
            class="h-7 w-7 text-foreground-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d={ICON_PATHS.search}
            /></svg
          ></span
        >
      {/if}
      <div class="flex flex-col items-center gap-2">
        {#if showEmptyTitle}
          <span class="text-base font-semibold text-foreground-default"
            >{emptyTitle}</span
          >
        {/if}
        {#if showEmptyDescription}
          <span class="max-w-sm text-sm text-foreground-muted">{emptyBody}</span
          >
        {/if}
      </div>
      {#if showEmptyCta}
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-lg bg-secondary-default px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          on:click={(event) => {
            onEmptyCtaClick && onEmptyCtaClick();
          }}>{emptyCtaLabel}</button
        >
      {/if}
    </div>
  {/if}
  {#if !getTableState(props).isEmpty || Boolean($$slots.default)}
    <table class="w-full border-collapse">
      <caption class="sr-only">{caption}</caption>
      {#if $$slots.default}
        <slot />
      {/if}
      {#if !$$slots.default}
        <thead
          ><TableHeaderRow
            columns={getTableState(props).columns}
            {showCheckbox}
            {showNo}
            allSelected={getTableState(props).allSelected}
            onSelectAll={(checked) => onSelectAll && onSelectAll(checked)}
          /></thead
        >
        <tbody>
          {#each getTableState(props).rows as row, index (row.id)}
            <TableBodyRow
              rowId={row.id}
              cells={row.cells}
              columns={getTableState(props).columns}
              no={index + 1}
              {showNo}
              {showCheckbox}
              checked={row.selected}
              checkboxAriaLabel={"Select row " + (index + 1)}
              onSelect={(rowId, checked) =>
                onRowSelect && onRowSelect(rowId, checked)}
            />
          {/each}
        </tbody>
      {/if}
    </table>

    {#if showPagination}
      <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div class="flex items-center gap-2">
          <span class="pr-2 text-sm text-foreground-default"
            >{rowsPerPageLabel}</span
          ><select
            class="h-9 rounded-lg border border-border-default bg-background-default px-3 text-sm font-medium text-foreground-default shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            aria-label={rowsPerPageLabel}
            value={String(pageSize)}
            on:change={(event) => {
              onPageSizeChange && onPageSizeChange(Number(event.target.value));
            }}
          >
            {#each getTableState(props).pageSizeOptions as opt (opt)}
              <option value={String(opt)}>{opt}</option>
            {/each}
          </select>
        </div>
        <Pagination
          {currentPage}
          {totalPages}
          onPageChange={(page) => onPageChange && onPageChange(page)}
        />
      </div>
    {/if}
  {/if}
</div>