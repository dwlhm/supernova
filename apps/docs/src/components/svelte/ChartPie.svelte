<script context="module" lang="ts">
  export interface ChartPoint {
    label: string;
    value: number;
  }

  export interface PieSlice {
    key: string;
    label: string;
    value: number;
    dashArray: string;
    dashOffset: string;
    colorClass: string;
  }

  export interface ChartPieProps {
    data?: ChartPoint[];
    innerRadius?: number;
    ariaLabel?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let innerRadius: ChartPieProps["innerRadius"] = 0;
  export let data: ChartPieProps["data"] = [];
  export let className: ChartPieProps["className"] = "";
  export let ariaLabel: ChartPieProps["ariaLabel"] = "Pie chart";

  $: ringRadius = () => {
    const inner = innerRadius;
    if (inner > 0 && inner < 50) {
      return (50 + inner) / 2;
    }
    return 25;
  };
  $: ringWidth = () => {
    const inner = innerRadius;
    if (inner > 0 && inner < 50) {
      return 50 - inner;
    }
    return 50;
  };
  $: slices = () => {
    const rows: ChartPoint[] = data || [];
    const inner = innerRadius;
    let radius = 25;
    if (inner > 0 && inner < 50) {
      radius = (50 + inner) / 2;
    }
    const circumference = 2 * Math.PI * radius;
    let total = 0;
    for (let i = 0; i < rows.length; i++) {
      total = total + rows[i].value;
    }
    const output: PieSlice[] = [];
    let running = 0;
    for (let i = 0; i < rows.length; i++) {
      const fraction = total > 0 ? rows[i].value / total : 0;
      const length = fraction * circumference;
      let colorClass = "stroke-chart-series-1";
      const mod = i % 5;
      if (mod === 1) {
        colorClass = "stroke-chart-series-2";
      } else if (mod === 2) {
        colorClass = "stroke-chart-series-3";
      } else if (mod === 3) {
        colorClass = "stroke-chart-series-4";
      } else if (mod === 4) {
        colorClass = "stroke-chart-series-5";
      }
      output.push({
        key: "slice-" + i,
        label: rows[i].label,
        value: rows[i].value,
        dashArray: length + " " + (circumference - length),
        dashOffset: String(-running * circumference),
        colorClass: colorClass,
      });
      running = running + fraction;
    }
    return output;
  };
</script>

<div class={cn("flex w-full items-center justify-center", className)}>
  <svg
    class="h-44 w-44 shrink-0 -rotate-90"
    viewBox="0 0 100 100"
    role="img"
    aria-label={ariaLabel}
  >
    {#each slices() as slice (slice.key)}
      <circle
        cx="50"
        cy="50"
        fill="none"
        r={ringRadius()}
        class={slice.colorClass}
        stroke-width={ringWidth()}
        stroke-dasharray={slice.dashArray}
        stroke-dashoffset={slice.dashOffset}
      />
    {/each}
  </svg>
</div>