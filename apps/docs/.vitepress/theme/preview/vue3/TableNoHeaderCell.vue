<template>
  <th
    scope="col"
    :class="
      cn(
        'w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center text-sm font-medium text-foreground-default',
        className
      )
    "
  >
    {{ label }}
  </th>
</template>

<script setup lang="ts">
import { cn } from "./utils";

export interface TableNoHeaderCellProps {
  label?: string;
  className?: string;
}

const props = withDefaults(defineProps<TableNoHeaderCellProps>(), {
  className: "",
  label: "No",
});
</script>