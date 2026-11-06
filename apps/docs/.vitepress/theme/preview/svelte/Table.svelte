<script context="module" lang="ts">
  export interface TableProps {
    caption?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let className: TableProps["className"] = "";
  export let caption: TableProps["caption"] = "Data table";
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "w-full overflow-x-auto rounded-lg border border-border-default bg-background-default",
    className
  )}
>
  <table class="w-full border-collapse">
    {#if caption}
      <caption class="sr-only">{caption}</caption>
    {/if}<slot />
  </table>
</div>