<template>
  <figure
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex w-full flex-col gap-4 rounded-lg border border-border-default bg-background-default p-5 shadow-sm',
        className
      )
    "
  >
    <template v-if="showTitle || showDescription">
      <figcaption class="flex flex-col gap-1">
        <template v-if="showTitle">
          <span
            class="text-base leading-6 font-semibold text-foreground-default"
            >{{ title }}</span
          >
        </template>

        <template v-if="showDescription">
          <span class="text-sm text-foreground-muted">{{ description }}</span>
        </template>
      </figcaption>
    </template>

    <template v-if="$slots.default">
      <div class="w-full"><slot /></div>
    </template>

    <template v-if="!$slots.default">
      <div class="w-full">
        <template v-if="type === 'bar'">
          <ChartBar
            :data="data"
            :showTooltip="showTooltip"
            :ariaLabel="title"
          ></ChartBar>
        </template>

        <template v-if="type === 'line' || type === 'area'">
          <ChartLine
            :data="data"
            :area="type === 'area'"
            :showTooltip="showTooltip"
            :ariaLabel="title"
          ></ChartLine>
        </template>

        <template v-if="type === 'pie' || type === 'donut'">
          <ChartPie
            :data="data"
            :innerRadius="type === 'donut' ? 30 : 0"
            :showTooltip="showTooltip"
            :ariaLabel="title"
          ></ChartPie>
        </template>
      </div>
    </template>

    <template v-if="showLegend">
      <ChartLegend :items="legend"></ChartLegend>
    </template>
  </figure>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";
import ChartLegend from "./ChartLegend.vue";
import ChartBar from "./ChartBar.vue";
import ChartLine from "./ChartLine.vue";
import ChartPie from "./ChartPie.vue";

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

const props = withDefaults(defineProps<ChartProps>(), {
  className: "",
  showTitle: true,
  showDescription: true,
  title: "Revenue Overview",
  description: "Weekly revenue breakdown by day",

  type: "bar",
  data: () => [],
  showTooltip: true,
  showLegend: true,
  legend: () => [],
});
defineSlots<{ default?: () => any }>();
</script>