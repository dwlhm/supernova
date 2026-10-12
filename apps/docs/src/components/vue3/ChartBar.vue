<template>
  <div :class="cn('flex w-full flex-col gap-2', className)">
    <div
      class="relative flex h-44 w-full items-end gap-2"
      role="img"
      :aria-label="ariaLabel"
    >
      <template v-if="showGridLines">
        <div
          class="pointer-events-none absolute inset-0 flex flex-col justify-between"
          aria-hidden="true"
        >
          <div
            class="border-t border-components-chart-all-color-grid-line-stroke-default"
          ></div>
          <div
            class="border-t border-components-chart-all-color-grid-line-stroke-default"
          ></div>
          <div
            class="border-t border-components-chart-all-color-grid-line-stroke-default"
          ></div>
          <div
            class="border-t border-components-chart-all-color-grid-line-stroke-default"
          ></div>
          <div
            class="border-t border-components-chart-all-color-grid-line-stroke-default"
          ></div>
        </div>
      </template>

      <template :key="point.label" v-for="(point, index) in data">
        <div class="relative flex h-full flex-1 items-end">
          <div
            :class="cn('w-full rounded-rounded-sm', colorClass)"
            :style="{
              height: barHeight(point.value),
            }"
          ></div>
        </div>
      </template>
    </div>
    <template v-if="showAxisLabels">
      <div class="flex w-full items-start gap-2">
        <template :key="point.label" v-for="(point, index) in data">
          <span
            class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
          >
            <template v-if="showDataLabels">
              <span
                class="text-xs font-medium text-components-chart-all-color-data-label-text-default"
                >{{ point.value }}</span
              >
            </template>

            <span
              class="w-full truncate text-xs text-components-chart-all-color-axis-label-text-default"
              >{{ point.label }}</span
            ></span
          >
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { cn } from "./utils";

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

const props = withDefaults(defineProps<ChartBarProps>(), {
  data: [],
  className: "",
  ariaLabel: "Bar chart",
  showGridLines: true,
  colorClass: "bg-chart-series-1",
  showAxisLabels: true,
  showDataLabels: true,
});

function barHeight(value: number) {
  const rows: ChartPoint[] = props.data || [];
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