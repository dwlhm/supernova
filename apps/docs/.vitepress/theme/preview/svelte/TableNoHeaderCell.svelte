<script context="module" lang="ts">
  export interface TableNoHeaderCellProps {
    label?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let className: TableNoHeaderCellProps["className"] = "";
  export let label: TableNoHeaderCellProps["label"] = "No.";
</script>

<th
  scope="col"
  class={cn(
    "w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default",
    className
  )}>{label}</th
>