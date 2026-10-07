<template>
  <tr :class="'' + (className ? ' ' + className : '')">
    <slot />
  </tr>
</template>

<script setup lang="ts">
/* @composition {"root":"TableBodyRow","part":"TableBodyRow","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
export interface TableBodyRowProps {
  children?: any;
  className?: string;
}

const props = defineProps<TableBodyRowProps>();
</script>