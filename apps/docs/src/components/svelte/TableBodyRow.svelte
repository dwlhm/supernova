<script context="module" lang="ts">
  export interface TableBodyRowProps {
    rowId?: string;
    cells?: string[];
    no?: number;
    showNo?: boolean;
    showCheckbox?: boolean;
    checked?: boolean;
    checkboxAriaLabel?: string;
    className?: string;
    onSelect?: (rowId: string, checked: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";
  import TableNoBodyCell from "./TableNoBodyCell.svelte";
  import TableCheckboxBodyCell from "./TableCheckboxBodyCell.svelte";
  import TableBodyCell from "./TableBodyCell.svelte";

  export let onSelect: TableBodyRowProps["onSelect"];
  export let className: TableBodyRowProps["className"] = "";
  export let showNo: TableBodyRowProps["showNo"] = false;
  export let no: TableBodyRowProps["no"] = 1;
  export let showCheckbox: TableBodyRowProps["showCheckbox"] = false;
  export let checked: TableBodyRowProps["checked"] = false;
  export let rowId: TableBodyRowProps["rowId"] = "";
  export let checkboxAriaLabel: TableBodyRowProps["checkboxAriaLabel"] =
    "Select row";
  export let cells: TableBodyRowProps["cells"] = [];

  function handleSelect(rowId: string, checked: boolean) {
    if (onSelect) {
      onSelect(rowId, checked);
    }
  }
</script>

<tr
  class={cn(
    "bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle",
    className
  )}
>
  {#if showNo}
    <TableNoBodyCell {no} />
  {/if}
  {#if showCheckbox}
    <TableCheckboxBodyCell
      {checked}
      {rowId}
      ariaLabel={checkboxAriaLabel}
      onCheckedChange={(rowId, checked) => handleSelect(rowId, checked)}
    />
  {/if}
  {#each cells as cell, index (index)}
    <TableBodyCell value={cell} />
  {/each}
</tr>