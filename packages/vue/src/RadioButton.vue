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
      'flex flex-row gap-2 items-center cursor-pointer transition-colors ' +
      (size === 'Medium'
        ? 'px-4 py-2 text-sm'
        : size === 'Large'
        ? 'px-6 py-3 text-lg'
        : 'px-3 py-1.5 text-xs') +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="leftLabel">
      <p class="text-sm font-normal text-[#0a0a0a]">
        {{ leftLabelContent ?? "Label" }}
      </p>
    </template>

    <div
      class="rounded-full bg-background-page border border-[#e5e5e5] shadow-sm"
    ></div>
    <template v-if="rightLabel">
      <p class="text-sm font-normal text-[#0a0a0a]">
        {{ rightLabelContent ?? "Label" }}
      </p>
    </template>
  </button>
</template>

<script setup lang="ts">
export interface RadioButtonProps {
  leftLabel?: boolean;
  rightLabel?: boolean;
  state?: "off" | "on" | "Disabled";
  disabled?: boolean;
  size?: "Medium" | "Small" | "Large";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  leftLabelContent?: string;
  rightLabelContent?: string;
}

const props = defineProps<RadioButtonProps>();
</script>