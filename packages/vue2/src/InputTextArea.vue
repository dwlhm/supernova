<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'flex flex-col gap-3 w-full' + (className ? ' ' + className : '')"
  >
    <template v-if="showLabel !== false">
      <div class="flex flex-row gap-2 items-center w-full">
        <p class="text-sm font-medium text-[#0a0a0a]">
          {{ labelText ?? "Your message" }}
        </p>
        <template v-if="showRequired">
          <span class="text-sm font-medium text-[#be123c]">{{
            requiredIndicator ?? "*"
          }}</span>
        </template>
      </div>
    </template>

    <div
      class="flex flex-row gap-3 px-3 py-1 rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
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

      <div class="flex flex-row gap-3">
        <p class="text-base font-normal text-[#525252]">
          {{ placeholderText ?? "Type your message here." }}
        </p>
      </div>
      <template v-if="showRightIcon">
        <div>
          <div>
            <div>
              <div class="border-1.5 border-[#737373]"></div>
              <div class="border-1.5 border-[#737373]"></div>
            </div>
          </div>
        </div>
      </template>

      <div>
        <div class="border border-[#737373]"></div>
        <div class="border border-[#737373]"></div>
      </div>
    </div>
    <template v-if="showHint !== false">
      <div class="flex flex-row gap-3 items-center w-full">
        <p class="text-sm font-normal text-[#737373]">
          {{
            hintErrorText ?? "Your message will be copied to the support team."
          }}
        </p>
        <template v-if="showCharacterCount !== false">
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
  name: "input-text-area",

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