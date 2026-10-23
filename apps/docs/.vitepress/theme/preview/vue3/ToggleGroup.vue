<template>
  <fieldset
    :class="
      cn(
        'flex w-full flex-col rounded-rounded-lg border border-components-toggle-group-all-color-container-border-stroke-default',
        className
      )
    "
  >
    <template v-if="showLabel">
      <legend
        class="px-4 py-2 text-xs font-medium uppercase tracking-wide text-foreground-muted"
      >
        {{ label }}
      </legend>
    </template>

    <template :key="item.id" v-for="(item, index) in items">
      <div
        class="flex items-center justify-between gap-4 border-t border-components-toggle-group-all-color-container-border-stroke-default px-4 py-3 first:border-t-0"
      >
        <span class="text-sm text-foreground-default">{{ item.label }}</span
        ><SwitchButton
          :checked="item.checked"
          :disabled="item.disabled"
          :size="size"
          :label="item.label"
          :leftLabel="false"
          :rightLabel="false"
          :onCheckedChange="(checked) => handleToggle(item.id, checked)"
        ></SwitchButton>
      </div>
    </template>
  </fieldset>
</template>

<script setup lang="ts">
import { cn } from "./utils";
import SwitchButton from "./SwitchButton.vue";

export interface ToggleGroupItem {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}
export interface ToggleGroupProps {
  items?: ToggleGroupItem[];
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  label?: string;
  className?: string;
  onToggle?: (id: string, checked: boolean) => void;
}

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  onToggle: undefined,
  className: "",
  showLabel: true,
  label: "Settings",
  items: [],
  size: "medium",
});

function handleToggle(id: string, checked: boolean) {
  if (props.onToggle) {
    props.onToggle(id, checked);
  }
}
</script>