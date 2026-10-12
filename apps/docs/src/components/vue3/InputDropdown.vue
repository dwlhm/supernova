<template>
  <div :class="cn('relative flex w-full flex-col gap-3', className)">
    <template v-if="showLabel && label !== ''">
      <span
        class="flex items-center gap-1 text-sm font-medium text-components-select-all-color-label-foreground-default"
        >{{ label }}
        <template v-if="required">
          <span
            aria-hidden="true"
            class="text-components-select-all-color-required-indicator-foreground-default"
          >
            *
          </span>
        </template>
      </span>
    </template>

    <button
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :disabled="disabled"
      :class="
        cn(
          'flex h-9 w-full items-center justify-between gap-2.5 rounded-rounded-lg border bg-components-select-all-color-trigger-background-default px-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50',
          triggerClasses
        )
      "
      @click="async (event) => toggle()"
    >
      <span class="flex items-center gap-2.5 truncate">
        <template v-if="showLeftIcon">
          <svg
            aria-hidden="true"
            class="h-4 w-4 shrink-0 text-components-select-all-color-trigger-icon-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round"></path>
          </svg>
        </template>

        <template v-if="selectedLabel !== ''">
          <span
            class="truncate text-sm text-components-select-all-color-trigger-foreground-default"
            >{{ selectedLabel }}</span
          >
        </template>

        <template v-if="selectedLabel === ''">
          <span
            class="truncate text-sm text-components-select-all-color-placeholder-foreground-default"
            >{{ placeholder }}</span
          >
        </template> </span
      ><svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>
    <div
      role="listbox"
      :class="
        cn(
          'absolute top-full z-50 mt-2 w-full overflow-hidden rounded-rounded-md border border-components-select-all-color-dropdown-menu-border-focus bg-components-select-all-color-dropdown-menu-background-focus shadow-lg',
          panelClasses
        )
      "
    >
      <template v-if="showSearch">
        <div
          class="flex items-center gap-2 border-b border-components-select-all-color-search-input-border-focus px-3 py-2"
        >
          <svg
            aria-hidden="true"
            class="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-3.5-3.5" stroke-linecap="round"></path></svg
          ><input
            type="search"
            placeholder="Search"
            aria-label="Search options"
            class="w-full bg-transparent text-sm text-components-select-all-color-trigger-foreground-default outline-none placeholder:text-components-select-all-color-placeholder-foreground-default"
            :value="searchQuery"
            @input="async (event) => handleSearch(event.target.value)"
          />
        </div>
      </template>

      <ul class="flex max-h-60 flex-col overflow-y-auto p-1">
        <template :key="option.value" v-for="(option, index) in options">
          <li
            :class="
              normalizedQuery !== '' &&
              option.label.toLowerCase().indexOf(normalizedQuery) === -1
                ? 'hidden'
                : 'block'
            "
          >
            <button
              type="button"
              role="option"
              :aria-selected="option.value === value"
              :disabled="option.disabled"
              :class="
                cn(
                  'flex w-full items-center justify-between rounded-rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  option.value === value
                    ? 'bg-components-select-all-color-wrapper-background-focus text-components-select-all-color-trigger-foreground-default'
                    : 'text-components-select-all-color-trigger-foreground-default hover:bg-background-muted'
                )
              "
              @click="async (event) => handleSelect(option.value)"
            >
              <span class="truncate">{{ option.label }}</span>
              <template v-if="option.value === value">
                <svg
                  aria-hidden="true"
                  class="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="m5 13 4 4L19 7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </template>
            </button>
          </li>
        </template>
      </ul>
    </div>
    <template v-if="showHint">
      <span :class="cn('text-xs', supportingClasses)">{{
        supportingText
      }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { cn } from "./utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface InputDropdownProps {
  value?: string;
  options?: SelectOption[];
  searchQuery?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  showSearch?: boolean;
  showLeftIcon?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
  onSearchChange?: (value: string) => void;
}

const props = withDefaults(defineProps<InputDropdownProps>(), {
  errorMessage: "",
  searchQuery: "",
  options: [],
  value: "",
  hint: "Select your department or area of work.",
  disabled: false,
  onSearchChange: undefined,
  onSelect: undefined,
  className: "",
  showLabel: true,
  label: "Department",
  required: false,
  showLeftIcon: false,
  placeholder: "Choose department",
  showSearch: true,
  showHint: false,
});
const isOpen = ref(false);

const hasError = computed(() => {
  return props.errorMessage !== "";
});
const normalizedQuery = computed(() => {
  return props.searchQuery.trim().toLowerCase();
});
const selectedLabel = computed(() => {
  const matched = (props.options || []).filter(
    (option) => option.value === props.value
  );
  return matched.length > 0 ? matched[0].label : "";
});
const panelClasses = computed(() => {
  return isOpen.value ? "block" : "hidden";
});
const triggerClasses = computed(() => {
  if (hasError) {
    return "border-components-select-all-color-trigger-border-error";
  }
  if (isOpen.value) {
    return "border-components-select-all-color-trigger-border-focus";
  }
  return "border-components-select-all-color-trigger-border-default";
});
const supportingText = computed(() => {
  return hasError ? props.errorMessage : props.hint;
});
const supportingClasses = computed(() => {
  return hasError
    ? "text-components-select-all-color-supporting-text-foreground-error"
    : "text-components-select-all-color-supporting-text-foreground-default";
});

function toggle() {
  if (props.disabled) {
    return;
  }
  isOpen.value = !isOpen.value;
}
function handleSearch(rawValue: string) {
  if (props.onSearchChange) {
    props.onSearchChange(rawValue);
  }
}
function handleSelect(selected: string) {
  isOpen.value = false;
  if (props.onSelect) {
    props.onSelect(selected);
  }
}
</script>