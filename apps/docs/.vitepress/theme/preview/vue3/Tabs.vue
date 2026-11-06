<template>
  <div
    role="tablist"
    :data-ctrl="typeof bindControllerProps"
    :aria-label="ariaLabel"
    :class="
      cn(
        'inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5',
        className
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface TabsProps {
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<TabsProps>(), {
  ariaLabel: "Tabs",
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>