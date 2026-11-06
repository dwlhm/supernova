<template>
  <td
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'border-t border-border-default px-4 py-3 align-middle text-sm font-normal text-foreground-default',
        cva(
          align,
          {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
          },
          'left'
        ),
        className
      )
    "
  >
    <slot />
  </td>
</template>

<script setup lang="ts">
import { cn, cva, bindControllerProps } from "./utils";

export interface TableBodyCellProps {
  align?: "left" | "center" | "right";
  className?: string;
}

const props = withDefaults(defineProps<TableBodyCellProps>(), {
  align: "left",
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>