<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row gap-2 px-3 py-2 items-center rounded-full shadow ' +
      (type === 'Success'
        ? 'bg-background-page text-[#22c55e]'
        : type === 'Error'
        ? 'bg-background-page text-[#be123c]'
        : type === 'Warning'
        ? 'bg-background-page text-[#f59e0b]'
        : type === 'Info'
        ? 'bg-background-page text-[#3b82f6]'
        : 'bg-background-page text-[#0a0a0a]') +
      (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-row gap-2 items-center w-full flex-1">
      <div
        class="flex flex-row gap-3 p-2 items-center rounded-full bg-[#525252]"
      >
        <div>
          <div>
            <div>
              <div class="border border-white"></div>
              <div class="border border-white"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm font-semibold text-[#0a0a0a]">
          {{ toastText ?? "Toast Text" }}
        </p>
        <template v-if="showDescription">
          <p class="text-xs font-normal text-[#737373]">
            {{ descriptionText ?? "Toast description text here" }}
          </p>
        </template>
      </div>
    </div>
    <template v-if="showActionButton">
      <p class="text-sm font-medium text-[#0a0a0a]">
        {{ actionText ?? "Undo" }}
      </p>
    </template>

    <template v-if="showCloseButton">
      <span class="text-sm font-normal text-[#737373]">{{ close ?? "✕" }}</span>
    </template>

    <template v-if="clock !== false">
      <p class="text-xs font-normal text-[#737373]">
        {{ timestamp ?? "11.29.45 AM" }}
      </p>
    </template>

    <slot />
  </div>
</template>

<script>
export default {
  name: "toast",

  props: [
    "id",
    "ariaDescribedby",
    "type",
    "className",
    "toastText",
    "showDescription",
    "descriptionText",
    "showActionButton",
    "actionText",
    "showCloseButton",
    "close",
    "clock",
    "timestamp",
  ],
};
</script>