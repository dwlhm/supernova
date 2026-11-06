<template>
  <span
    :data-ctrl="typeof bindControllerProps"
    :aria-describedby="
      createTooltipState({
        id: id,
      }).getTriggerProps()['aria-describedby']
    "
    :class="
      cn('group relative inline-flex items-center justify-center', className)
    "
  >
    <template v-if="$slots.default">
      <slot />
    </template>

    <span
      :role="
        createTooltipState({
          id: id,
        }).getContentProps().role
      "
      :id="
        createTooltipState({
          id: id,
        }).getContentProps().id
      "
      :class="
        cn(
          'pointer-events-none z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-opacity',
          cva(
            position,
            {
              top: 'flex-col',
              bottom: 'flex-col-reverse',
              left: 'flex-row',
              right: 'flex-row-reverse',
            },
            'top'
          )
        )
      "
      ><span
        class="inline-flex items-center justify-center rounded-lg bg-primary-default px-3 py-2 font-body text-sm font-normal leading-5 text-primary-foreground"
        >{{ textContent || text }}</span
      ><span
        aria-hidden="true"
        class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-default"
      ></span></span
  ></span>
</template>

<script setup lang="ts">
import { cn, cva, createTooltipState, bindControllerProps } from "./utils";

export interface TooltipProps {
  text?: string;
  textContent?: string;
  position?: "top" | "bottom" | "left" | "right";
  id?: string;
  className?: string;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  id: "tooltip",
  className: "",

  position: "top",
  textContent: "",
  text: "",
});
defineSlots<{ default?: () => any }>();
</script>