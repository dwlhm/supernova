<template>
  <span
    :class="
      cn('inline-flex items-center gap-2', disabled && 'opacity-50', className)
    "
  >
    <template v-if="leftLabel && hasLabel">
      <span class="text-sm text-foreground-default">{{ label }}</span>
    </template>

    <button
      type="button"
      role="switch"
      :aria-checked="checked"
      :aria-label="hasLabel ? label : 'Toggle setting'"
      :disabled="disabled"
      :class="
        cn(
          'relative inline-flex shrink-0 items-center rounded-rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none',
          trackClasses,
          trackColor
        )
      "
      @click="async (event) => toggle()"
    >
      <span
        aria-hidden="true"
        :class="
          cn(
            'inline-block rounded-rounded-full bg-components-switch-on-color-thumb-background-default shadow-sm transition-transform',
            thumbClasses,
            thumbTransform
          )
        "
      ></span>
    </button>
    <template v-if="rightLabel && hasLabel">
      <span class="text-sm text-foreground-default">{{ label }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface SwitchButtonProps {
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const props = withDefaults(defineProps<SwitchButtonProps>(), {
  size: "medium",
  checked: false,
  label: "Label",
  disabled: false,
  onCheckedChange: undefined,
  className: "",
  leftLabel: false,
  rightLabel: true,
});

const trackClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-5 w-9 p-0.5";
    case "large":
      return "h-7 w-12 p-0.5";
    case "medium":
    default:
      return "h-6 w-11 p-0.5";
  }
});
const thumbClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-4 w-4";
    case "large":
      return "h-6 w-6";
    case "medium":
    default:
      return "h-5 w-5";
  }
});
const thumbTransform = computed(() => {
  if (!props.checked) {
    return "translate-x-0";
  }
  switch (props.size) {
    case "small":
      return "translate-x-4";
    case "large":
      return "translate-x-5";
    case "medium":
    default:
      return "translate-x-5";
  }
});
const trackColor = computed(() => {
  return props.checked
    ? "bg-components-switch-on-color-track-background-default"
    : "bg-components-switch-off-color-track-background-default";
});
const hasLabel = computed(() => {
  return props.label !== "";
});

function toggle() {
  if (props.disabled) {
    return;
  }
  if (props.onCheckedChange) {
    props.onCheckedChange(!props.checked);
  }
}
</script>