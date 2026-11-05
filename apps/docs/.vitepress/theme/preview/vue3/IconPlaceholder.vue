<template>
  <svg
    role="img"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    stroke-width="1"
    :data-ctrl="typeof bindControllerProps"
    :aria-label="ariaLabel"
    :width="size"
    :height="size"
    :class="cn('inline-block shrink-0 text-foreground-muted', className)"
  >
    <circle cx="6" cy="6" r="5"></circle>
  </svg>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface IconPlaceholderProps {
  size?: number;
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<IconPlaceholderProps>(), {
  ariaLabel: "Placeholder icon",
  size: 12,
  className: "",
});
</script>