<template>
  <ul :class="cn('flex flex-wrap items-center gap-4', className)">
    <template :key="item.label" v-for="(item, index) in items">
      <li class="flex items-center gap-2">
        <span aria-hidden="true" :class="cn(dotClasses, item.colorClass)"></span
        ><span
          class="text-xs text-components-chart-all-color-legend-label-text-default"
          >{{ item.label }}</span
        >
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface ChartLegendItem {
  label: string;
  colorClass: string;
}
export interface ChartLegendProps {
  items?: ChartLegendItem[];
  className?: string;
}

const props = withDefaults(defineProps<ChartLegendProps>(), {
  className: "",
  items: [],
});

const dotClasses = computed(() => {
  return "h-2 w-2 shrink-0 rounded-rounded-full";
});
</script>