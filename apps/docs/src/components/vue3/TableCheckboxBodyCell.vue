<template>
  <td
    :class="
      cn(
        'w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center',
        className
      )
    "
  >
    <span class="relative inline-flex h-4 w-4 items-center justify-center"
      ><input
        type="checkbox"
        class="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
        :checked="checked"
        :aria-label="ariaLabel"
        @change="async (event) => handleChange()" /><svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        :class="
          cn(
            'pointer-events-none relative h-3 w-3 text-components-checkbox-on-color-icon-foreground-default',
            checked ? 'opacity-100' : 'opacity-0'
          )
        "
      >
        <path
          d="M5 13l4 4L19 7"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path></svg
    ></span>
  </td>
</template>

<script setup lang="ts">
import { cn } from "./utils";

export interface TableCheckboxBodyCellProps {
  checked?: boolean;
  rowId?: string;
  ariaLabel?: string;
  className?: string;
  onCheckedChange?: (rowId: string, checked: boolean) => void;
}

const props = withDefaults(defineProps<TableCheckboxBodyCellProps>(), {
  onCheckedChange: undefined,
  rowId: "",
  checked: false,
  className: "",
  ariaLabel: "Select row",
});

function handleChange() {
  if (props.onCheckedChange) {
    props.onCheckedChange(props.rowId, !props.checked);
  }
}
</script>