<template>
  <td
    :class="
      cn(
        'w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center text-sm text-components-table-default-color-cell-foreground-muted',
        className
      )
    "
  >
    {{ no }}
  </td>
</template>

<script setup lang="ts">
import { cn } from "./utils";

export interface TableNoBodyCellProps {
  no?: number;
  className?: string;
}

const props = withDefaults(defineProps<TableNoBodyCellProps>(), {
  className: "",
  no: 1,
});
</script>