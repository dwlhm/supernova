<template>
  <th
    scope="col"
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'px-4 py-3 text-sm font-medium text-foreground-muted',
        align === 'center'
          ? 'text-center'
          : align === 'right'
          ? 'text-right'
          : 'text-left',
        className
      )
    "
  >
    <slot />
  </th>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface TableHeaderCellProps {
  align?: "left" | "center" | "right";
  className?: string;
}

const props = withDefaults(defineProps<TableHeaderCellProps>(), {
  align: "left",
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>