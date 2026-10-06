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
      'flex flex-row justify-center items-center cursor-pointer transition-colors ' +
      (size === 'Medium'
        ? 'px-4 py-2 text-sm'
        : size === 'Large'
        ? 'px-6 py-3 text-lg'
        : 'px-3 py-1.5 text-xs') +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="leftLabel">
      <div class="flex flex-row gap-3 px-2 justify-center items-center">
        <p class="text-sm font-medium text-[#0a0a0a]">
          {{ airplaneMode ?? "Airplane mode" }}
        </p>
      </div>
    </template>

    <div class="flex flex-col gap-3">
      <div class="rounded-full bg-[#e5e5e5]">
        <div class="rounded-full bg-background-page"></div>
      </div>
    </div>
    <template v-if="rightLabel">
      <div class="flex flex-row gap-3 px-2 justify-center items-center">
        <p class="text-sm font-medium text-[#0a0a0a]">
          {{ airplaneMode2 ?? "Airplane mode" }}
        </p>
      </div>
    </template>

    {{ label ?? $slots.default ?? "Button" }}
  </button>
</template>

<script setup lang="ts">
export interface SwitchButtonProps {
  leftLabel?: boolean;
  rightLabel?: boolean;
  state?: "Off" | "On" | "Disabled";
  disabled?: boolean;
  size?: "Medium" | "Small" | "Large";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  label?: string;
  id?: string;
  ariaDescribedby?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  airplaneMode?: string;
  airplaneMode2?: string;
}

const props = defineProps<SwitchButtonProps>();
</script>