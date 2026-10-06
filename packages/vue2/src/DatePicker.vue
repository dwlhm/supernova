<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-col gap-3 ' +
      (type === 'Range Picker'
        ? 'text-[#737373]'
        : type === 'Year Picker'
        ? 'text-[#737373]'
        : 'text-[#737373]') +
      (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-row gap-3 items-center w-full">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {{ label ?? "Date of Birth" }}
      </p>
    </div>
    <div
      class="flex flex-row gap-16 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
    >
      <div class="flex flex-row gap-3 items-center w-full flex-1">
        <p class="text-base font-normal text-[#0a0a0a]">
          {{ placeholder ?? "Select a date" }}
        </p>
        <div>
          <div></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
        </div>
      </div>
    </div>
    <template v-if="hintText">
      <p class="text-xs font-normal text-[#737373]">
        {{ note ?? "Your post will be published on June 21, 2025." }}
      </p>
    </template>

    <slot />
  </div>
</template>

<script>
export default {
  name: "date-picker",

  props: [
    "id",
    "ariaDescribedby",
    "type",
    "className",
    "label",
    "placeholder",
    "hintText",
    "note",
  ],
};
</script>