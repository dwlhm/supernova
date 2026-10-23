<template>
  <span
    :class="cn('flex min-w-0 items-center gap-2', containerClasses, className)"
  >
    <template v-if="imageSrc !== ''">
      <img
        alt=""
        class="h-8 w-8 shrink-0 rounded-rounded-sm object-cover"
        aria-hidden="true"
        :src="imageSrc"
      />
    </template>

    <template v-if="avatarInitials !== ''">
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-components-avatar-all-color-container-background-default text-xs font-medium uppercase text-components-avatar-all-color-initials-foreground-default"
        aria-hidden="true"
        >{{ avatarInitials }}</span
      >
    </template>

    <span :class="cn('flex min-w-0 flex-col gap-0.5', textAlignClasses)">
      <template v-if="href !== ''">
        <a
          class="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          :href="href"
          >{{ value }}</a
        >
      </template>

      <template v-if="href === '' && value !== ''">
        <span
          class="truncate text-sm text-components-table-default-color-cell-foreground-default"
          >{{ value }}</span
        >
      </template>

      <template v-if="secondaryValue !== ''">
        <span
          class="truncate text-xs text-components-table-default-color-cell-foreground-muted"
          >{{ secondaryValue }}</span
        >
      </template>

      <template v-if="badgeLabel !== ''">
        <span
          class="inline-flex w-fit items-center gap-1 rounded-rounded-full bg-components-badge-secondary-color-container-background-default px-2 py-0.5 text-xs font-medium leading-none text-components-badge-secondary-color-label-foreground-default"
          >{{ badgeLabel }}</span
        >
      </template>

      <template v-if="statusLabel !== ''">
        <span
          class="inline-flex w-fit items-center gap-1 text-xs text-components-table-default-color-cell-foreground-muted"
          ><span
            class="h-1.5 w-1.5 shrink-0 rounded-rounded-full bg-components-avatar-all-color-status-background-online"
            aria-hidden="true"
          ></span
          >{{ statusLabel }}</span
        >
      </template>
    </span>
    <template v-if="$slots.default">
      <slot />
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface TableCellValueProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  statusLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  href?: string;
  align?: "left" | "center" | "right";
  className?: string;
  children?: any;
}

const props = withDefaults(defineProps<TableCellValueProps>(), {
  align: "left",
  className: "",
  imageSrc: "",
  avatarInitials: "",
  href: "",
  value: "",
  secondaryValue: "",
  badgeLabel: "",
  statusLabel: "",
  children: undefined,
});

const containerClasses = computed(() => {
  switch (props.align) {
    case "center":
      return "justify-center";
    case "right":
      return "flex-row-reverse justify-start";
    case "left":
    default:
      return "justify-start";
  }
});
const textAlignClasses = computed(() => {
  switch (props.align) {
    case "center":
      return "items-center text-center";
    case "right":
      return "items-end text-right";
    case "left":
    default:
      return "items-start text-left";
  }
});
</script>