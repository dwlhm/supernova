<script context="module" lang="ts">
  export interface DatePickerProps {
    open?: boolean;
    value?: number;
    month?: number;
    year?: number;
    label?: string;
    placeholder?: string;
    hint?: string;
    showHint?: boolean;
    showLabel?: boolean;
    displayValue?: string;
    className?: string;
    onSelect?: (day: number) => void;
    onOpenChange?: (open: boolean) => void;
    onMonthStep?: (delta: number) => void;
  }
</script>

<script lang="ts">
  import {
    cn,
    getDatePickerState,
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let className: DatePickerProps["className"] = "";
  export let showLabel: DatePickerProps["showLabel"] = true;
  export let label: DatePickerProps["label"] = "Date of Birth";
  export let open: DatePickerProps["open"] = false;
  export let onOpenChange: DatePickerProps["onOpenChange"];
  export let onMonthStep: DatePickerProps["onMonthStep"];
  export let onSelect: DatePickerProps["onSelect"];
  export let showHint: DatePickerProps["showHint"] = false;
  export let hint: DatePickerProps["hint"] = "Choose a date from the calendar.";
  export let value: DatePickerProps["value"] = 0;
  export let month: DatePickerProps["month"] = 1;
  export let year: DatePickerProps["year"] = 2025;
  export let placeholder: DatePickerProps["placeholder"] = 'Select a date';
  export let displayValue: DatePickerProps["displayValue"] = '';
  $: props = { className, showLabel, label, open, onOpenChange, onMonthStep, onSelect, showHint, hint, value, month, year, placeholder, displayValue };
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn("relative flex w-full flex-col gap-3", className)}
>
  {#if showLabel && label !== ""}
    <span class="text-sm font-medium text-foreground-default">{label}</span>
  {/if}<button
    type="button"
    aria-haspopup="dialog"
    class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-background-default px-3 text-left shadow-xs transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
    aria-expanded={open}
    on:click={(event) => {
      onOpenChange && onOpenChange(!open);
    }}
    ><span
      class={cn(
        "truncate text-sm",
        getDatePickerState(props).hasValue
          ? "text-foreground-default"
          : "text-foreground-subtle"
      )}>{getDatePickerState(props).displayText}</span
    ><svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0 text-foreground-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={ICON_PATHS.calendar}
      /></svg
    ></button
  >
  <div
    role="dialog"
    aria-label={label}
    class={cn(
      "absolute top-full z-50 mt-2 w-full rounded-xl border border-border-default bg-background-default p-3 shadow-lg",
      open ? "block" : "hidden"
    )}
  >
    <div class="mb-3 flex items-center justify-between gap-2 px-1">
      <button
        type="button"
        aria-label="Previous month"
        class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
        on:click={(event) => {
          onMonthStep && onMonthStep(-1);
        }}
        ><svg
          aria-hidden="true"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d={ICON_PATHS.chevronLeft}
          /></svg
        ></button
      ><span class="text-sm font-semibold text-foreground-default"
        >{getDatePickerState(props).monthLabel}</span
      ><button
        type="button"
        aria-label="Next month"
        class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
        on:click={(event) => {
          onMonthStep && onMonthStep(1);
        }}
        ><svg
          aria-hidden="true"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d={ICON_PATHS.chevronRight}
          /></svg
        ></button
      >
    </div>
    <div class="grid grid-cols-7 gap-1">
      {#each getDatePickerState(props).weekdays as weekday (weekday)}
        <span class="py-1 text-center text-xs font-medium text-foreground-muted"
          >{weekday}</span
        >
      {/each}

      {#each getDatePickerState(props).cells as cell (cell.key)}
        <span class="flex items-center justify-center">
          {#if !cell.isBlank}
            <button
              type="button"
              aria-pressed={cell.isSelected}
              class={cn(
                "flex h-8 w-8 items-center justify-center rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
                cell.isSelected
                  ? "bg-primary-default text-primary-foreground"
                  : "text-foreground-default hover:bg-background-muted"
              )}
              on:click={(event) => {
                onSelect && onSelect(cell.day);
              }}>{cell.day}</button
            >
          {/if}</span
        >
      {/each}
    </div>
  </div>
  {#if showHint}
    <span class="text-sm text-foreground-muted">{hint}</span>
  {/if}
</div>