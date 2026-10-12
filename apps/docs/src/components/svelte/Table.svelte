<script context="module" lang="ts">
  export interface TableColumn {
    id: string;
    label: string;
    align?: "left" | "center" | "right";
  }

  export interface TableRowData {
    id: string;
    cells: string[];
    selected?: boolean;
  }

  export interface TableProps {
    columns?: TableColumn[];
    rows?: TableRowData[];
    caption?: string;
    showCheckbox?: boolean;
    showNo?: boolean;
    emptyTitle?: string;
    emptyBody?: string;
    emptyCtaLabel?: string;
    showEmptyCta?: boolean;
    showEmptyIcon?: boolean;
    showEmptyTitle?: boolean;
    className?: string;
    onRowSelect?: (rowId: string, checked: boolean) => void;
    onSelectAll?: (checked: boolean) => void;
    onEmptyCtaClick?: () => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let columns: TableProps["columns"] = [];
  export let showNo: TableProps["showNo"] = false;
  export let showCheckbox: TableProps["showCheckbox"] = false;
  export let rows: TableProps["rows"] = [];
  export let onRowSelect: TableProps["onRowSelect"];
  export let onSelectAll: TableProps["onSelectAll"];
  export let onEmptyCtaClick: TableProps["onEmptyCtaClick"];
  export let className: TableProps["className"] = "";
  export let caption: TableProps["caption"] = "Data table";
  export let showEmptyIcon: TableProps["showEmptyIcon"] = true;
  export let showEmptyTitle: TableProps["showEmptyTitle"] = true;
  export let emptyTitle: TableProps["emptyTitle"] = "No data available";
  export let emptyBody: TableProps["emptyBody"] =
    "There's nothing here yet. Try adding some data or adjusting your filters.";
  export let showEmptyCta: TableProps["showEmptyCta"] = true;
  export let emptyCtaLabel: TableProps["emptyCtaLabel"] = "Add data";

  function alignmentClasses(align: string) {
    if (align === "center") {
      return "text-center";
    }
    if (align === "right") {
      return "text-right";
    }
    return "text-left";
  }
  function handleRowSelect(rowId: string, checked: boolean) {
    if (onRowSelect) {
      onRowSelect(rowId, checked);
    }
  }
  function handleSelectAll(checked: boolean) {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  }
  function handleEmptyCta() {
    if (onEmptyCtaClick) {
      onEmptyCtaClick();
    }
  }
  $: columnSpan = () => {
    let span = columns.length;
    if (showNo) {
      span = span + 1;
    }
    if (showCheckbox) {
      span = span + 1;
    }
    return span > 0 ? span : 1;
  };
  $: isEmpty = () => {
    return rows.length === 0;
  };
</script>

<div
  class={cn(
    "w-full overflow-x-auto rounded-rounded-lg border border-components-table-default-color-container-border-default bg-components-table-default-color-container-background-default",
    className
  )}
>
  <table class="w-full border-collapse">
    <caption class="sr-only">{caption}</caption><thead
      ><tr
        class="border-b border-components-table-default-color-divider-border-default"
      >
        {#if showNo}
          <th
            scope="col"
            class="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default"
          >
            No.
          </th>
        {/if}
        {#if showCheckbox}
          <th
            scope="col"
            class="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center"
            ><input
              type="checkbox"
              aria-label="Select all rows"
              class="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              on:change={(event) => {
                handleSelectAll(true);
              }}
            /></th
          >
        {/if}
        {#each columns as column (column.id)}
          <th
            scope="col"
            class={cn(
              "whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default",
              alignmentClasses(column.align)
            )}>{column.label}</th
          >
        {/each}
      </tr></thead
    ><tbody>
      {#if isEmpty()}
        <tr
          ><td class="px-8 py-10" colspan={columnSpan()}
            ><div class="flex flex-col items-center gap-4 text-center">
              {#if showEmptyIcon}
                <span
                  class="flex h-16 w-16 items-center justify-center rounded-rounded-full bg-components-table-empty-color-icon-container-background-default"
                  aria-hidden="true"
                  ><svg
                    class="h-7 w-7 text-components-table-empty-color-icon-stroke-default"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    ><path
                      d="M4 7h16M4 12h16M4 17h10"
                      stroke-linecap="round"
                    /></svg
                  ></span
                >
              {/if}
              <div class="flex flex-col items-center gap-2">
                {#if showEmptyTitle}
                  <span
                    class="text-base font-semibold text-components-table-empty-color-title-foreground-default"
                    >{emptyTitle}</span
                  >
                {/if}<span
                  class="max-w-sm text-sm text-components-table-empty-color-body-foreground-default"
                  >{emptyBody}</span
                >
              </div>
              {#if showEmptyCta}
                <button
                  type="button"
                  class="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-primary-color-container-background-default px-4 text-sm font-medium text-components-button-primary-color-label-foreground-default transition-colors hover:bg-components-button-primary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  on:click={(event) => {
                    handleEmptyCta();
                  }}>{emptyCtaLabel}</button
                >
              {/if}
            </div></td
          ></tr
        >
      {/if}
      {#each rows as row, index (row.id)}
        <tr
          class="bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle"
        >
          {#if showNo}
            <td
              class="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center text-sm text-components-table-default-color-cell-foreground-muted"
              >{index + 1}</td
            >
          {/if}
          {#if showCheckbox}
            <td
              class="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center"
              ><input
                type="checkbox"
                class="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                checked={row.selected}
                aria-label={"Select row " + (index + 1)}
                on:change={(event) => {
                  handleRowSelect(row.id, !row.selected);
                }}
              /></td
            >
          {/if}
          {#each row.cells as cell, cellIndex (cellIndex)}
            <td
              class="border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle text-sm text-components-table-default-color-cell-foreground-default"
              >{cell}</td
            >
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>