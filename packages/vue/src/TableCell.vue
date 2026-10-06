<template>
  <td :class="'' + (className ? ' ' + className : '')"><slot /></td>
</template>

<script setup lang="ts">
/* @composition {"root":"TableBodyRow","part":"TableCell","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
export interface TableCellProps {
  children?: any;
  className?: string;
}

const props = defineProps<TableCellProps>();
</script>