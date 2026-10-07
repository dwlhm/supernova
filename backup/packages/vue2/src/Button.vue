<template>
  <button
    @click="async (e) => onClick?.(e)"
    :disabled="disabled || state === 'Disabled'"
    :class="
      'flex flex-row gap-2 justify-center items-center rounded-lg cursor-pointer transition-colors focus:outline-none ' +
      (variant === 'Secondary'
        ? 'bg-[#f5f5f5] text-[#171717]'
        : variant === 'Outline'
        ? 'bg-white border border-[#e5e5e5] text-[#0a0a0a]'
        : variant === 'Destructive'
        ? 'bg-[#dc2626] text-white'
        : variant === 'Link'
        ? 'bg-white text-[#cc4b12]'
        : 'bg-[#e55514] text-white') +
      ' ' +
      (size === 'Large'
        ? 'px-6 py-3 text-sm'
        : size === 'Small'
        ? 'px-3 py-1 text-sm'
        : size === 'Mini'
        ? 'px-2 py-1 text-sm'
        : 'px-4 py-2 text-sm') +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="showLeftIcon">
      <div class="flex flex-row justify-center items-center">
        <div><div class="border-[var(--color-white)]"></div></div>
      </div>
    </template>

    {{ label || $slots.default || "Button" }}
    <template v-if="showRightIcon">
      <div class="flex flex-row justify-center items-center">
        <div><div class="border-[var(--color-white)]"></div></div>
      </div>
    </template>
  </button>
</template>

<script>
export default {
  name: "button",

  props: [
    "onClick",
    "disabled",
    "state",
    "variant",
    "size",
    "className",
    "showLeftIcon",
    "label",
    "showRightIcon",
  ],
};
</script>