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
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";
  import TableNoHeaderCell from "./TableNoHeaderCell.svelte";
  import TableCheckboxHeaderCell from "./TableCheckboxHeaderCell.svelte";

  export let className: TableHeaderRowProps["className"] = "";
  export let showNo: TableHeaderRowProps["showNo"] = false;
  export let showCheckbox: TableHeaderRowProps["showCheckbox"] = false;
  export let allSelected: TableHeaderRowProps["allSelected"] = false;
  export let checkboxAriaLabel: TableHeaderRowProps["checkboxAriaLabel"] =
    "Select all rows";
  export let onSelectAll: TableHeaderRowProps["onSelectAll"];

  export let columns: TableHeaderRowProps["columns"] = [];
</script>

<tr
  data-ctrl={typeof bindControllerProps}
  class={cn("border-b border-border-default bg-background-muted", className)}
>
  {#if showNo}
    <TableNoHeaderCell />
  {/if}
  {#if showCheckbox}
    <TableCheckboxHeaderCell
      checked={allSelected}
      ariaLabel={checkboxAriaLabel}
      onCheckedChange={(checked) => onSelectAll && onSelectAll(checked)}
    />
  {/if}
  {#if $$slots.default}
    <slot />
  {/if}
  {#if !$$slots.default}
    {#each columns as column (column.id)}
      <th
        scope="col"
        class={cn(
          "whitespace-nowrap bg-background-muted px-4 py-3 text-sm font-medium text-foreground-default",
          cva(
            column.align,
            {
              left: "text-left",
              center: "text-center",
              right: "text-right",
            },
            "left"
          )
        )}>{column.label}</th
      >
    {/each}
  {/if}</tr
>