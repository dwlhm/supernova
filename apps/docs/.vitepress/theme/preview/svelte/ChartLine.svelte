<script context="module" lang="ts">
  export interface ChartPoint {
    label: string;
    value?: number;
    values?: number[];
  }

  export interface ChartLineProps {
    data?: ChartPoint[];
    area?: boolean;
    showGridLines?: boolean;
    showDataLabels?: boolean;
    showAxisLabels?: boolean;
    showTooltip?: boolean;
    strokeClass?: string;
    fillClass?: string;
    ariaLabel?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn, getChartLineState, bindControllerProps } from "./utils";

  export let className: ChartLineProps["className"] = "";
  export let ariaLabel: ChartLineProps["ariaLabel"] = "Line chart";
  export let showGridLines: ChartLineProps["showGridLines"] = true;
  export let data: ChartLineProps["data"] = [];
  export let strokeClass: ChartLineProps["strokeClass"] =
    "stroke-chart-series-1";
  export let fillClass: ChartLineProps["fillClass"] = "fill-chart-series-1";
  export let area: ChartLineProps["area"] = false;
  export let showTooltip: ChartLineProps["showTooltip"] = true;
  export let showAxisLabels: ChartLineProps["showAxisLabels"] = true;
  export let showDataLabels: ChartLineProps["showDataLabels"] = false;
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
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn("flex w-full flex-col gap-2", className)}
>
  <div class="relative h-44 w-full" role="img" aria-label={ariaLabel}>
    {#if showGridLines}
      <div
        class="pointer-events-none absolute inset-0 flex flex-col justify-between"
        aria-hidden="true"
      >
        <div class="border-t border-border-subtle" />
        <div class="border-t border-border-subtle" />
        <div class="border-t border-border-subtle" />
        <div class="border-t border-border-subtle" />
        <div class="border-t border-border-subtle" />
      </div>
    {/if}<svg
      class="absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {#each getChartLineState(data, strokeClass, fillClass).lines as line (line.key)}
        <g>
          {#if area}
            <polygon
              class={cn(line.fillClass, "opacity-20")}
              points={line.areaPoints}
            />
          {/if}<polyline
            fill="none"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={line.strokeClass}
            points={line.linePoints}
          /></g
        >
      {/each}
    </svg>
    {#each getChartLineState(data, strokeClass, fillClass).points as point (point.key)}
      <div
        style={stringifyStyles({
          left: `${point.x}%`,
          top: `${point.y}%`,
        })}
        class="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
        tabindex={0}
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <span
            class={cn(
              "h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150 group-focus:scale-150",
              fillClass
                ? fillClass.replace("fill-", "bg-")
                : "bg-chart-series-1"
            )}
          />
        </div>
        {#if showTooltip}
          <div
            role="tooltip"
            class="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 invisible opacity-0 scale-95 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 flex flex-col gap-0.5 rounded-lg border border-border-default bg-background-default px-2.5 py-1.5 shadow-lg backdrop-blur-sm min-w-20 whitespace-nowrap"
          >
            <span class="text-xs font-medium text-foreground-muted"
              >{point.label}</span
            >
            {#each point.valuesList as valItem (valItem.key)}
              <div class="flex items-center gap-1.5">
                <span
                  class={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    valItem.colorClass
                  )}
                /><span class="text-xs font-bold text-foreground-default"
                  >{valItem.value}</span
                >
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if showAxisLabels}
    <div class="flex w-full items-start gap-2">
      {#each getChartLineState(data, strokeClass, fillClass).points as point (point.key)}
        <span
          class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
        >
          {#if showDataLabels}
            <span class="text-xs font-medium text-foreground-default"
              >{point.value}</span
            >
          {/if}<span class="w-full truncate text-xs text-foreground-muted"
            >{point.label}</span
          ></span
        >
      {/each}
    </div>
  {/if}
</div>