<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'w-full overflow-x-auto rounded-lg border border-border-default bg-background-default',
        className
      )
    "
  >
    <table class="w-full border-collapse">
      <template v-if="caption">
        <caption class="sr-only">
          {{
            caption
          }}
        </caption>
      </template>

      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface TableProps {
  caption?: string;
  className?: string;
}

const props = withDefaults(defineProps<TableProps>(), {
  className: "",
  caption: "Data table",
});
defineSlots<{ default?: () => any }>();
</script>