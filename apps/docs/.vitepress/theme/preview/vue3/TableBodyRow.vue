<template>
  <tr
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'border-b border-border-default transition-colors hover:bg-background-subtle',
        selected ? 'bg-primary-subtle' : 'bg-background-default',
        className
      )
    "
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface TableBodyRowProps {
  selected?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<TableBodyRowProps>(), {
  selected: false,
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>