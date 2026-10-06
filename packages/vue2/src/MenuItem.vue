<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'flex flex-col' + (className ? ' ' + className : '')"
  >
    <div class="flex flex-col gap-3 rounded-xl">
      <button
        type="button"
        class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
        @click="async (event) => onClick?.()"
      >
        <template v-if="showLeadingIcon !== false">
          <div><div class="border border-[#0a0a0a]"></div></div>
        </template>

        <template v-if="showLabel !== false">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ label ?? "Menu" }}
          </p>
        </template>

        <template v-if="showBadge">
          <div
            class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
          >
            <div class="flex flex-row gap-3 justify-center items-center">
              <p class="text-sm font-normal text-center text-[#fafafa]">
                {{ badgeLabel ?? "New" }}
              </p>
            </div>
          </div>
        </template>

        <template v-if="showTrailingIcon !== false">
          <div><div class="border border-[#0a0a0a]"></div></div>
        </template>
      </button>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "menu-item",

  props: [
    "id",
    "ariaDescribedby",
    "className",
    "onClick",
    "showLeadingIcon",
    "showLabel",
    "label",
    "showBadge",
    "badgeLabel",
    "showTrailingIcon",
  ],
};
</script>