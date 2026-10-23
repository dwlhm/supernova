<template>
  <figure
    :class="
      cn(
        'flex w-full flex-col gap-4 rounded-rounded-lg border border-components-chart-all-color-container-border-default bg-components-chart-all-color-container-background-default p-5',
        className
      )
    "
  >
    <template v-if="hasHeading">
      <figcaption class="flex flex-col gap-1">
        <template v-if="showTitle">
          <span
            class="text-sm font-semibold text-components-chart-all-color-title-text-default"
            >{{ title }}</span
          >
        </template>

        <template v-if="showDescription">
          <span
            class="text-xs text-components-chart-all-color-description-text-default"
            >{{ description }}</span
          >
        </template>
      </figcaption>
    </template>

    <template v-if="showLegend">
      <ChartLegend :items="legend"></ChartLegend>
    </template>

    <div class="w-full"><slot /></div>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";
import ChartLegend from "./ChartLegend.vue";

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

const props = withDefaults(defineProps<ChartProps>(), {
  showTitle: true,
  showDescription: true,
  className: "",
  title: "Revenue Overview",
  description: "Weekly revenue breakdown by day",
  showLegend: true,
  legend: [],
  children: undefined,
});

const hasHeading = computed(() => {
  return props.showTitle || props.showDescription;
});
</script>