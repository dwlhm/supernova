<script context="module" lang="ts">
  export interface TableBodyRowProps {
    rowId?: string;
    cells?: TableCellInput[];
    columns?: TableColItem[];
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
  interface $$Slots {
    default: Record<string, never>;
  }
  import {
    cn,
    bindControllerProps,
    getTableBodyRowCells,
    TableColItem,
    TableCellInput,
  } from "./utils";
  import TableNoBodyCell from "./TableNoBodyCell.svelte";
  import TableCheckboxBodyCell from "./TableCheckboxBodyCell.svelte";
  import TableBodyCell from "./TableBodyCell.svelte";

  export let className: TableBodyRowProps["className"] = "";
  export let showNo: TableBodyRowProps["showNo"] = false;
  export let no: TableBodyRowProps["no"] = 1;
  export let showCheckbox: TableBodyRowProps["showCheckbox"] = false;
  export let checked: TableBodyRowProps["checked"] = false;
  export let rowId: TableBodyRowProps["rowId"] = "";
  export let checkboxAriaLabel: TableBodyRowProps["checkboxAriaLabel"] =
    "Select row";
  export let onSelect: TableBodyRowProps["onSelect"];

  export let cells: TableBodyRowProps["cells"] = [];
  export let columns: TableBodyRowProps["columns"] = [];
</script>

<tr
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "border-b border-border-default bg-background-default transition-colors hover:bg-background-subtle",
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
      onCheckedChange={(rowId, checked) => onSelect && onSelect(rowId, checked)}
    />
  {/if}
  {#if $$slots.default}
    <slot />
  {/if}
  {#if !$$slots.default}
    {#each getTableBodyRowCells(cells, columns) as cell, index (index)}
      <TableBodyCell
        value={cell.value}
        secondaryValue={cell.secondaryValue}
        badgeLabel={cell.badgeLabel}
        buttonLabel={cell.buttonLabel}
        statusLabel={cell.statusLabel}
        imageSrc={cell.imageSrc}
        avatarInitials={cell.avatarInitials}
        href={cell.href}
        align={cell.align}
      />
    {/each}
  {/if}</tr
>