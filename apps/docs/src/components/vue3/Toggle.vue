<template>
  <button
    type="button"
    :aria-pressed="pressed"
    :aria-label="ariaLabel !== '' ? ariaLabel : label"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-rounded-lg text-components-toggle-all-color-label-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
        sizeClasses,
        pressedClasses,
        className
      )
    "
    @click="async (event) => handleToggle()"
  >
    <template v-if="$slots.default">
      <slot />
    </template>

    <template v-if="!$slots.default">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        :class="cn('shrink-0', iconClasses)"
      >
        <path d="M12 3v18M3 12h18" stroke-linecap="round"></path>
      </svg>
    </template>

    <template v-if="showText">
      <span class="truncate">{{ label }}</span>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface ToggleProps {
  pressed?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  showText?: boolean;
  label?: string;
  className?: string;
  children?: any;
  ariaLabel?: string;
  onPressedChange?: (pressed: boolean) => void;
}

const props = withDefaults(defineProps<ToggleProps>(), {
  size: "medium",
  pressed: false,
  disabled: false,
  onPressedChange: undefined,
  ariaLabel: "",
  label: "Toggle",
  className: "",
  children: undefined,
  showText: false,
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "p-0.5 gap-0.5 text-xs";
    case "large":
      return "p-2 gap-1 text-base";
    case "medium":
    default:
      return "p-1 gap-1 text-sm";
  }
});
const iconClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-3 w-3";
    case "large":
      return "h-5 w-5";
    case "medium":
    default:
      return "h-4 w-4";
  }
});
const pressedClasses = computed(() => {
  return props.pressed
    ? "bg-components-toggle-active-color-container-background-default"
    : "bg-transparent";
});

function handleToggle() {
  if (props.disabled) {
    return;
  }
  if (props.onPressedChange) {
    props.onPressedChange(!props.pressed);
  }
}
</script>