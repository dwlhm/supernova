<template>
  <button
    @click="async (e) => onClick?.(e)"
    :disabled="disabled || state === 'Disabled'"
    :class="
      'flex flex-row gap-2 justify-center items-center rounded-lg cursor-pointer transition-colors focus:outline-none ' +
      (variant === 'Secondary'
        ? 'bg-[#f5f5f5] text-[#171717]'
        : variant === 'Outline'
        ? 'bg-white border border-[#e5e5e5] text-[#0a0a0a]'
        : variant === 'Destructive'
        ? 'bg-[#dc2626] text-white'
        : variant === 'Link'
        ? 'bg-white text-[#cc4b12]'
        : 'bg-[#e55514] text-white') +
      ' ' +
      (size === 'Large'
        ? 'px-6 py-3 text-sm'
        : size === 'Small'
        ? 'px-3 py-1 text-sm'
        : size === 'Mini'
        ? 'px-2 py-1 text-sm'
        : 'px-4 py-2 text-sm') +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="showLeftIcon">
      <div class="flex flex-row justify-center items-center">
        <div><div class="border-[var(--color-white)]"></div></div>
      </div>
    </template>

    {{ label || $slots.default || "Button" }}
    <template v-if="showRightIcon">
      <div class="flex flex-row justify-center items-center">
        <div><div class="border-[var(--color-white)]"></div></div>
      </div>
    </template>
  </button>
</template>

<script setup lang="ts">
export interface ButtonProps {
  showLeftIcon?: boolean;
  Showlefticon?: boolean;
  showRightIcon?: boolean;
  Showrighticon?: boolean;
  leftIcon?: any;
  Lefticon?: any;
  rightIcon?: any;
  Righticon?: any;
  label?: string;
  Label?: string;
  showLabel?: boolean;
  ShowLabel?: boolean;
  roundness?: "Default" | "Round";
  Roundness?: "Default" | "Round";
  variant?: "Primary" | "Secondary" | "Outline" | "Destructive" | "Link";
  Style?: "Primary" | "Secondary" | "Outline" | "Destructive" | "Link";
  size?: "Regular" | "Large" | "Small" | "Mini";
  Size?: "Regular" | "Large" | "Small" | "Mini";
  state?: "Default" | "Focus" | "Disabled" | "Pressed";
  State?: "Default" | "Focus" | "Disabled" | "Pressed";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  disabled?: boolean;
}

const props = defineProps<ButtonProps>();
</script>