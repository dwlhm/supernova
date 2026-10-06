<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row px-4 py-3 justify-center items-center' +
      (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-row gap-2 items-center">
      <template v-if="leftLabel !== false">
        <p class="text-xs font-normal text-[#0a0a0a]">
          {{ leftLabelContent ?? "Label" }}
        </p>
      </template>

      <div class="rounded bg-background-page border border-[#e5e5e5]"></div>
      <template v-if="rightLabel !== false">
        <p class="text-xs font-normal text-[#0a0a0a]">
          {{ rightLabelContent ?? "Label" }}
        </p>
      </template>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface TableCheckboxBodyCellProps {
  leftLabel?: boolean;
  rightLabel?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  leftLabelContent?: string;
  rightLabelContent?: string;
}

const props = defineProps<TableCheckboxBodyCellProps>();
</script>