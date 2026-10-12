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
  import { cn } from "./utils";

  export let onCheckedChange: TableCheckboxBodyCellProps["onCheckedChange"];
  export let rowId: TableCheckboxBodyCellProps["rowId"] = "";
  export let checked: TableCheckboxBodyCellProps["checked"] = false;
  export let className: TableCheckboxBodyCellProps["className"] = "";
  export let ariaLabel: TableCheckboxBodyCellProps["ariaLabel"] = "Select row";

  function handleChange() {
    if (onCheckedChange) {
      onCheckedChange(rowId, !checked);
    }
  }
</script>

<td
  class={cn(
    "w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center",
    className
  )}
  ><span class="relative inline-flex h-4 w-4 items-center justify-center"
    ><input
      type="checkbox"
      class="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
      {checked}
      aria-label={ariaLabel}
      on:change={(event) => {
        handleChange();
      }}
    /><svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      class={cn(
        "pointer-events-none relative h-3 w-3 text-components-checkbox-on-color-icon-foreground-default",
        checked ? "opacity-100" : "opacity-0"
      )}
      ><path
        d="M5 13l4 4L19 7"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    ></span
  ></td
>