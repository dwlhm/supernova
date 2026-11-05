<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex w-full flex-col gap-2', className)"
  >
    <template v-if="showLabel">
      <div
        class="flex items-center justify-between text-xs text-foreground-muted"
      >
        <span>{{ label }}</span
        ><span>{{ getProgressState(value).percentage }}%</span>
      </div>
    </template>

    <div
      role="progressbar"
      class="h-2 w-full overflow-hidden rounded-full bg-background-muted"
      :aria-valuenow="getProgressState(value).percentage"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-label="label"
    >
      <div
        class="h-2 rounded-full bg-primary-default transition-all"
        :style="getProgressState(value).barStyle"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn, getProgressState, bindControllerProps } from "./utils";

export interface ProgressbarProps {
  value?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<ProgressbarProps>(), {
  className: "",
  showLabel: false,
  label: "Progress",
  value: 0,
});
</script>