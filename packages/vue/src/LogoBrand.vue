<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row gap-0 items-center ' +
      (size === 'Medium'
        ? 'px-4 py-2 text-sm'
        : size === 'Small'
        ? 'px-3 py-1.5 text-xs'
        : 'px-6 py-3 text-lg') +
      (className ? ' ' + className : '')
    "
  >
    <div>
      <div class="bg-[#666666]"></div>
      <div class="bg-[#808080]"></div>
      <div class="bg-[#808080]"></div>
      <div class="bg-[#808080]"></div>
      <div class="bg-[#666666]"></div>
    </div>
    <template v-if="showWordmark !== false">
      <div class="bg-[#0f0e0f]"></div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
export interface LogoBrandProps {
  showWordmark?: boolean;
  brand?:
    | "Affiliate"
    | "Komlabs"
    | "Rajaongkir"
    | "Komads"
    | "Komcards"
    | "Komchat"
    | "Komclass"
    | "Kompack"
    | "Komplace"
    | "Komship"
    | "Komtim"
    | "Komed"
    | "Komstore"
    | "Komerce";
  color?: "Brand" | "Inverse" | "Monochrome";
  size?: "Large" | "Medium" | "Small" | "Extra Small";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<LogoBrandProps>();
</script>