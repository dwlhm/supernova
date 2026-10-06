<template>
  <button
    type="button"
    @click="async (e) => onClick?.(e)"
    :disabled="disabled || state === 'Disabled'"
    :id="id"
    :aria-describedby="ariaDescribedby"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :class="
      'flex flex-row justify-center items-center rounded-full shadow cursor-pointer transition-colors ' +
      (variant === 'Secondary'
        ? 'bg-[#f5f5f5]'
        : variant === 'Outline'
        ? 'bg-background-page'
        : 'bg-[#e55514]') +
      ' ' +
      (size === 'Regular'
        ? 'p-4'
        : size === 'Large'
        ? 'p-8'
        : size === 'Extended'
        ? 'px-4 py-2 text-sm'
        : 'p-3') +
      (className ? ' ' + className : '')
    "
  >
    <div>
      <div><div class="border border-white"></div></div>
    </div>
    {{ label ?? $slots.default ?? "Button" }}
  </button>
</template>

<script>
export default {
  name: "fab",

  props: [
    "onClick",
    "disabled",
    "state",
    "id",
    "ariaDescribedby",
    "ariaLabel",
    "ariaLabelledby",
    "variant",
    "size",
    "className",
    "label",
  ],
};
</script>