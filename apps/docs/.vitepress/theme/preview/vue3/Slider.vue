<template>
  <div :class="cn('flex w-full flex-col gap-2', className)">
    <template v-if="showValue">
      <div
        class="flex items-center justify-between text-xs text-foreground-muted"
      >
        <span>{{ label }}</span
        ><span>{{ value }}</span>
      </div>
    </template>

    <div
      :class="
        cn('relative flex h-5 w-full items-center', disabled && 'opacity-50')
      "
    >
      <div
        class="absolute inset-x-0 h-1.5 rounded-rounded-full bg-components-slider-default-color-track-background-default"
      ></div>
      <div
        class="absolute left-0 h-1.5 rounded-rounded-full bg-components-slider-default-color-bar-background-default"
        :style="barStyle"
      ></div>
      <div
        class="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-rounded-full border border-components-slider-default-color-thumb-border-default bg-components-slider-default-color-thumb-background-default shadow-sm"
        aria-hidden="true"
        :style="thumbStyle"
      ></div>
      <input
        type="range"
        class="absolute inset-0 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        :disabled="disabled"
        :aria-label="label"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        @input="async (event) => handleInput(event.target.value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  className?: string;
  onValueChange?: (value: number) => void;
}

const props = withDefaults(defineProps<SliderProps>(), {
  max: 100,
  min: 0,
  value: 0,
  disabled: false,
  onValueChange: undefined,
  className: "",
  showValue: false,
  label: "Slider",
  step: 1,
});

const percentage = computed(() => {
  const range = props.max - props.min;
  if (range <= 0) {
    return 0;
  }
  const raw = ((props.value - props.min) / range) * 100;
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
const thumbStyle = computed(() => {
  return {
    left: percentage + "%",
  };
});

function handleInput(rawValue: string) {
  if (props.disabled) {
    return;
  }
  const next = Number(rawValue);
  if (props.onValueChange && !isNaN(next)) {
    props.onValueChange(next);
  }
}
</script>