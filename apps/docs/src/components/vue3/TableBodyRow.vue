<template>
  <tr
    :class="
      cn(
        'bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle',
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
        :onCheckedChange="(rowId, checked) => handleSelect(rowId, checked)"
      ></TableCheckboxBodyCell>
    </template>

    <template :key="index" v-for="(cell, index) in cells">
      <TableBodyCell :value="cell"></TableBodyCell>
    </template>
  </tr>
</template>

<script setup lang="ts">
import { cn } from "./utils";
import TableNoBodyCell from "./TableNoBodyCell.vue";
import TableCheckboxBodyCell from "./TableCheckboxBodyCell.vue";
import TableBodyCell from "./TableBodyCell.vue";

export interface TableBodyRowProps {
  rowId?: string;
  cells?: string[];
  no?: number;
  showNo?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  checkboxAriaLabel?: string;
  className?: string;
  onSelect?: (rowId: string, checked: boolean) => void;
}

const props = withDefaults(defineProps<TableBodyRowProps>(), {
  onSelect: undefined,
  className: "",
  showNo: false,
  no: 1,
  showCheckbox: false,
  checked: false,
  rowId: "",
  checkboxAriaLabel: "Select row",
  cells: [],
});

function handleSelect(rowId: string, checked: boolean) {
  if (props.onSelect) {
    props.onSelect(rowId, checked);
  }
}
</script>