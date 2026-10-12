<template>
  <span
    role="status"
    aria-live="polite"
    :class="cn('inline-flex items-center justify-center', className)"
    ><svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      :class="
        cn(
          'animate-spin text-components-spinner-all-color-icon-stroke-default',
          sizeClasses
        )
      "
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        class="opacity-25"
      ></circle>
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      ></path></svg
    ><span class="sr-only">{{ label }}</span></span
  >
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface SpinnerProps {
  size?: "12" | "16" | "24" | "32";
  label?: string;
  className?: string;
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: "24",
  className: "",
  label: "Loading",
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "12":
      return "h-3 w-3";
    case "16":
      return "h-4 w-4";
    case "32":
      return "h-8 w-8";
    case "24":
    default:
      return "h-6 w-6";
  }
});
</script>