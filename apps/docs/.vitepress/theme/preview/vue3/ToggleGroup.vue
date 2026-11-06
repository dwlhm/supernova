<template>
  <div
    role="group"
    :data-ctrl="typeof bindControllerProps"
    :data-size="size"
    :aria-label="ariaLabel"
    :class="
      cn(
        'inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm',
        cva(
          size,
          {
            small: 'min-h-5',
            medium: 'min-h-6',
            large: 'min-h-9',
          },
          'medium'
        ),
        className
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn, cva, bindControllerProps } from "./utils";

export interface ToggleGroupProps {
  size?: "small" | "medium" | "large";
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  size: "medium",
  ariaLabel: "Toggle group",
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>