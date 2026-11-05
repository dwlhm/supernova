<template>
  <span
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )
    "
    @click="
      async (event) => !disabled && onCheckedChange && onCheckedChange(!checked)
    "
  >
    <template v-if="getChoiceState(props).showLeft">
      <span class="text-sm text-foreground-default">{{ label }}</span>
    </template>

    <button
      type="button"
      role="switch"
      :id="id"
      :aria-checked="checked"
      :aria-label="getChoiceState(props).hasLabel ? label : 'Toggle setting'"
      :disabled="disabled"
      :class="
        cn(
          'relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none',
          cva(
            size,
            {
              small: 'h-5 w-9 p-0.5',
              medium: 'h-6 w-11 p-0.5',
              large: 'h-8 w-[52px] p-1',
            },
            'medium'
          ),
          checked ? 'bg-primary-default' : 'bg-background-interactive'
        )
      "
    >
      <span
        aria-hidden="true"
        :class="
          cn(
            'inline-block rounded-full bg-background-default shadow-sm transition-transform',
            cva(
              size,
              {
                small: 'h-4 w-4',
                medium: 'h-5 w-5',
                large: 'h-6 w-6',
              },
              'medium'
            ),
            checked
              ? cva(
                  size,
                  {
                    small: 'translate-x-4',
                    medium: 'translate-x-5',
                    large: 'translate-x-5',
                  },
                  'medium'
                )
              : 'translate-x-0'
          )
        "
      ></span>
    </button>
    <template v-if="getChoiceState(props).showRight">
      <span class="text-sm text-foreground-default">{{ label }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { cn, cva, getChoiceState, bindControllerProps } from "./utils";

export interface SwitchButtonProps {
  id?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const props = withDefaults(defineProps<SwitchButtonProps>(), {
  disabled: false,
  className: "",
  onCheckedChange: undefined,
  checked: false,
  label: "Label",
  id: "switch-button",
  size: "medium",
  name: 'switch',
  value: 'on',
  leftLabel: false,
  rightLabel: false,
});
</script>