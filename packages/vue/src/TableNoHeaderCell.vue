<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row px-4 py-3 justify-center items-center' +
      (className ? ' ' + className : '')
    "
  >
    <span class="text-sm font-medium text-[#0a0a0a]">{{
      noHeaderText ?? "No"
    }}</span
    ><slot />
  </div>
</template>

<script setup lang="ts">
export interface TableNoHeaderCellProps {
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  noHeaderText?: string;
}

const props = defineProps<TableNoHeaderCellProps>();
</script>