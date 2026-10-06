<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row gap-3 items-center' + (className ? ' ' + className : '')
    "
  >
    <div><div class="border border-[#e55514]"></div></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface SpinnerProps {
  size?: "12" | "16" | "24" | "32";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<SpinnerProps>();
</script>