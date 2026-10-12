<template>
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-label="ariaLabel"
    :width="size"
    :height="size"
    :class="
      cn(
        'inline-block shrink-0 text-components-icon-truck-delivery-color-root-fill-default',
        className
      )
    "
    :stroke-width="strokeWidth"
  >
    <path d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M15 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M5 18h-2v-11a1 1 0 0 1 1 -1h9v12h-4"></path>
    <path d="M15 9h5l2 3v6h-3"></path>
    <path d="M13 6h2l2 3"></path>
  </svg>
</template>

<script setup lang="ts">
import { cn } from "./utils";

export interface IconTruckDeliveryProps {
  size?: number;
  strokeWidth?: number;
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<IconTruckDeliveryProps>(), {
  ariaLabel: "Truck delivery",
  size: 24,
  className: "",
  strokeWidth: 1.5,
});
</script>