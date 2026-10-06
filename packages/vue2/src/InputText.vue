<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'flex flex-col gap-3' + (className ? ' ' + className : '')"
  >
    <template v-if="showLabel !== false">
      <div class="flex flex-row gap-2 items-center w-full">
        <p class="text-sm font-medium text-[#0a0a0a]">
          {{ labelText ?? "Username" }}
        </p>
        <template v-if="showRequired !== false">
          <span class="text-sm font-medium text-[#be123c]">{{
            requiredIndicator ?? "*"
          }}</span>
        </template>
      </div>
    </template>

    <div
      class="flex flex-row gap-3 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
    >
      <template v-if="showLeftIcon">
        <div>
          <div>
            <div>
              <div class="border-1.5 border-[#737373]"></div>
              <div class="border-1.5 border-[#737373]"></div>
            </div>
          </div>
        </div>
      </template>

      <div class="flex flex-row gap-3 w-full flex-1">
        <p class="text-base font-normal text-[#525252]">
          {{ placeholderText ?? "Max Leiter" }}
        </p>
      </div>
      <template v-if="showRightIcon !== false">
        <div>
          <div>
            <div>
              <div class="border-1.5 border-[#737373]"></div>
              <div class="border-1.5 border-[#737373]"></div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-if="showHint !== false">
      <div class="flex flex-row gap-3 items-center w-full">
        <p class="text-sm font-normal text-[#737373]">
          {{ hintErrorText ?? "Choose a unique username for your account." }}
        </p>
        <template v-if="showCharacterCount">
          <p class="text-sm font-normal text-right text-[#737373]">
            {{ characterCount ?? "0 / 200" }}
          </p>
        </template>
      </div>
    </template>

    <slot />
  </div>
</template>

<script>
export default {
  name: "input-text",

  props: [
    "id",
    "ariaDescribedby",
    "className",
    "showLabel",
    "labelText",
    "showRequired",
    "requiredIndicator",
    "showLeftIcon",
    "placeholderText",
    "showRightIcon",
    "showHint",
    "hintErrorText",
    "showCharacterCount",
    "characterCount",
  ],
};
</script>