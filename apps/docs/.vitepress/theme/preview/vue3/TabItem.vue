<template>
  <button
    type="button"
    role="tab"
    :data-ctrl="typeof bindControllerProps"
    :aria-selected="active"
    :tabIndex="active ? 0 : -1"
    :class="
      cn(
        'inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        active
          ? 'bg-background-default text-foreground-default shadow-xs'
          : 'text-foreground-muted hover:text-foreground-default',
        className
      )
    "
    @click="async (event) => onClick && onClick()"
  >
    <template v-if="showIcon">
      <span class="flex shrink-0 items-center text-foreground-muted">
        <template v-if="$slots.default">
          <slot />
        </template>

        <template v-if="!$slots.default">
          <svg
            aria-hidden="true"
            class="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" :d="ICON_PATHS.menu"></path>
          </svg>
        </template>
      </span>
    </template>

    <span class="truncate">{{ label }}</span>
    <template v-if="showNum">
      <span
        class="inline-flex shrink-0 items-center rounded-full bg-background-muted px-1 py-0.5 text-xs font-medium leading-none text-foreground-muted"
        >{{ num }}</span
      >
    </template>
  </button>
</template>

<script setup lang="ts">
import { cn, ICON_PATHS, bindControllerProps } from "./utils";

export interface TabItemProps {
  label?: string;
  active?: boolean;
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;

  onClick?: () => void;
}

const props = withDefaults(defineProps<TabItemProps>(), {
  active: false,
  className: "",
  onClick: undefined,
  showIcon: false,

  label: "Label",
  showNum: false,
  num: "1",
});
defineSlots<{ default?: () => any }>();
</script>