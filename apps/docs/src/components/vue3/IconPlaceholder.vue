<template>
  <span
    role="img"
    :aria-label="ariaLabel"
    :class="cn('inline-flex shrink-0 items-center justify-center', className)"
    :style="dimensionStyle"
    ><svg
      class="h-full w-full text-foreground-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
      <path d="M7 17 17 7" stroke-linecap="round"></path></svg
  ></span>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface IconPlaceholderProps {
  size?: number;
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<IconPlaceholderProps>(), {
  size: 16,
  ariaLabel: "Placeholder icon",
  className: "",
});

const dimensionStyle = computed(() => {
  return {
    width: props.size + "px",
    height: props.size + "px",
  };
});
</script>