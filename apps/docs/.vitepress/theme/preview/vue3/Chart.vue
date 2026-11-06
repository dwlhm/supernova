<template>
  <figure
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-border-default bg-background-default px-5 py-5 shadow-sm',
        className
      )
    "
  >
    <template v-if="title || description">
      <figcaption class="flex flex-col items-start justify-start gap-1">
        <template v-if="title">
          <span
            class="text-base leading-6 font-semibold text-foreground-default"
            >{{ title }}</span
          >
        </template>

        <template v-if="description">
          <span class="text-sm font-normal text-foreground-muted">{{
            description
          }}</span>
        </template>
      </figcaption>
    </template>

    <slot />
  </figure>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

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
  title?: string;
  description?: string;
  className?: string;
}

const props = withDefaults(defineProps<ChartProps>(), {
  className: "",
  title: "",
  description: "",
});
defineSlots<{ default?: () => any }>();
</script>