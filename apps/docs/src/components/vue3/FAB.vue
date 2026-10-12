<template>
  <button
    type="button"
    :aria-label="accessibleName"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex shrink-0 items-center justify-center rounded-rounded-full shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
        variantClasses,
        sizeClasses,
        className
      )
    "
    @click="async (event) => handleClick()"
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
        <path d="M12 5v14M5 12h14" stroke-linecap="round"></path>
      </svg>
    </template>

    <template v-if="size === 'extended' && showLabel">
      <span class="truncate text-sm font-medium">{{ label }}</span>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface FABProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "regular" | "large" | "extended";
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

const props = withDefaults(defineProps<FABProps>(), {
  variant: "primary",
  size: "regular",
  ariaLabel: "",
  label: "Label",
  disabled: false,
  onClick: undefined,
  className: "",
  children: undefined,
  showLabel: true,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-components-fab-secondary-color-container-background-default text-components-fab-secondary-color-label-foreground-default hover:bg-components-fab-secondary-color-container-background-hover";
    case "outline":
      return "bg-components-fab-surface-color-container-background-default text-components-fab-surface-color-label-foreground-default border border-border-default hover:bg-components-fab-surface-color-container-background-hover";
    case "primary":
    default:
      return "bg-components-fab-primary-color-container-background-default text-components-fab-primary-color-label-foreground-default hover:bg-components-fab-primary-color-container-background-hover";
  }
});
const sizeClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-10 w-10";
    case "large":
      return "h-24 w-24";
    case "extended":
      return "h-14 w-auto gap-3 px-4";
    case "regular":
    default:
      return "h-14 w-14";
  }
});
const iconClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-4 w-4";
    case "large":
      return "h-7 w-7";
    case "regular":
    case "extended":
    default:
      return "h-5 w-5";
  }
});
const accessibleName = computed(() => {
  return props.ariaLabel !== "" ? props.ariaLabel : props.label;
});

function handleClick() {
  if (!props.disabled && props.onClick) {
    props.onClick();
  }
}
</script>