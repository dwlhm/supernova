"use client";
import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface InputDropdownProps {
  open?: boolean;
  value?: string;
  options?: SelectOption[];
  searchQuery?: string;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  showSearch?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

import { cn, getDropdownState, ICON_PATHS, bindControllerProps } from "./utils";

function InputDropdown(props: InputDropdownProps) {
  props = {
    open: false,
    value: "",
    options: [],
    searchQuery: "",
    id: "input-dropdown",
    name: "dropdown",
    label: "Department",
    placeholder: "Choose department",
    hint: "Select your department or area of work.",
    errorMessage: "",
    disabled: false,
    required: false,
    showLabel: true,
    showHint: false,
    showSearch: true,
    showLeftIcon: false,
    showRightIcon: true,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      id={props.id}
      data-ctrl={typeof bindControllerProps}
      className={cn("relative flex w-full flex-col gap-3", props.className)}
    >
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center gap-1 text-sm font-medium text-foreground-default">
          {props.label}
          {props.required ? (
            <span aria-hidden="true" className="text-destructive-default">
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={getDropdownState(props).isOpen}
        aria-invalid={getDropdownState(props).hasError}
        disabled={props.disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border bg-background-default px-3 text-left shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          getDropdownState(props).hasError
            ? "border-destructive-border focus:ring-2 focus:ring-focus-ring-error"
            : getDropdownState(props).isOpen
            ? "border-primary-border-emphasis ring-2 ring-focus-ring-primary"
            : "border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary"
        )}
        onClick={(event) =>
          !props.disabled &&
          props.onOpenChange &&
          props.onOpenChange(!props.open)
        }
      >
        <span className="flex items-center gap-1.5 truncate">
          {props.showLeftIcon ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-foreground-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" d={ICON_PATHS.menu} />
            </svg>
          ) : null}
          <span
            className={cn(
              "truncate text-sm",
              getDropdownState(props).selectedLabel !== ""
                ? "text-foreground-default"
                : "text-foreground-subtle"
            )}
          >
            {getDropdownState(props).selectedLabel !== "" ? (
              <>{getDropdownState(props).selectedLabel}</>
            ) : (
              <>{props.placeholder}</>
            )}
          </span>
        </span>
        {props.showRightIcon ? (
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
              d={ICON_PATHS.chevronDown}
            />
          </svg>
        ) : null}
      </button>
      <div
        className={cn(
          "absolute top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-border-default bg-background-default shadow-lg",
          getDropdownState(props).isOpen ? "block" : "hidden"
        )}
      >
        {props.showSearch ? (
          <div className="flex items-center gap-2 border-b border-border-default px-3 py-2">
            <input
              type="search"
              placeholder="Search"
              aria-label="Search options"
              className="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-subtle"
              value={props.searchQuery}
              onChange={(event) =>
                props.onSearchChange && props.onSearchChange(event.target.value)
              }
            />
          </div>
        ) : null}
        <div
          role="listbox"
          className="flex max-h-60 flex-col overflow-y-auto p-1"
          aria-label={props.label}
        >
          {getDropdownState(props).filtered?.map((option) => (
            <button
              type="button"
              role="option"
              key={option.value}
              aria-selected={option.value === props.value}
              disabled={option.disabled}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                option.value === props.value
                  ? "bg-background-muted text-foreground-default"
                  : "text-foreground-default hover:bg-background-muted"
              )}
              onClick={(event) =>
                props.onSelect && props.onSelect(option.value)
              }
            >
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      {props.showHint ? (
        <span
          className={cn(
            "text-sm",
            getDropdownState(props).hasError
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}
        >
          {getDropdownState(props).helpText}
        </span>
      ) : null}
    </div>
  );
}

export default InputDropdown;
