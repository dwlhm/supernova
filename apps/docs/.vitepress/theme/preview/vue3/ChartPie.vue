<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="cn('relative flex w-full items-center justify-center', className)"
  >
    <div class="relative flex items-center justify-center">
      <svg
        class="h-44 w-44 shrink-0 -rotate-90"
        viewBox="0 0 100 100"
        role="img"
        :aria-label="ariaLabel"
      >
        <template
          :key="slice.key"
          v-for="(slice, index) in getChartPieState(data, innerRadius).slices"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            :r="getChartPieState(data, innerRadius).ringRadius"
            :class="
              cva(
                String(slice.seriesIndex),
                {
                  '0': 'stroke-chart-series-1',
                  '1': 'stroke-chart-series-2',
                  '2': 'stroke-chart-series-3',
                  '3': 'stroke-chart-series-4',
                  '4': 'stroke-chart-series-5',
                },
                '0'
              )
            "
            :stroke-width="getChartPieState(data, innerRadius).ringWidth"
            :stroke-dasharray="slice.dashArray"
            :stroke-dashoffset="slice.dashOffset"
          ></circle>
        </template>
      </svg>
      <template v-if="innerRadius > 0 && showTooltip">
        <div
          class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-2"
        >
          <span class="w-16 truncate text-xs font-medium text-foreground-muted"
            >Total</span
          ><span
            class="w-16 truncate text-sm font-bold text-foreground-default"
            >{{ getChartPieState(data, innerRadius).total }}</span
          >
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn, cva, getChartPieState, bindControllerProps } from "./utils";

export interface ChartPoint {
  label: string;
  value: number;
}
export interface ChartPieProps {
  data?: ChartPoint[];
  innerRadius?: number;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<ChartPieProps>(), {
  className: "",
  ariaLabel: "Pie chart",
  data: () => [],
  innerRadius: 0,
  showTooltip: true,
});
</script>