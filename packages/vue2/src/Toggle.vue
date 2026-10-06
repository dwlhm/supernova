<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row gap-1 justify-center items-center ' +
      (size === 'Medium'
        ? 'p-1 text-xs'
        : size === 'Large'
        ? 'p-2 text-xs'
        : 'p-1 text-xs') +
      (className ? ' ' + className : '')
    "
  >
    <div>
      <div></div>
      <div class="border-1.5 border-[#0a0a0a]"></div>
      <div class="border-1.5 border-[#0a0a0a]"></div>
    </div>
    <template v-if="showText">
      <p class="text-xs font-normal text-center text-[#0a0a0a]">
        {{ label ?? "Bold" }}
      </p>
    </template>

    <slot />
  </div>
</template>

<script>
export default {
  name: "toggle",

  props: ["id", "ariaDescribedby", "size", "className", "showText", "label"],
};
</script>