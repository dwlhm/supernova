<script context="module" lang="ts">
  export interface TableHeaderColumn {
    id: string;
    label: string;
    align?: "left" | "center" | "right";
  }

  export interface TableHeaderRowProps {
    columns?: TableHeaderColumn[];
    showCheckbox?: boolean;
    showNo?: boolean;
    allSelected?: boolean;
    checkboxAriaLabel?: string;
    className?: string;
    onSelectAll?: (checked: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";
  import TableNoHeaderCell from "./TableNoHeaderCell.svelte";
  import TableCheckboxHeaderCell from "./TableCheckboxHeaderCell.svelte";

  export let onSelectAll: TableHeaderRowProps["onSelectAll"];
  export let className: TableHeaderRowProps["className"] = "";
  export let showNo: TableHeaderRowProps["showNo"] = false;
  export let showCheckbox: TableHeaderRowProps["showCheckbox"] = false;
  export let allSelected: TableHeaderRowProps["allSelected"] = false;
  export let checkboxAriaLabel: TableHeaderRowProps["checkboxAriaLabel"] =
    "Select all rows";
  export let columns: TableHeaderRowProps["columns"] = [];

  function alignmentClasses(align: string) {
    if (align === "center") {
      return "text-center";
    }
    if (align === "right") {
      return "text-right";
    }
    return "text-left";
  }
  function handleSelectAll(checked: boolean) {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  }
</script>

<tr
  class={cn(
    "border-b border-components-table-default-color-divider-border-default",
    className
  )}
>
  {#if showNo}
    <TableNoHeaderCell />
  {/if}
  {#if showCheckbox}
    <TableCheckboxHeaderCell
      checked={allSelected}
      ariaLabel={checkboxAriaLabel}
      onCheckedChange={(checked) => handleSelectAll(checked)}
    />
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
</tr>