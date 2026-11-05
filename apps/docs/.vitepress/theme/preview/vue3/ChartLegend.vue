<template>
  <ul
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex flex-wrap items-center gap-4', className)"
  >
    <template :key="item.label" v-for="(item, index) in items">
      <li class="flex items-center gap-2">
        <span
          aria-hidden="true"
          :class="cn('h-2 w-2 shrink-0 rounded-full', item.colorClass)"
        ></span
        ><span class="text-xs text-foreground-muted">{{ item.label }}</span>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

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
  items: () => [],
});
</script>