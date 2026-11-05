<template>
  <td
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'border-t border-border-default px-4 py-3 align-middle',
        cva(
          align,
          {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
          },
          'left'
        ),
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
        :buttonLabel="buttonLabel"
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
import { cn, cva, bindControllerProps } from "./utils";
import TableCellValue from "./TableCellValue.vue";

export interface TableBodyCellProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
  statusLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  href?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const props = withDefaults(defineProps<TableBodyCellProps>(), {
  align: "left",
  className: "",

  value: "Cell Value",
  secondaryValue: "",
  badgeLabel: "",
  buttonLabel: "",
  statusLabel: "",
  imageSrc: "",
  avatarInitials: "",
  href: "",
});
defineSlots<{ default?: () => any }>();
</script>