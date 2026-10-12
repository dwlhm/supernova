<script context="module" lang="ts">
  export interface TableBodyCellProps {
    value?: string;
    secondaryValue?: string;
    badgeLabel?: string;
    statusLabel?: string;
    imageSrc?: string;
    avatarInitials?: string;
    href?: string;
    align?: "left" | "center" | "right";
    className?: string;
    children?: any;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";
  import TableCellValue from "./TableCellValue.svelte";

  export let align: TableBodyCellProps["align"] = "left";
  export let className: TableBodyCellProps["className"] = "";

  export let value: TableBodyCellProps["value"] = "";
  export let secondaryValue: TableBodyCellProps["secondaryValue"] = "";
  export let badgeLabel: TableBodyCellProps["badgeLabel"] = "";
  export let statusLabel: TableBodyCellProps["statusLabel"] = "";
  export let imageSrc: TableBodyCellProps["imageSrc"] = "";
  export let avatarInitials: TableBodyCellProps["avatarInitials"] = "";
  export let href: TableBodyCellProps["href"] = "";

  $: cellClasses = () => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "left":
      default:
        return "text-left";
    }
  };
</script>

<td
  class={cn(
    "border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle",
    cellClasses(),
    className
  )}
>
  {#if $$slots.default}
    <slot />
  {/if}
  {#if !$$slots.default}
    <TableCellValue
      {value}
      {secondaryValue}
      {badgeLabel}
      {statusLabel}
      {imageSrc}
      {avatarInitials}
      {href}
      {align}
    />
  {/if}</td
>