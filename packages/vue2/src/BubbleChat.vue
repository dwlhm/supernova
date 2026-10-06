<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-col gap-1 px-4 py-3 rounded-2xl ' +
      (type === 'File'
        ? 'bg-[#f5f5f5] text-[#0a0a0a]'
        : type === 'Image'
        ? 'bg-[#f5f5f5] text-[#0a0a0a]'
        : type === 'Video'
        ? 'bg-[#f5f5f5] text-[#0a0a0a]'
        : 'bg-[#f5f5f5] text-[#0a0a0a]') +
      (className ? ' ' + className : '')
    "
  >
    <p class="text-sm font-normal text-[#0a0a0a]">
      {{ textMessage ?? "Message" }}
    </p>
    <template v-if="showCustomText">
      <p class="text-xs font-normal text-right text-[#737373]">
        {{ customText ?? "Additional information" }}
      </p>
    </template>

    <div class="flex flex-row gap-1 justify-between items-center w-full">
      <template v-if="showStatus">
        <p class="text-xs font-normal text-[#737373]">
          {{ incomingStatusText ?? "Received" }}
        </p>
      </template>

      <template v-if="showTime !== false">
        <p class="text-xs font-normal text-right text-[#737373]">
          {{ incomingTimeText ?? "10:24 AM" }}
        </p>
      </template>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "bubble-chat",

  props: [
    "id",
    "ariaDescribedby",
    "type",
    "className",
    "textMessage",
    "showCustomText",
    "customText",
    "showStatus",
    "incomingStatusText",
    "showTime",
    "incomingTimeText",
  ],
};
</script>