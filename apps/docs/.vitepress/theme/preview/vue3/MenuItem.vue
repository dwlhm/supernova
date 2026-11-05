<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex w-full flex-col', className)"
  >
    <button
      type="button"
      :aria-current="active ? 'page' : undefined"
      :class="
        cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
          active
            ? 'bg-primary-subtle font-medium'
            : 'hover:bg-background-muted active:bg-background-interactive'
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
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="12" cy="12" r="9"></circle></svg
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
          >{{ label }}</span
        >
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
              active
                ? 'text-primary-subtle-foreground'
                : 'text-foreground-muted'
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
    <template v-if="$slots.default">
      <div
        :class="
          cn(
            'ml-4 flex flex-col gap-1 border-l py-1 pl-2',
            active ? 'border-primary-default' : 'border-border-default'
          )
        "
      >
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { cn, ICON_PATHS, bindControllerProps } from "./utils";

export interface MenuItemProps {
  label?: string;
  active?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  className?: string;

  onClick?: () => void;
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  className: "",
  active: false,
  onClick: undefined,
  showLeadingIcon: true,
  showLabel: true,
  label: "Menu",
  showBadge: false,
  badgeLabel: "New",
  showTrailingIcon: true,
});
defineSlots<{ default?: () => any }>();
</script>