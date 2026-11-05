<script context="module" lang="ts">
  export interface TableCheckboxHeaderCellProps {
    checked?: boolean;
    indeterminate?: boolean;
    ariaLabel?: string;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn, ICON_PATHS, bindControllerProps } from "./utils";

  export let className: TableCheckboxHeaderCellProps["className"] = "";
  export let checked: TableCheckboxHeaderCellProps["checked"] = false;
  export let indeterminate: TableCheckboxHeaderCellProps["indeterminate"] =
    false;
  export let ariaLabel: TableCheckboxHeaderCellProps["ariaLabel"] =
    "Select all rows";
  export let onCheckedChange: TableCheckboxHeaderCellProps["onCheckedChange"];
</script>

<th
  scope="col"
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center",
    className
  )}
  ><span class="relative inline-flex h-4 w-4 items-center justify-center"
    ><input
      type="checkbox"
      class="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
      {checked}
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      on:change={(event) => {
        onCheckedChange && onCheckedChange(!checked);
      }}
    /><span
      aria-hidden="true"
      class={cn(
        "pointer-events-none absolute h-0.5 w-2 rounded-full bg-primary-foreground",
        indeterminate ? "opacity-100" : "opacity-0"
      )}
    /><svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      class={cn(
        "pointer-events-none relative h-3 w-3 text-primary-foreground",
        checked && !indeterminate ? "opacity-100" : "opacity-0"
      )}
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={ICON_PATHS.check}
      /></svg
    ></span
  ></th
>