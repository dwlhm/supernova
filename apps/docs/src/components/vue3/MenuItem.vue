<template>
  <div :class="cn('flex w-full flex-col', className)">
    <button
      type="button"
      :class="
        cn(
          'flex w-full items-center gap-2 rounded-rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
          containerClasses
        )
      "
      @click="async (event) => handleClick()"
    >
      <template v-if="showLeadingIcon">
        <span :class="cn('flex shrink-0 items-center', iconClasses)"
          ><svg
            aria-hidden="true"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="12" cy="12" r="9"></circle></svg
        ></span>
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
    <template v-if="$slots.default">
      <div
        :class="
          cn(
            'ml-4 flex flex-col gap-1 border-l py-1 pl-2',
            submenuBorderClasses
          )
        "
      >
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface MenuItemProps {
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

const props = withDefaults(defineProps<MenuItemProps>(), {
  active: false,
  onClick: undefined,
  className: "",
  showLeadingIcon: true,
  showLabel: true,
  label: "Menu",
  showBadge: false,
  badgeLabel: "New",
  showTrailingIcon: true,
  children: undefined,
});

const containerClasses = computed(() => {
  if (props.active) {
    return "bg-components-menu-item-active-color-container-background-active-rebind";
  }
  return "hover:bg-components-menu-item-hover-color-container-background-hover-rebind";
});
const labelClasses = computed(() => {
  return props.active
    ? "text-components-menu-item-active-color-label-foreground-active-rebind"
    : "text-components-menu-item-default-color-label-foreground-default-rebind";
});
const iconClasses = computed(() => {
  return props.active
    ? "text-components-menu-item-active-color-icon-foreground-active-rebind"
    : "text-components-menu-item-default-color-icon-foreground-default-rebind";
});
const badgeClasses = computed(() => {
  return props.active
    ? "bg-components-menu-item-active-color-badge-background-active-rebind text-components-menu-item-active-color-badge-label-foreground-active-rebind"
    : "bg-components-menu-item-default-color-badge-background-default-rebind text-components-menu-item-default-color-badge-label-foreground-default-rebind";
});
const submenuBorderClasses = computed(() => {
  return props.active
    ? "border-components-menu-item-active-color-submenu-content-border-active-rebind"
    : "border-border-default";
});

function handleClick() {
  if (props.onClick) {
    props.onClick();
  }
}
</script>