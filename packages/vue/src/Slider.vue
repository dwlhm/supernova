<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'rounded-full bg-[#f5f5f5]' + (className ? ' ' + className : '')"
  >
    <div class="bg-[#e55514]"></div>
    <button
      type="button"
      class="rounded-full bg-background-page border border-[#e55514] cursor-pointer transition-colors"
      @click="async (event) => onClick?.()"
    >
      Button</button
    ><slot />
  </div>
</template>

<script setup lang="ts">
export interface SliderProps {
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<SliderProps>();
</script>