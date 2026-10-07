<template>
  <div
    :class="
      'flex flex-row gap-2 items-center ' +
      (size === 'Medium'
        ? 'px-4 py-2 text-sm'
        : size === 'Large'
        ? 'px-6 py-3 text-lg'
        : 'px-3 py-1.5 text-xs') +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="leftLabel">
      <p class="text-sm font-normal text-[#0a0a0a]">Label</p>
    </template>

    <div class="rounded-md bg-[#e55514]">
      <div><div class="border border-[var(--color-white)]"></div></div>
    </div>
    <template v-if="rightLabel">
      <p class="text-sm font-normal text-[#0a0a0a]">Label</p>
    </template>

    <slot />
  </div>
</template>

<script>
export default {
  name: "checkbox",

  props: ["size", "className", "leftLabel", "rightLabel"],
};
</script>