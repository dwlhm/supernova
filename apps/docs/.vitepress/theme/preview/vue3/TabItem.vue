<template>
  <button
    type="button"
    role="tab"
    :aria-selected="active"
    :class="
      cn(
        'inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        tabClasses,
        className
      )
    "
    @click="async (event) => handleClick()"
  >
    <template v-if="showIcon">
      <span
        class="flex shrink-0 items-center text-components-tabs-all-color-icon-foreground-default"
      >
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
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"></path>
          </svg>
        </template>
      </span>
    </template>

    <span class="truncate">{{ label }}</span>
    <template v-if="showNum">
      <span
        class="inline-flex shrink-0 items-center rounded-rounded-full bg-components-tabs-all-color-num-background-default px-1 py-0.5 text-xs font-medium leading-none text-components-tabs-all-color-num-foreground-default"
        >{{ num }}</span
      >
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface TabItemProps {
  label?: string;
  active?: boolean;
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

const props = withDefaults(defineProps<TabItemProps>(), {
  active: false,
  onClick: undefined,
  className: "",
  showIcon: false,
  children: undefined,
  label: "Label",
  showNum: false,
  num: "1",
});

const tabClasses = computed(() => {
  return props.active
    ? "bg-components-tabs-active-color-tab-background-default border border-components-tabs-active-color-tab-border-default shadow-sm text-components-tabs-active-color-label-foreground-default"
    : "border border-transparent text-components-tabs-inactive-color-label-foreground-default hover:bg-background-default";
});

function handleClick() {
  if (props.onClick) {
    props.onClick();
  }
}
</script>