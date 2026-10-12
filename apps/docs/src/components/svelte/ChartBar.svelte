<script context="module" lang="ts">
  export interface ChartPoint {
    label: string;
    value: number;
  }

  export interface ChartBarProps {
    data?: ChartPoint[];
    colorClass?: string;
    showGridLines?: boolean;
    showDataLabels?: boolean;
    showAxisLabels?: boolean;
    ariaLabel?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let data: ChartBarProps["data"] = [];
  export let className: ChartBarProps["className"] = "";
  export let ariaLabel: ChartBarProps["ariaLabel"] = "Bar chart";
  export let showGridLines: ChartBarProps["showGridLines"] = true;
  export let colorClass: ChartBarProps["colorClass"] = "bg-chart-series-1";
  export let showAxisLabels: ChartBarProps["showAxisLabels"] = true;
  export let showDataLabels: ChartBarProps["showDataLabels"] = true;
  function stringifyStyles(stylesObj) {
    let styles = "";
    for (let key in stylesObj) {
      const dashedKey = key.replace(/[A-Z]/g, function (match) {
        return "-" + match.toLowerCase();
      });
      styles += dashedKey + ":" + stylesObj[key] + ";";
    }
    return styles;
  }

  function barHeight(value: number) {
    const rows: ChartPoint[] = data || [];
    let max = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].value > max) {
        max = rows[i].value;
      }
    }
    if (max <= 0) {
      return "0%";
    }
    const pct = (value / max) * 100;
    if (pct < 0) {
      return "0%";
    }
    return pct + "%";
  }
</script>

<div class={cn("flex w-full flex-col gap-2", className)}>
  <div
    class="relative flex h-44 w-full items-end gap-2"
    role="img"
    aria-label={ariaLabel}
  >
    {#if showGridLines}
      <div
        class="pointer-events-none absolute inset-0 flex flex-col justify-between"
        aria-hidden="true"
      >
        <div
          class="border-t border-components-chart-all-color-grid-line-stroke-default"
        />
        <div
          class="border-t border-components-chart-all-color-grid-line-stroke-default"
        />
        <div
          class="border-t border-components-chart-all-color-grid-line-stroke-default"
        />
        <div
          class="border-t border-components-chart-all-color-grid-line-stroke-default"
        />
        <div
          class="border-t border-components-chart-all-color-grid-line-stroke-default"
        />
      </div>
    {/if}
    {#each data as point (point.label)}
      <div class="relative flex h-full flex-1 items-end">
        <div
          style={stringifyStyles({
            height: barHeight(point.value),
          })}
          class={cn("w-full rounded-rounded-sm", colorClass)}
        />
      </div>
    {/each}
  </div>
  {#if showAxisLabels}
    <div class="flex w-full items-start gap-2">
      {#each data as point (point.label)}
        <span
          class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
        >
          {#if showDataLabels}
            <span
              class="text-xs font-medium text-components-chart-all-color-data-label-text-default"
              >{point.value}</span
            >
          {/if}<span
            class="w-full truncate text-xs text-components-chart-all-color-axis-label-text-default"
            >{point.label}</span
          ></span
        >
      {/each}
    </div>
  {/if}
</div>