<script context="module" lang="ts">
  export interface ChartLegendItem {
    label: string;
    colorClass: string;
  }

  export interface ChartLegendProps {
    items?: ChartLegendItem[];
    className?: string;
  }
</script>

<script lang="ts">
  import { cn, bindControllerProps } from "./utils";

  export let className: ChartLegendProps["className"] = "";
  export let items: ChartLegendProps["items"] = [];
</script>

<ul
  data-ctrl={typeof bindControllerProps}
  class={cn("flex flex-wrap items-center gap-4", className)}
>
  {#each items as item (item.label)}
    <li class="flex items-center gap-2">
      <span
        aria-hidden="true"
        class={cn("h-2 w-2 shrink-0 rounded-full", item.colorClass)}
      /><span class="text-xs text-foreground-muted">{item.label}</span>
    </li>
  {/each}
</ul>