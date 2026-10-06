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

<script>
export default {
  name: "logo-brand",

  props: ["id", "ariaDescribedby", "size", "className", "showWordmark"],
};
</script>