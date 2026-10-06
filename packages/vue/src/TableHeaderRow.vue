<template>
  <tr :class="'' + (className ? ' ' + className : '')">
    <slot />
  </tr>
</template>

<script setup lang="ts">
/* @composition {"root":"TableHeaderRow","part":"TableHeaderRow","parts":["TableHeaderRow","TableHeaderCell"],"slot":"replace"} */
export interface TableHeaderRowProps {
  children?: any;
  className?: string;
}

const props = defineProps<TableHeaderRowProps>();
</script>