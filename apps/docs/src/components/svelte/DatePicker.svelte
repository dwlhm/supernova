<script context="module" lang="ts">
  export interface DatePickerCell {
    key: string;
    day: number;
    label: string;
    isBlank: boolean;
    isSelected: boolean;
  }

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
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let month: DatePickerProps["month"] = 1;
  export let year: DatePickerProps["year"] = 2025;
  export let value: DatePickerProps["value"] = 0;
  export let displayValue: DatePickerProps["displayValue"] = "";
  export let placeholder: DatePickerProps["placeholder"] = "Select a date";
  export let open: DatePickerProps["open"] = false;
  export let onOpenChange: DatePickerProps["onOpenChange"];
  export let onSelect: DatePickerProps["onSelect"];
  export let className: DatePickerProps["className"] = "";
  export let showLabel: DatePickerProps["showLabel"] = true;
  export let label: DatePickerProps["label"] = "Date";
  export let showHint: DatePickerProps["showHint"] = false;
  export let hint: DatePickerProps["hint"] = "Choose a date from the calendar.";

  function toggle() {
    if (onOpenChange) {
      onOpenChange(!open);
    }
  }
  function handleSelect(day: number) {
    if (day < 1) {
      return;
    }
    if (onSelect) {
      onSelect(day);
    }
  }
  $: weekdays = () => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  };
  $: monthLabel = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const index = month > 0 && month < 13 ? month - 1 : 0;
    return months[index] + " " + year;
  };
  $: cells = () => {
    const output: DatePickerCell[] = [];
    const totalDays = new Date(year, month, 0).getDate();
    const lead = new Date(year, month - 1, 1).getDay();
    for (let i = 0; i < lead; i++) {
      output.push({
        key: "blank-" + i,
        day: 0,
        label: "",
        isBlank: true,
        isSelected: false,
      });
    }
    for (let day = 1; day <= totalDays; day++) {
      output.push({
        key: "day-" + day,
        day: day,
        label: String(day),
        isBlank: false,
        isSelected: day === value,
      });
    }
    return output;
  };
  $: displayText = () => {
    return displayValue !== "" ? displayValue : placeholder;
  };
  $: panelClasses = () => {
    return open ? "block" : "hidden";
  };
</script>

<div class={cn("relative flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <span
      class="text-sm font-medium text-components-date-picker-default-color-label-foreground-default"
      >{label}</span
    >
  {/if}<button
    type="button"
    aria-haspopup="dialog"
    class="flex h-9 w-full items-center justify-between gap-2 rounded-rounded-lg border border-components-date-picker-default-color-input-border-default bg-components-date-picker-default-color-input-background-default px-3 text-left transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
    aria-expanded={open}
    on:click={(event) => {
      toggle();
    }}
    ><span
      class={cn(
        "truncate text-sm",
        displayValue !== ""
          ? "text-components-date-picker-default-color-input-foreground-default"
          : "text-components-select-all-color-placeholder-foreground-default"
      )}>{displayText()}</span
    ><svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0 text-components-date-picker-default-color-icon-foreground-default"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><rect x="3" y="5" width="18" height="16" rx="2" /><path
        d="M3 10h18M8 3v4M16 3v4"
        stroke-linecap="round"
      /></svg
    ></button
  >
  <div
    class={cn(
      "z-50 w-full rounded-rounded-xl border border-components-date-picker-default-color-calendar-border-default bg-components-date-picker-default-color-calendar-background-default p-3 shadow-lg",
      panelClasses()
    )}
  >
    <div class="mb-3 flex items-center justify-between gap-2.5 px-1">
      <span
        class="text-sm font-semibold text-components-date-picker-default-color-dropdown-foreground-default"
        >{monthLabel()}</span
      >
    </div>
    <div class="grid grid-cols-7 gap-1">
      {#each weekdays() as weekday, index (index)}
        <span
          class="py-1 text-center text-xs font-medium text-components-date-picker-default-color-day-header-foreground-default"
          >{weekday}</span
        >
      {/each}

      {#each cells() as cell (cell.key)}
        <span class="flex items-center justify-center">
          {#if !cell.isBlank}
            <button
              type="button"
              aria-pressed={cell.isSelected}
              class={cn(
                "flex h-8 w-8 items-center justify-center rounded-rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
                cell.isSelected
                  ? "bg-components-date-picker-default-color-date-background-selected text-primary-foreground"
                  : "text-components-date-picker-default-color-date-foreground-default hover:bg-components-date-picker-default-color-date-background-hover"
              )}
              on:click={(event) => {
                handleSelect(cell.day);
              }}>{cell.day}</button
            >
          {/if}</span
        >
      {/each}
    </div>
  </div>
  {#if showHint}
    <span
      class="text-xs text-components-select-all-color-supporting-text-foreground-default"
      >{hint}</span
    >
  {/if}
</div>