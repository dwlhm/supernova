<script context="module" lang="ts">
  export interface ChartLegendEntry {
    label: string;
    colorClass: string;
  }

  export interface ChartDataPoint {
    label: string;
    value?: number;
    values?: number[];
  }

  export interface ChartProps {
    type?: "bar" | "line" | "area" | "pie" | "donut";
    title?: string;
    description?: string;
    showTitle?: boolean;
    showDescription?: boolean;
    showTooltip?: boolean;
    legend?: ChartLegendEntry[];
    data?: ChartDataPoint[];
    showLegend?: boolean;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";
  import ChartLegend from "./ChartLegend.svelte";
  import ChartBar from "./ChartBar.svelte";
  import ChartLine from "./ChartLine.svelte";
  import ChartPie from "./ChartPie.svelte";

  export let className: ChartProps["className"] = "";
  export let showTitle: ChartProps["showTitle"] = true;
  export let showDescription: ChartProps["showDescription"] = true;
  export let title: ChartProps["title"] = "Revenue Overview";
  export let description: ChartProps["description"] =
    "Weekly revenue breakdown by day";

  export let type: ChartProps["type"] = "bar";
  export let data: ChartProps["data"] = [];
  export let showTooltip: ChartProps["showTooltip"] = true;
  export let showLegend: ChartProps["showLegend"] = true;
  export let legend: ChartProps["legend"] = [];
</script>

<figure
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex w-full flex-col gap-4 rounded-lg border border-border-default bg-background-default p-5 shadow-sm",
    className
  )}
>
  {#if showTitle || showDescription}
    <figcaption class="flex flex-col gap-1">
      {#if showTitle}
        <span class="text-base leading-6 font-semibold text-foreground-default"
          >{title}</span
        >
      {/if}
      {#if showDescription}
        <span class="text-sm text-foreground-muted">{description}</span>
      {/if}
    </figcaption>
  {/if}
  {#if $$slots.default}
    <div class="w-full"><slot /></div>
  {/if}
  {#if !$$slots.default}
    <div class="w-full">
      {#if type === "bar"}
        <ChartBar {data} {showTooltip} ariaLabel={title} />
      {/if}
      {#if type === "line" || type === "area"}
        <ChartLine
          {data}
          area={type === "area"}
          {showTooltip}
          ariaLabel={title}
        />
      {/if}
      {#if type === "pie" || type === "donut"}
        <ChartPie
          {data}
          innerRadius={type === "donut" ? 30 : 0}
          {showTooltip}
          ariaLabel={title}
        />
      {/if}
    </div>
  {/if}
  {#if showLegend}
    <ChartLegend items={legend} />
  {/if}
</figure>