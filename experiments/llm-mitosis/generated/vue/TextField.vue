<template>
  <div class="lm-field">
    <template v-if="invalid">
      <p role="alert">
        Text field requires an id, a label, string value, a change callback, and
        a non-negative integer maximum length when supplied.
      </p>
    </template>

    <template v-else>
      <div class="lm-field">
        <label class="lm-field-label" :for="id"
          >{{ label }}
          <template v-if="required">
            <span aria-hidden="true"> *</span>
          </template> </label
        ><input
          class="lm-field-input"
          type="text"
          :id="id"
          :name="name"
          :value="value"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :maxLength="maxLength"
          :aria-invalid="error ? 'true' : 'false'"
          :aria-describedby="descriptionIds"
          @input="async (event) => onValueChange(event.target.value)"
        />
        <template v-if="error || helperText || showCount">
          <div class="lm-field-footer">
            <template v-if="error || helperText">
              <p
                aria-live="polite"
                :id="id + '-message'"
                :class="error ? 'lm-field-error' : ''"
              >
                <template v-if="error">
                  {{ "Error: " + error }}
                </template>

                <template v-else>
                  {{ helperText }}
                </template>
              </p>
            </template>

            <template v-if="showCount">
              <span class="lm-field-count" :id="id + '-count'"
                >{{ value.length }}
                <template v-if="maxLength !== undefined">
                  {{ " / " + maxLength }}
                </template>

                <template v-else>
                  <div _text=""></div>
                </template>
              </span>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface TextFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  id: undefined,
  label: undefined,
  value: undefined,
  onValueChange: undefined,
  maxLength: undefined,
  error: undefined,
  helperText: undefined,
  showCount: false,
  required: false,
  name: undefined,
  placeholder: undefined,
  disabled: false,
});

const invalid = computed(() => {
  return (
    !props.id ||
    !props.id.trim() ||
    !props.label ||
    !props.label.trim() ||
    typeof props.value !== "string" ||
    typeof props.onValueChange !== "function" ||
    (props.maxLength !== undefined &&
      (!Number.isInteger(props.maxLength) || props.maxLength < 0))
  );
});
const descriptionIds = computed(() => {
  return (
    [
      props.error || props.helperText ? props.id + "-message" : "",
      props.showCount ? props.id + "-count" : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined
  );
});
</script>

<style scoped>
.lm-field {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--color-foreground-neutral);
  font: var(--typography-body-regular);
  width: 100%;
}
.lm-field-label {
  font: var(--typography-body-medium);
}
.lm-field-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 36px;
  padding: 4px 12px;
  border: 1px solid var(--color-border-neutral);
  border-radius: 8px;
  background: var(--color-background-page);
  color: var(--color-foreground-neutral);
  font: inherit;
}
.lm-field-input::placeholder {
  color: var(--color-foreground-neutral-faded);
}
.lm-field-input:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
.lm-field-input[aria-invalid="true"] {
  border-style: dashed;
  border-color: var(--color-foreground-neutral);
}
.lm-field-input:disabled {
  background: var(--color-background-neutral);
  color: var(--color-foreground-neutral-faded);
  cursor: not-allowed;
}
.lm-field-footer {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  color: var(--color-foreground-neutral-faded);
}
.lm-field-footer p {
  margin: 0;
}
.lm-field-error {
  color: var(--color-foreground-neutral);
  font: var(--typography-body-bold);
}
.lm-field-count {
  white-space: nowrap;
  margin-left: auto;
  font: var(--typography-caption-regular);
}
</style>