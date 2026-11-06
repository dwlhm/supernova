<template>
  <span
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex min-w-0 text-sm text-foreground-default',
        cva(
          layout,
          {
            row: 'flex-row items-center gap-2 font-normal',
            stacked: 'flex-col items-start gap-0.5 font-medium',
          },
          'row'
        ),
        cva(
          align,
          {
            left: 'justify-start text-left',
            center: 'justify-center text-center',
            right: 'justify-end text-right tabular-nums',
          },
          'left'
        ),
        className
      )
    "
  >
    <template v-if="imageSrc !== ''">
      <img
        class="h-7 w-7 shrink-0 rounded-sm object-cover"
        :src="imageSrc"
        :alt="imageAlt"
      />
    </template>

    <template v-if="status !== 'none'">
      <span
        aria-hidden="true"
        :class="
          cn(
            'h-2 w-2 shrink-0 rounded-full',
            cva(
              status,
              {
                none: 'hidden',
                success: 'bg-success-default',
                warning: 'bg-warning-default',
                destructive: 'bg-destructive-default',
                info: 'bg-info-default',
              },
              'none'
            )
          )
        "
      ></span>
    </template>

    <template v-if="$slots.default">
      <slot />
    </template>
  </span>
</template>

<script setup lang="ts">
import { cn, cva, bindControllerProps } from "./utils";

export interface TableCellValueProps {
  layout?: "row" | "stacked";
  align?: "left" | "center" | "right";
  status?: "none" | "success" | "warning" | "destructive" | "info";
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

const props = withDefaults(defineProps<TableCellValueProps>(), {
  layout: "row",
  align: "left",
  className: "",
  imageSrc: "",
  imageAlt: "",
  status: "none",
});
defineSlots<{ default?: () => any }>();
</script>