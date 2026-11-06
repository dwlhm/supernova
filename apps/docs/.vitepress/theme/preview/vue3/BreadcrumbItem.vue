<template>
  <li
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex flex-row justify-center items-center gap-1.5 text-sm font-normal',
        className
      )
    "
  >
    <template v-if="isEllipsis">
      <span
        class="inline-flex items-center justify-center w-3.5 h-3.5 text-foreground-muted"
        aria-hidden="true"
        ><svg
          class="w-3.5 h-3.5"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="3" cy="7" r="1"></circle>
          <circle cx="7" cy="7" r="1"></circle>
          <circle cx="11" cy="7" r="1"></circle></svg
      ></span>
    </template>

    <template v-if="!isEllipsis && isCurrent">
      <span
        aria-current="page"
        class="flex flex-row justify-center items-center gap-2.5 text-sm font-normal text-foreground-default"
        ><slot
      /></span>
    </template>

    <template v-if="!isEllipsis && !isCurrent">
      <a
        class="flex flex-row justify-center items-center gap-2.5 rounded-sm text-sm font-normal text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        :href="href"
        @click="async (event) => onNavigate && onNavigate(href || '#')"
        ><slot
      /></a>
    </template>

    <template v-if="!isCurrent">
      <span class="text-sm font-normal text-foreground-muted" aria-hidden="true"
        >/</span
      >
    </template>
  </li>
</template>

<script setup lang="ts">
import { cn, bindControllerProps } from "./utils";

export interface BreadcrumbItemProps {
  href?: string;
  isCurrent?: boolean;
  isEllipsis?: boolean;
  className?: string;

  onNavigate?: (href: string) => void;
}

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  className: "",
  isEllipsis: false,
  isCurrent: false,

  href: "#",
  onNavigate: undefined,
});
defineSlots<{ default?: () => any }>();
</script>