<template>
  <tr
    :class="
      cn(
        'border-b border-components-table-default-color-divider-border-default',
        className
      )
    "
  >
    <template v-if="showNo">
      <TableNoHeaderCell></TableNoHeaderCell>
    </template>

    <template v-if="showCheckbox">
      <TableCheckboxHeaderCell
        :checked="allSelected"
        :ariaLabel="checkboxAriaLabel"
        :onCheckedChange="(checked) => handleSelectAll(checked)"
      ></TableCheckboxHeaderCell>
    </template>

    <template :key="column.id" v-for="(column, index) in columns">
      <th
        scope="col"
        :class="
          cn(
            'whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default',
            alignmentClasses(column.align)
          )
        "
      >
        {{ column.label }}
      </th>
    </template>
  </tr>
</template>

<script setup lang="ts">
import { cn } from "./utils";
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
  onSelectAll: undefined,
  className: "",
  showNo: false,
  showCheckbox: false,
  allSelected: false,
  checkboxAriaLabel: "Select all rows",
  columns: [],
});

function alignmentClasses(align: string) {
  if (align === "center") {
    return "text-center";
  }
  if (align === "right") {
    return "text-right";
  }
  return "text-left";
}
function handleSelectAll(checked: boolean) {
  if (props.onSelectAll) {
    props.onSelectAll(checked);
  }
}
</script>