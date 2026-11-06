<script context="module" lang="ts">
  export interface TableHeaderRowProps {
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let className: TableHeaderRowProps["className"] = "";
</script>

<tr
  data-ctrl={typeof bindControllerProps}
  class={cn("border-b border-border-default bg-background-subtle", className)}
  ><slot /></tr
>