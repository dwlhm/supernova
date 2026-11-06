<template>
  <td
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center',
        className
      )
    "
  >
    <span class="relative inline-flex h-3.5 w-3.5 items-center justify-center"
      ><input
        type="checkbox"
        class="peer absolute inset-0 h-3.5 w-3.5 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
        :checked="checked"
        :aria-label="ariaLabel"
        @change="
          async (event) =>
            onCheckedChange &&
            onCheckedChange({
              rowId: rowId || '',
              checked: !checked,
            })
        " /><svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        :class="
          cn(
            'pointer-events-none relative h-2.5 w-2.5 text-primary-foreground',
            checked ? 'opacity-100' : 'opacity-0'
          )
        "
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="ICON_PATHS.check"
        ></path></svg
    ></span>
  </td>
</template>

<script setup lang="ts">
import { cn, ICON_PATHS, bindControllerProps } from "./utils";

export interface TableCheckboxBodyCellProps {
  checked?: boolean;
  rowId?: string;
  ariaLabel?: string;
  className?: string;
  onCheckedChange?: (event: { rowId: string; checked: boolean }) => void;
}

const props = withDefaults(defineProps<TableCheckboxBodyCellProps>(), {
  className: "",
  checked: false,
  ariaLabel: "Select row",
  onCheckedChange: undefined,
  rowId: "",
});
</script>