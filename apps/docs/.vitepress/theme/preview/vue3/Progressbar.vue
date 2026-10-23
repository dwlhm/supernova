<template>
  <div :class="cn('flex w-full flex-col gap-2', className)">
    <template v-if="showLabel">
      <div
        class="flex items-center justify-between text-xs text-foreground-muted"
      >
        <span>{{ label }}</span
        ><span>{{ percentage }}%</span>
      </div>
    </template>

    <div
      role="progressbar"
      class="h-2 w-full overflow-hidden rounded-rounded-full bg-components-progressbar-all-color-track-background-default"
      :aria-valuenow="percentage"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-label="label"
    >
      <div
        class="h-2 rounded-rounded-full bg-components-progressbar-all-color-indicator-background-default transition-all"
        :style="barStyle"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface ProgressbarProps {
  value?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<ProgressbarProps>(), {
  value: 0,
  className: "",
  showLabel: false,
  label: "Progress",
});

const percentage = computed(() => {
  const raw = props.value;
  if (raw < 0) {
    return 0;
  }
  if (raw > 100) {
    return 100;
  }
  return raw;
});
const barStyle = computed(() => {
  return {
    width: percentage + "%",
  };
});
</script>