<script context="module" lang="ts">
  export interface TableBodyRowProps {
    selected?: boolean;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let selected: TableBodyRowProps["selected"] = false;
  export let className: TableBodyRowProps["className"] = "";
</script>

<tr
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "border-b border-border-default transition-colors hover:bg-background-subtle",
    selected ? "bg-primary-subtle" : "bg-background-default",
    className
  )}><slot /></tr
>