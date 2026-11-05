<template>
  <tr
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'border-b border-border-default bg-background-default transition-colors hover:bg-background-subtle',
        className
      )
    "
  >
    <template v-if="showNo">
      <TableNoBodyCell :no="no"></TableNoBodyCell>
    </template>

    <template v-if="showCheckbox">
      <TableCheckboxBodyCell
        :checked="checked"
        :rowId="rowId"
        :ariaLabel="checkboxAriaLabel"
        :onCheckedChange="
          (rowId, checked) => onSelect && onSelect(rowId, checked)
        "
      ></TableCheckboxBodyCell>
    </template>

    <template v-if="$slots.default">
      <slot />
    </template>

    <template v-if="!$slots.default">
      <template
        :key="index"
        v-for="(cell, index) in getTableBodyRowCells(cells, columns)"
      >
        <TableBodyCell
          :value="cell.value"
          :secondaryValue="cell.secondaryValue"
          :badgeLabel="cell.badgeLabel"
          :buttonLabel="cell.buttonLabel"
          :statusLabel="cell.statusLabel"
          :imageSrc="cell.imageSrc"
          :avatarInitials="cell.avatarInitials"
          :href="cell.href"
          :align="cell.align"
        ></TableBodyCell>
      </template>
    </template>
  </tr>
</template>

<script setup lang="ts">
import {
  cn,
  bindControllerProps,
  getTableBodyRowCells,
  TableColItem,
  TableCellInput,
} from "./utils";
import TableNoBodyCell from "./TableNoBodyCell.vue";
import TableCheckboxBodyCell from "./TableCheckboxBodyCell.vue";
import TableBodyCell from "./TableBodyCell.vue";

export interface TableBodyRowProps {
  rowId?: string;
  cells?: TableCellInput[];
  columns?: TableColItem[];
  no?: number;
  showNo?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  checkboxAriaLabel?: string;
  className?: string;

  onSelect?: (rowId: string, checked: boolean) => void;
}

const props = withDefaults(defineProps<TableBodyRowProps>(), {
  className: "",
  showNo: false,
  no: 1,
  showCheckbox: false,
  checked: false,
  rowId: "",
  checkboxAriaLabel: "Select row",
  onSelect: undefined,

  cells: () => [],
  columns: () => [],
});
defineSlots<{ default?: () => any }>();
</script>