<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row px-4 py-3 w-full' + (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-row items-center w-full flex-1">
      <p class="text-sm font-normal text-[#0a0a0a]">
        {{ value ?? "Cell Value" }}
      </p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface TableBodyCellProps {
  cellValue?: any;
  value?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<TableBodyCellProps>();
</script>