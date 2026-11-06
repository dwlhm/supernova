<template>
  <button
    type="button"
    :data-ctrl="typeof bindControllerProps"
    :aria-current="active ? 'page' : undefined"
    :class="
      cn(
        'flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        active
          ? 'bg-primary-subtle hover:bg-primary-muted'
          : 'hover:bg-background-muted active:bg-background-interactive',
        className
      )
    "
    @click="async (event) => onClick && onClick()"
  >
    <template v-if="showLeadingIcon">
      <span
        :class="
          cn(
            'flex shrink-0 items-center',
            active
              ? 'text-primary-subtle-foreground'
              : 'text-foreground-default'
          )
        "
        ><svg
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
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect></svg
      ></span>
    </template>

    <template v-if="showLabel">
      <span
        :class="
          cn(
            'flex-1 truncate text-left',
            active
              ? 'text-primary-subtle-foreground'
              : 'text-foreground-default'
          )
        "
        ><slot
      /></span>
    </template>

    <template v-if="showBadge">
      <span
        :class="
          cn(
            'inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none',
            active
              ? 'bg-primary-default text-primary-foreground'
              : 'bg-primary-subtle text-primary-subtle-foreground'
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
        :class="
          cn(
            'h-4 w-4 shrink-0',
            active ? 'text-primary-subtle-foreground' : 'text-foreground-muted'
          )
        "
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="ICON_PATHS.chevronRight"
        ></path>
      </svg>
    </template>
  </button>
</template>

<script setup lang="ts">
import { cn, ICON_PATHS, bindControllerProps } from "./utils";

export interface MainMenuProps {
  active?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  className?: string;

  onClick?: () => void;
}

const props = withDefaults(defineProps<MainMenuProps>(), {
  active: false,
  className: "",
  onClick: undefined,
  showLeadingIcon: true,
  showLabel: true,

  showBadge: false,
  badgeLabel: "",
  showTrailingIcon: true,
});
defineSlots<{ default?: () => any }>();
</script>