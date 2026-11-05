<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="cn('relative flex w-full flex-col gap-3', className)"
  >
    <template v-if="showLabel && label !== ''">
      <span class="text-sm font-medium text-foreground-default">{{
        label
      }}</span>
    </template>

    <button
      type="button"
      aria-haspopup="dialog"
      class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-background-default px-3 text-left shadow-xs transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
      :aria-expanded="open"
      @click="async (event) => onOpenChange && onOpenChange(!open)"
    >
      <span
        :class="
          cn(
            'truncate text-sm',
            getDatePickerState(props).hasValue
              ? 'text-foreground-default'
              : 'text-foreground-subtle'
          )
        "
        >{{ getDatePickerState(props).displayText }}</span
      ><svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-foreground-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="ICON_PATHS.calendar"
        ></path>
      </svg>
    </button>
    <div
      role="dialog"
      :aria-label="label"
      :class="
        cn(
          'absolute top-full z-50 mt-2 w-full rounded-xl border border-border-default bg-background-default p-3 shadow-lg',
          open ? 'block' : 'hidden'
        )
      "
    >
      <div class="mb-3 flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          aria-label="Previous month"
          class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
          @click="async (event) => onMonthStep && onMonthStep(-1)"
        >
          <svg
            aria-hidden="true"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="ICON_PATHS.chevronLeft"
            ></path>
          </svg></button
        ><span class="text-sm font-semibold text-foreground-default">{{
          getDatePickerState(props).monthLabel
        }}</span
        ><button
          type="button"
          aria-label="Next month"
          class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
          @click="async (event) => onMonthStep && onMonthStep(1)"
        >
          <svg
            aria-hidden="true"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="ICON_PATHS.chevronRight"
            ></path>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <template
          :key="weekday"
          v-for="(weekday, index) in getDatePickerState(props).weekdays"
        >
          <span
            class="py-1 text-center text-xs font-medium text-foreground-muted"
            >{{ weekday }}</span
          > </template
        ><template
          :key="cell.key"
          v-for="(cell, index) in getDatePickerState(props).cells"
        >
          <span class="flex items-center justify-center">
            <template v-if="!cell.isBlank">
              <button
                type="button"
                :aria-pressed="cell.isSelected"
                :class="
                  cn(
                    'flex h-8 w-8 items-center justify-center rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                    cell.isSelected
                      ? 'bg-primary-default text-primary-foreground'
                      : 'text-foreground-default hover:bg-background-muted'
                  )
                "
                @click="async (event) => onSelect && onSelect(cell.day)"
              >
                {{ cell.day }}
              </button>
            </template>
          </span>
        </template>
      </div>
    </div>
    <template v-if="showHint">
      <span class="text-sm text-foreground-muted">{{ hint }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  cn,
  getDatePickerState,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

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

const props = withDefaults(defineProps<DatePickerProps>(), {
  className: "",
  showLabel: true,
  label: "Date of Birth",
  open: false,
  onOpenChange: undefined,
  onMonthStep: undefined,
  onSelect: undefined,
  showHint: false,
  hint: "Choose a date from the calendar.",
  value: 0,
  month: 1,
  year: 2025,
  placeholder: 'Select a date',
  displayValue: '',
});
</script>