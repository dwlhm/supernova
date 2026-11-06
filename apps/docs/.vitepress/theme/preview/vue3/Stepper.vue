<template>
  <nav
    :data-ctrl="typeof bindControllerProps"
    :aria-label="ariaLabel"
    :class="cn('w-full bg-background-default', className)"
  >
    <ol
      :class="
        cn(
          'flex items-start justify-start',
          orientation === 'vertical' ? 'flex-col' : 'w-full flex-row'
        )
      "
    >
      <slot />
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface StepperProps {
  orientation?: "horizontal" | "vertical";
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<StepperProps>(), {
  ariaLabel: "Progress",
  className: "",
  orientation: "horizontal",
});
defineSlots<{ default?: () => any }>();
</script>