<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-disabled="disabled"
    :class="
      cn(
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none',
        variantClasses,
        sizeClasses,
        roundnessClasses,
        className
      )
    "
    @click="async (event) => handleClick()"
  >
    <template v-if="showLeftIcon">
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M12 5v14M5 12h14" stroke-linecap="round"></path>
      </svg>
    </template>

    <template v-if="showLabel">
      <span class="truncate">{{ label }}</span>
    </template>

    <slot />
    <template v-if="showRightIcon">
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface ButtonProps {
  label?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "large" | "regular" | "small" | "mini";
  roundness?: "default" | "round";
  disabled?: boolean;
  showLabel?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  children?: any;
  onClick?: () => void;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "regular",
  roundness: "default",
  disabled: false,
  onClick: undefined,
  className: "",
  showLeftIcon: false,
  showLabel: true,
  label: "Label",
  children: undefined,
  showRightIcon: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-components-button-secondary-color-container-background-default text-components-button-secondary-color-label-foreground-default hover:bg-components-button-secondary-color-container-background-hover active:bg-components-button-secondary-color-container-background-pressed";
    case "outline":
      return "bg-components-button-outline-color-container-background-default text-components-button-outline-color-label-foreground-default border border-components-button-outline-color-container-border-default hover:bg-components-button-outline-color-container-background-hover active:bg-components-button-outline-color-container-background-pressed";
    case "ghost":
      return "bg-ghost-default text-foreground-default hover:bg-ghost-hover";
    case "destructive":
      return "bg-components-button-destructive-color-container-background-default text-components-button-destructive-color-label-foreground-default hover:bg-components-button-destructive-color-container-background-hover active:bg-components-button-destructive-color-container-background-pressed";
    case "link":
      return "bg-transparent text-components-button-link-color-label-foreground-default underline-offset-4 hover:underline hover:text-components-button-link-color-label-foreground-hover";
    case "primary":
    default:
      return "bg-components-button-primary-color-container-background-default text-components-button-primary-color-label-foreground-default hover:bg-components-button-primary-color-container-background-hover active:bg-components-button-primary-color-container-background-pressed";
  }
});
const sizeClasses = computed(() => {
  switch (props.size) {
    case "large":
      return "h-10 px-6 text-base gap-2";
    case "small":
      return "h-8 px-3 text-sm gap-1.5";
    case "mini":
      return "h-6 px-2 text-xs gap-1.5";
    case "regular":
    default:
      return "h-9 px-4 text-sm gap-2";
  }
});
const roundnessClasses = computed(() => {
  return props.roundness === "round"
    ? "rounded-rounded-full"
    : "rounded-rounded-lg";
});

function handleClick() {
  if (!props.disabled && props.onClick) {
    props.onClick();
  }
}
</script>