<script context="module" lang="ts">
  export interface TableNoBodyCellProps {
    no?: number;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let className: TableNoBodyCellProps["className"] = "";
  export let no: TableNoBodyCellProps["no"] = 1;
</script>

<td
  class={cn(
    "w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center text-sm text-components-table-default-color-cell-foreground-muted",
    className
  )}>{no}</td
>