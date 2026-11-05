<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex w-full flex-col gap-2', className)"
  >
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
        class="absolute inset-x-0 h-1.5 rounded-full bg-background-muted"
      ></div>
      <div
        class="absolute left-0 h-1.5 rounded-full bg-primary-default"
        :style="getSliderState(props).barStyle"
      ></div>
      <input
        type="range"
        class="peer absolute inset-0 z-10 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        :id="id"
        :name="name"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        :disabled="disabled"
        :aria-label="label"
        @input="
          async (event) =>
            !disabled &&
            onValueChange &&
            onValueChange(Number(event.target.value))
        "
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
        :style="getSliderState(props).thumbStyle"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn, getSliderState, bindControllerProps } from "./utils";

export interface SliderProps {
  id?: string;
  name?: string;
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
  className: "",
  showValue: false,
  label: "Slider",
  value: 0,
  disabled: false,
  id: "slider",
  name: "slider",
  min: 0,
  max: 100,
  step: 1,
  onValueChange: undefined,
});
</script>