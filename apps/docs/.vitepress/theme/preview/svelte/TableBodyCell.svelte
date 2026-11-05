<script context="module" lang="ts">
  export interface TableBodyCellProps {
    value?: string;
    secondaryValue?: string;
    badgeLabel?: string;
    buttonLabel?: string;
    statusLabel?: string;
    imageSrc?: string;
    avatarInitials?: string;
    href?: string;
    align?: "left" | "center" | "right";
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";
  import TableCellValue from "./TableCellValue.svelte";

  export let align: TableBodyCellProps["align"] = "left";
  export let className: TableBodyCellProps["className"] = "";

  export let value: TableBodyCellProps["value"] = "Cell Value";
  export let secondaryValue: TableBodyCellProps["secondaryValue"] = "";
  export let badgeLabel: TableBodyCellProps["badgeLabel"] = "";
  export let buttonLabel: TableBodyCellProps["buttonLabel"] = "";
  export let statusLabel: TableBodyCellProps["statusLabel"] = "";
  export let imageSrc: TableBodyCellProps["imageSrc"] = "";
  export let avatarInitials: TableBodyCellProps["avatarInitials"] = "";
  export let href: TableBodyCellProps["href"] = "";
</script>

<td
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "border-t border-border-default px-4 py-3 align-middle",
    cva(
      align,
      {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      "left"
    ),
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
      {buttonLabel}
      {statusLabel}
      {imageSrc}
      {avatarInitials}
      {href}
      {align}
    />
  {/if}</td
>