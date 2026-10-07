<template>
  <th scope="col" :class="'' + (className ? ' ' + className : '')"><slot /></th>
</template>

<script setup lang="ts">
/* @composition {"root":"TableHeaderRow","part":"TableHeaderCell","parts":["TableHeaderRow","TableHeaderCell"],"slot":"replace"} */
export interface TableHeaderCellProps {
  children?: any;
  className?: string;
}

const props = defineProps<TableHeaderCellProps>();
</script>