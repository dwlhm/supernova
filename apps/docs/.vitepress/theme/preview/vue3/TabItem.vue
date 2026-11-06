<template>
  <button
    type="button"
    role="tab"
    :data-ctrl="typeof bindControllerProps"
    :aria-selected="active || state === 'active'"
    :tabIndex="active || state === 'active' ? 0 : -1"
    :class="
      cn(
        'inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        active || state === 'active'
          ? 'border border-border-default bg-background-default text-foreground-default shadow-sm'
          : 'text-foreground-muted hover:text-foreground-default',
        className
      )
    "
    @click="async (event) => onClick && onClick()"
  >
    <template v-if="showIcon">
      <span class="flex shrink-0 items-center text-foreground-muted"
        ><svg
          aria-hidden="true"
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" :d="ICON_PATHS.menu"></path></svg
      ></span>
    </template>

    <span class="truncate"><slot /></span>
    <template v-if="showNum">
      <span
        class="inline-flex shrink-0 items-center rounded-full bg-background-muted px-1.5 py-0.5 text-xs font-medium leading-none text-foreground-muted"
        >{{ num }}</span
      >
    </template>
  </button>
</template>

<script setup lang="ts">
import { cn, ICON_PATHS, bindControllerProps } from "./utils";

export interface TabItemProps {
  active?: boolean;
  state?: "default" | "active";
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;

  onClick?: () => void;
}

const props = withDefaults(defineProps<TabItemProps>(), {
  active: false,
  state: "default",
  className: "",
  onClick: undefined,
  showIcon: false,

  showNum: false,
  num: "",
});
defineSlots<{ default?: () => any }>();
</script>