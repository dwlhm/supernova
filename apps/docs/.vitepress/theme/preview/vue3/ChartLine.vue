<template>
  <div :class="cn('flex w-full flex-col gap-2', className)">
    <div class="relative h-44 w-full" role="img" :aria-label="ariaLabel">
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

      <svg
        class="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <template v-if="area">
          <polygon
            :class="cn(fillClass, 'opacity-20')"
            :points="areaPoints"
          ></polygon>
        </template>

        <polyline
          fill="none"
          stroke-width="2"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="strokeClass"
          :points="linePoints"
        ></polyline>
      </svg>
    </div>
    <template v-if="showAxisLabels">
      <div class="flex w-full items-start gap-2">
        <template :key="point.key" v-for="(point, index) in normalized">
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
import { computed } from "vue";

import { cn } from "./utils";

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

const props = withDefaults(defineProps<ChartLineProps>(), {
  data: [],
  className: "",
  ariaLabel: "Line chart",
  showGridLines: true,
  area: false,
  fillClass: "fill-chart-series-1",
  strokeClass: "stroke-chart-series-1",
  showAxisLabels: true,
  showDataLabels: false,
});

const normalized = computed(() => {
  const rows: ChartPoint[] = props.data || [];
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
});
const linePoints = computed(() => {
  const points = normalized;
  let output = "";
  for (let i = 0; i < points.length; i++) {
    output = output + points[i].x + "," + points[i].y + " ";
  }
  return output.trim();
});
const areaPoints = computed(() => {
  const points = normalized;
  if (points.length === 0) {
    return "";
  }
  return "0,100 " + linePoints + " 100,100";
});
</script>