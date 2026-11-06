<script context="module" lang="ts">
  export interface TableHeaderCellProps {
    align?: "left" | "center" | "right";
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let align: TableHeaderCellProps["align"] = "left";
  export let className: TableHeaderCellProps["className"] = "";
</script>

<th
  scope="col"
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "px-4 py-3 text-sm font-medium text-foreground-muted",
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left",
    className
  )}><slot /></th
>