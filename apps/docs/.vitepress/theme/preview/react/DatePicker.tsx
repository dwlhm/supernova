"use client";
import * as React from "react";

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

import {
  cn,
  getDatePickerState,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function DatePicker(props: DatePickerProps) {
  props = {
    open: false,
    value: 0,
    month: 1,
    year: 2025,
    label: "Date of Birth",
    placeholder: "Select a date",
    hint: "Choose a date from the calendar.",
    showHint: false,
    showLabel: true,
    displayValue: "",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn("relative flex w-full flex-col gap-3", props.className)}
    >
      {props.showLabel && props.label !== "" ? (
        <span className="text-sm font-medium text-foreground-default">
          {props.label}
        </span>
      ) : null}
      <button
        type="button"
        aria-haspopup="dialog"
        className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-background-default px-3 text-left shadow-xs transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        aria-expanded={props.open}
        onClick={(event) =>
          props.onOpenChange && props.onOpenChange(!props.open)
        }
      >
        <span
          className={cn(
            "truncate text-sm",
            getDatePickerState(props).hasValue
              ? "text-foreground-default"
              : "text-foreground-subtle"
          )}
        >
          {getDatePickerState(props).displayText}
        </span>
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-foreground-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.calendar}
          />
        </svg>
      </button>
      <div
        role="dialog"
        aria-label={props.label}
        className={cn(
          "absolute top-full z-50 mt-2 w-full rounded-xl border border-border-default bg-background-default p-3 shadow-lg",
          props.open ? "block" : "hidden"
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <button
            type="button"
            aria-label="Previous month"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
            onClick={(event) => props.onMonthStep && props.onMonthStep(-1)}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICON_PATHS.chevronLeft}
              />
            </svg>
          </button>
          <span className="text-sm font-semibold text-foreground-default">
            {getDatePickerState(props).monthLabel}
          </span>
          <button
            type="button"
            aria-label="Next month"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
            onClick={(event) => props.onMonthStep && props.onMonthStep(1)}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICON_PATHS.chevronRight}
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {getDatePickerState(props).weekdays?.map((weekday) => (
            <span
              className="py-1 text-center text-xs font-medium text-foreground-muted"
              key={weekday}
            >
              {weekday}
            </span>
          ))}
          {getDatePickerState(props).cells?.map((cell) => (
            <span className="flex items-center justify-center" key={cell.key}>
              {!cell.isBlank ? (
                <button
                  type="button"
                  aria-pressed={cell.isSelected}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
                    cell.isSelected
                      ? "bg-primary-default text-primary-foreground"
                      : "text-foreground-default hover:bg-background-muted"
                  )}
                  onClick={(event) =>
                    props.onSelect && props.onSelect(cell.day)
                  }
                >
                  {cell.day}
                </button>
              ) : null}
            </span>
          ))}
        </div>
      </div>
      {props.showHint ? (
        <span className="text-sm text-foreground-muted">{props.hint}</span>
      ) : null}
    </div>
  );
}

export default DatePicker;
