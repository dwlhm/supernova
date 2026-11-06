<template>
  <tr
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn('border-b border-border-default bg-background-subtle', className)
    "
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface TableHeaderRowProps {
  className?: string;
}

const props = withDefaults(defineProps<TableHeaderRowProps>(), {
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>