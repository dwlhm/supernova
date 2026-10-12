<script context="module" lang="ts">
  export interface ChartPoint {
    label: string;
    value: number;
  }

  export interface ChartLineProps {
    data?: ChartPoint[];
    area?: boolean;
    showGridLines?: boolean;
    showDataLabels?: boolean;
    showAxisLabels?: boolean;
    strokeClass?: string;
    fillClass?: string;
    ariaLabel?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let data: ChartLineProps["data"] = [];
  export let className: ChartLineProps["className"] = "";
  export let ariaLabel: ChartLineProps["ariaLabel"] = "Line chart";
  export let showGridLines: ChartLineProps["showGridLines"] = true;
  export let area: ChartLineProps["area"] = false;
  export let fillClass: ChartLineProps["fillClass"] = "fill-chart-series-1";
  export let strokeClass: ChartLineProps["strokeClass"] =
    "stroke-chart-series-1";
  export let showAxisLabels: ChartLineProps["showAxisLabels"] = true;
  export let showDataLabels: ChartLineProps["showDataLabels"] = false;

  $: normalized = () => {
    const rows: ChartPoint[] = data || [];
    let max = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].value > max) {
        max = rows[i].value;
      }
    }
    if (max <= 0) {
      max = 1;
    }
    const total = rows.length;
    const points: Array<{
      key: string;
      label: string;
      x: number;
      y: number;
      value: number;
    }> = [];
    for (let i = 0; i < total; i++) {
      const x = total > 1 ? (i / (total - 1)) * 100 : 50;
      const y = 100 - (rows[i].value / max) * 100;
      points.push({
        key: "pt-" + i,
        label: rows[i].label,
        x: x,
        y: y,
        value: rows[i].value,
      });
    }
    return points;
  };
  $: linePoints = () => {
    const points = normalized();
    let output = "";
    for (let i = 0; i < points.length; i++) {
      output = output + points[i].x + "," + points[i].y + " ";
    }
    return output.trim();
  };
  $: areaPoints = () => {
    const points = normalized();
    if (points.length === 0) {
      return "";
    }
    return "0,100 " + linePoints() + " 100,100";
  };
</script>

<div class={cn("flex w-full flex-col gap-2", className)}>
  <div class="relative h-44 w-full" role="img" aria-label={ariaLabel}>
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
    {/if}<svg
      class="absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {#if area}
        <polygon class={cn(fillClass, "opacity-20")} points={areaPoints()} />
      {/if}<polyline
        fill="none"
        stroke-width="2"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={strokeClass}
        points={linePoints()}
      /></svg
    >
  </div>
  {#if showAxisLabels}
    <div class="flex w-full items-start gap-2">
      {#each normalized() as point (point.key)}
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