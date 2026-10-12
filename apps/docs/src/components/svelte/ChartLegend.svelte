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
  import { cn } from "./utils";

  export let className: ChartLegendProps["className"] = "";
  export let items: ChartLegendProps["items"] = [];

  $: dotClasses = () => {
    return "h-2 w-2 shrink-0 rounded-rounded-full";
  };
</script>

<ul class={cn("flex flex-wrap items-center gap-4", className)}>
  {#each items as item (item.label)}
    <li class="flex items-center gap-2">
      <span aria-hidden="true" class={cn(dotClasses(), item.colorClass)} /><span
        class="text-xs text-components-chart-all-color-legend-label-text-default"
        >{item.label}</span
      >
    </li>
  {/each}
</ul>