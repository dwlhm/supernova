<script context="module" lang="ts">
  export interface ChartLegendEntry {
    label: string;
    colorClass: string;
  }

  export interface ChartProps {
    title?: string;
    description?: string;
    showTitle?: boolean;
    showDescription?: boolean;
    legend?: ChartLegendEntry[];
    showLegend?: boolean;
    className?: string;
    children?: any;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";
  import ChartLegend from "./ChartLegend.svelte";

  export let showTitle: ChartProps["showTitle"] = true;
  export let showDescription: ChartProps["showDescription"] = true;
  export let className: ChartProps["className"] = "";
  export let title: ChartProps["title"] = "Revenue Overview";
  export let description: ChartProps["description"] =
    "Weekly revenue breakdown by day";
  export let showLegend: ChartProps["showLegend"] = true;
  export let legend: ChartProps["legend"] = [];

  $: hasHeading = () => {
    return showTitle || showDescription;
  };
</script>

<figure
  class={cn(
    "flex w-full flex-col gap-4 rounded-rounded-lg border border-components-chart-all-color-container-border-default bg-components-chart-all-color-container-background-default p-5",
    className
  )}
>
  {#if hasHeading()}
    <figcaption class="flex flex-col gap-1">
      {#if showTitle}
        <span
          class="text-sm font-semibold text-components-chart-all-color-title-text-default"
          >{title}</span
        >
      {/if}
      {#if showDescription}
        <span
          class="text-xs text-components-chart-all-color-description-text-default"
          >{description}</span
        >
      {/if}
    </figcaption>
  {/if}
  {#if showLegend}
    <ChartLegend items={legend} />
  {/if}
  <div class="w-full"><slot /></div>
</figure>