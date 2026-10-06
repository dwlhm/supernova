<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row px-4 py-3 justify-center items-center' +
      (className ? ' ' + className : '')
    "
  >
    <span class="text-sm font-normal text-[#737373]">{{ no ?? "1" }}</span
    ><slot />
  </div>
</template>

<script setup lang="ts">
export interface TableNoBodyCellProps {
  no?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<TableNoBodyCellProps>();
</script>