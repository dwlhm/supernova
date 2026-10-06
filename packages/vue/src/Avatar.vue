<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row justify-center items-center rounded-full ' +
      (size === 'small'
        ? 'px-3 py-1.5 text-xs'
        : size === 'regular'
        ? 'px-4 py-2 text-sm'
        : size === 'large'
        ? 'px-6 py-3 text-lg'
        : '') +
      ' ' +
      (type === 'initials'
        ? 'bg-[#f5f5f5] text-[#525252]'
        : type === 'icon'
        ? 'bg-[#f5f5f5]'
        : '') +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="showStatus !== false">
      <div class="bg-[#22c55e] border-2 border-white"></div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
export interface AvatarProps {
  showStatus?: boolean;
  initialsText?: string;
  size?: "mini" | "small" | "regular" | "large" | "x-large";
  type?: "image" | "initials" | "icon";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<AvatarProps>();
</script>