<template>
  <div class="lm-checkbox">
    <template v-if="invalid">
      <p role="alert">
        Checkbox requires an id, a label, boolean checked state, and a change
        callback.
      </p>
    </template>

    <template v-else>
      <label
        class="lm-checkbox-label"
        :for="id"
        :data-position="labelPosition"
        :data-size="size"
        :data-disabled="disabled ? 'true' : 'false'"
        ><input
          class="lm-checkbox-input"
          type="checkbox"
          :id="id"
          :name="name"
          :value="value"
          :checked="checked"
          :disabled="disabled"
          :required="required"
          @change="async (event) => onCheckedChange(event.target.checked)"
        /><span>{{ label }}</span></label
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface CheckboxProps {
  id: string;
  name?: string;
  value?: string;
  checked: boolean;
  label: string;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium" | "large";
  labelPosition?: "left" | "right";
  onCheckedChange: (checked: boolean) => void;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  id: undefined,
  label: undefined,
  checked: undefined,
  onCheckedChange: undefined,
  labelPosition: "right",
  size: "medium",
  disabled: false,
  name: undefined,
  value: "on",
  required: false,
});

const invalid = computed(() => {
  return (
    !props.id ||
    !props.id.trim() ||
    !props.label ||
    !props.label.trim() ||
    typeof props.checked !== "boolean" ||
    typeof props.onCheckedChange !== "function"
  );
});
</script>

<style scoped>
.lm-checkbox {
  color: var(--color-foreground-neutral);
  font: var(--typography-body-regular);
}
.lm-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.lm-checkbox-label[data-position="left"] {
  flex-direction: row-reverse;
}
.lm-checkbox-label[data-size="small"] {
  gap: 6px;
}
.lm-checkbox-label[data-size="large"] {
  gap: 10px;
}
.lm-checkbox-label[data-disabled="true"] {
  color: var(--color-foreground-neutral-faded);
  cursor: not-allowed;
}
.lm-checkbox-input {
  margin: 0;
  width: 16px;
  height: 16px;
  border-radius: 6px;
  accent-color: var(--color-background-primary);
  cursor: inherit;
  flex-shrink: 0;
}
.lm-checkbox-label[data-size="small"] .lm-checkbox-input {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}
.lm-checkbox-label[data-size="large"] .lm-checkbox-input {
  width: 20px;
  height: 20px;
  border-radius: 8px;
}
.lm-checkbox-input:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}
</style>