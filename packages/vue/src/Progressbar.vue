<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'rounded-full' + (className ? ' ' + className : '')"
  >
    <div class="bg-[#e55514]"></div>
    <div class="bg-[#e55514]"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface ProgressbarProps {
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<ProgressbarProps>();
</script>