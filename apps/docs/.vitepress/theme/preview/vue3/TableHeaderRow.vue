<template>
  <tr
    :data-ctrl="typeof bindControllerProps"
    :class="cn('border-b border-border-default bg-background-muted', className)"
  >
    <template v-if="showNo">
      <TableNoHeaderCell></TableNoHeaderCell>
    </template>

    <template v-if="showCheckbox">
      <TableCheckboxHeaderCell
        :checked="allSelected"
        :ariaLabel="checkboxAriaLabel"
        :onCheckedChange="(checked) => onSelectAll && onSelectAll(checked)"
      ></TableCheckboxHeaderCell>
    </template>

    <template v-if="$slots.default">
      <slot />
    </template>

    <template v-if="!$slots.default">
      <template :key="column.id" v-for="(column, index) in columns">
        <th
          scope="col"
          :class="
            cn(
              'whitespace-nowrap bg-background-muted px-4 py-3 text-sm font-medium text-foreground-default',
              cva(
                column.align,
                {
                  left: 'text-left',
                  center: 'text-center',
                  right: 'text-right',
                },
                'left'
              )
            )
          "
        >
          {{ column.label }}
        </th>
      </template>
    </template>
  </tr>
</template>

<script setup lang="ts">
import { cn, cva, bindControllerProps } from "./utils";
import TableNoHeaderCell from "./TableNoHeaderCell.vue";
import TableCheckboxHeaderCell from "./TableCheckboxHeaderCell.vue";

export interface TableHeaderColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
}
export interface TableHeaderRowProps {
  columns?: TableHeaderColumn[];
  showCheckbox?: boolean;
  showNo?: boolean;
  allSelected?: boolean;
  checkboxAriaLabel?: string;
  className?: string;

  onSelectAll?: (checked: boolean) => void;
}

const props = withDefaults(defineProps<TableHeaderRowProps>(), {
  className: "",
  showNo: false,
  showCheckbox: false,
  allSelected: false,
  checkboxAriaLabel: "Select all rows",
  onSelectAll: undefined,

  columns: () => [],
});
defineSlots<{ default?: () => any }>();
</script>