<template>
  <div
    :class="
      'flex flex-row gap-1 px-2 py-1 justify-center items-center rounded-full ' +
      (variant === 'secondary'
        ? 'bg-[#f5f5f5] text-[#171717]'
        : variant === 'destructive'
        ? 'bg-[#fff1f2] text-[#be123c]'
        : variant === 'success'
        ? 'bg-[#f0fdf4] text-[#15803d]'
        : variant === 'warning'
        ? 'bg-[#fffbeb] text-[#b45309]'
        : variant === 'info'
        ? 'bg-[#eff6ff] text-[#1d4ed8]'
        : variant === 'outline'
        ? 'bg-white border border-[#e5e5e5] text-[#0a0a0a]'
        : 'bg-[#ffe8d9] text-[#7a2e0c]') +
      (className ? ' ' + className : '')
    "
  >
    <p class="text-xs font-medium text-[#7a2e0c]">{{ label || "Badge" }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface BadgeProps {
  label?: string;
  Label?: string;
  variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline";
  Variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline";
  children?: any;
  className?: string;
}

const props = defineProps<BadgeProps>();
</script>