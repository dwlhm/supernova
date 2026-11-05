<script context="module" lang="ts">
  export interface TableCheckboxBodyCellProps {
    checked?: boolean;
    rowId?: string;
    ariaLabel?: string;
    className?: string;
    onCheckedChange?: (rowId: string, checked: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn, ICON_PATHS, bindControllerProps } from "./utils";

  export let className: TableCheckboxBodyCellProps["className"] = "";
  export let checked: TableCheckboxBodyCellProps["checked"] = false;
  export let ariaLabel: TableCheckboxBodyCellProps["ariaLabel"] = "Select row";
  export let onCheckedChange: TableCheckboxBodyCellProps["onCheckedChange"];
  export let rowId: TableCheckboxBodyCellProps["rowId"] = "";
</script>

<td
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center",
    className
  )}
  ><span class="relative inline-flex h-4 w-4 items-center justify-center"
    ><input
      type="checkbox"
      class="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
      {checked}
      aria-label={ariaLabel}
      on:change={(event) => {
        onCheckedChange && onCheckedChange(rowId || "", !checked);
      }}
    /><svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      class={cn(
        "pointer-events-none relative h-3 w-3 text-primary-foreground",
        checked ? "opacity-100" : "opacity-0"
      )}
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={ICON_PATHS.check}
      /></svg
    ></span
  ></td
>