<script context="module" lang="ts">
  export interface TableBodyCellProps {
    align?: "left" | "center" | "right";
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";

  export let align: TableBodyCellProps["align"] = "left";
  export let className: TableBodyCellProps["className"] = "";
</script>

<td
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "border-t border-border-default px-4 py-3 align-middle text-sm font-normal text-foreground-default",
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
  )}><slot /></td
>