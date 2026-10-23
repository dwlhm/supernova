<template>
  <button
    type="button"
    :aria-current="active ? 'page' : undefined"
    :class="
      cn(
        'flex w-full items-center gap-2 rounded-rounded-md px-2 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        containerClasses,
        className
      )
    "
    @click="async (event) => handleClick()"
  >
    <template v-if="showLeadingIcon">
      <span :class="cn('flex shrink-0 items-center', iconClasses)">
        <template v-if="$slots.default">
          <slot />
        </template>

        <template v-if="!$slots.default">
          <svg
            aria-hidden="true"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          </svg>
        </template>
      </span>
    </template>

    <template v-if="showLabel">
      <span :class="cn('flex-1 truncate text-left', labelClasses)">{{
        label
      }}</span>
    </template>

    <template v-if="showBadge">
      <span
        :class="
          cn(
            'inline-flex shrink-0 items-center rounded-rounded-xl px-2 py-0.5 text-xs font-medium leading-none',
            badgeClasses
          )
        "
        >{{ badgeLabel }}</span
      >
    </template>

    <template v-if="showTrailingIcon">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        :class="cn('h-4 w-4 shrink-0', iconClasses)"
      >
        <path
          d="m9 6 6 6-6 6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface MainMenuProps {
  label?: string;
  active?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

const props = withDefaults(defineProps<MainMenuProps>(), {
  active: false,
  onClick: undefined,
  className: "",
  showLeadingIcon: true,
  children: undefined,
  showLabel: true,
  label: "Menu",
  showBadge: false,
  badgeLabel: "New",
  showTrailingIcon: true,
});

const containerClasses = computed(() => {
  return props.active
    ? "bg-components-main-menu-active-color-container-background-active-rebind"
    : "hover:bg-components-main-menu-all-color-container-background-hover";
});
const labelClasses = computed(() => {
  return props.active
    ? "text-components-main-menu-active-color-label-foreground-active-rebind"
    : "text-components-main-menu-default-color-label-foreground-default-rebind";
});
const iconClasses = computed(() => {
  return props.active
    ? "text-components-main-menu-active-color-icon-foreground-active-rebind"
    : "text-components-main-menu-default-color-icon-foreground-default-rebind";
});
const badgeClasses = computed(() => {
  return props.active
    ? "bg-components-main-menu-active-color-badge-background-active-rebind text-components-main-menu-active-color-badge-label-foreground-active-rebind"
    : "bg-components-main-menu-default-color-badge-background-default-rebind text-components-main-menu-default-color-badge-label-foreground-default-rebind";
});

function handleClick() {
  if (props.onClick) {
    props.onClick();
  }
}
</script>