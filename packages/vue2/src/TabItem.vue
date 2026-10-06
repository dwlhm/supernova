<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg' +
      (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-row gap-1 justify-center items-center">
      <template v-if="showIcon">
        <div>
          <div class="border-2 border-[#0a0a0a]"></div>
          <div class="border-2 border-[#0a0a0a]"></div>
          <div class="border-2 border-[#0a0a0a]"></div>
          <div class="border-2 border-[#0a0a0a]"></div>
        </div>
      </template>

      <p class="text-sm font-medium text-[#0f0e0f]">{{ label ?? "Label" }}</p>
      <template v-if="showNum">
        <div
          class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
        >
          <span class="text-xs font-medium text-[#7a2e0c]">{{
            num ?? "1"
          }}</span>
        </div>
      </template>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "tab-item",

  props: [
    "id",
    "ariaDescribedby",
    "className",
    "showIcon",
    "label",
    "showNum",
    "num",
  ],
};
</script>