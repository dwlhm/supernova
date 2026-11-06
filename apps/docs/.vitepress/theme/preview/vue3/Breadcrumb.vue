<template>
  <nav
    aria-label="Breadcrumb"
    :data-ctrl="typeof bindControllerProps"
    :data-type="type"
    :data-show-ellipsis="showEllipsis"
    :class="cn('w-full', className)"
  >
    <ol
      class="flex flex-row flex-wrap justify-start items-center gap-1.5 text-sm font-normal"
    >
      <slot />
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface BreadcrumbProps {
  type?: "1" | "2" | "deep";
  showEllipsis?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  type: "2",
  showEllipsis: true,
  className: "",
});
defineSlots<{ default?: () => any }>();
</script>