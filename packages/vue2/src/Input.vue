<template>
  <div class="flex flex-col gap-1 w-full">
    <template v-if="label">
      <label class="text-xs font-medium text-slate-700"
        >{{ label }}
        <template v-if="required">
          <span class="text-red-500 ml-0.5">*</span>
        </template>
      </label>
    </template>

    <input
      :name="name"
      :value="value"
      :disabled="disabled"
      :required="required"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      @change="async (event) => dispatchEvent(onChange, event, false)"
      @focus="async (event) => dispatchEvent(onFocus, event, false)"
      @blur="async (event) => dispatchEvent(onBlur, event, false)"
      :class="
        'w-full px-3 py-2 text-sm rounded-md border outline-none transition-colors duration-150 box-border disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed' +
        ' ' +
        (error
          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600')
      "
    />
    <template v-if="error">
      <span class="text-xs text-red-600">{{ error }}</span>
    </template>

    <template v-if="!error && helperText">
      <span class="text-xs text-slate-500">{{ helperText }}</span>
    </template>
  </div>
</template>

<script>
import { dispatchEvent } from "./runtime/component-runtime";

export default {
  name: "input",

  props: [
    "label",
    "required",
    "name",
    "value",
    "disabled",
    "type",
    "placeholder",
    "onChange",
    "onFocus",
    "onBlur",
    "error",
    "helperText",
  ],

  data() {
    return { dispatchEvent };
  },
};
</script>