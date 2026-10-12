<template>
  <td
    :class="
      cn(
        'border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle',
        cellClasses,
        className
      )
    "
  >
    <template v-if="$slots.default">
      <slot />
    </template>

    <template v-if="!$slots.default">
      <TableCellValue
        :value="value"
        :secondaryValue="secondaryValue"
        :badgeLabel="badgeLabel"
        :statusLabel="statusLabel"
        :imageSrc="imageSrc"
        :avatarInitials="avatarInitials"
        :href="href"
        :align="align"
      ></TableCellValue>
    </template>
  </td>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";
import TableCellValue from "./TableCellValue.vue";

export interface TableBodyCellProps {
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

const props = withDefaults(defineProps<TableBodyCellProps>(), {
  align: "left",
  className: "",
  children: undefined,
  value: "",
  secondaryValue: "",
  badgeLabel: "",
  statusLabel: "",
  imageSrc: "",
  avatarInitials: "",
  href: "",
});

const cellClasses = computed(() => {
  switch (props.align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "left":
    default:
      return "text-left";
  }
});
</script>