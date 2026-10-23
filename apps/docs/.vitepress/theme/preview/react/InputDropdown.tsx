"use client";
import * as React from "react";
import { useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface InputDropdownProps {
  value?: string;
  options?: SelectOption[];
  searchQuery?: string;
  id?: string;
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
  className?: string;
  onSelect?: (value: string) => void;
  onSearchChange?: (value: string) => void;
}

import { cn } from "./utils";

function InputDropdown(props: InputDropdownProps) {
  props = {
    value: "",
    options: [],
    searchQuery: "",
    id: "input-dropdown",
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
    className: "",
    ...props,
  };
  const [isOpen, setIsOpen] = useState(() => false);

  function hasError() {
    return props.errorMessage !== "";
  }

  function normalizedQuery() {
    return props.searchQuery.trim().toLowerCase();
  }

  function selectedLabel() {
    const matched = (props.options || []).filter(
      (option) => option.value === props.value
    );
    return matched.length > 0 ? matched[0].label : "";
  }

  function panelClasses() {
    return isOpen ? "block" : "hidden";
  }

  function triggerClasses() {
    if (hasError()) {
      return "border-components-select-all-color-trigger-border-error";
    }
    if (isOpen) {
      return "border-components-select-all-color-trigger-border-focus";
    }
    return "border-components-select-all-color-trigger-border-default";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-select-all-color-supporting-text-foreground-error"
      : "text-components-select-all-color-supporting-text-foreground-default";
  }

  function toggle() {
    if (props.disabled) {
      return;
    }
    setIsOpen(!isOpen);
  }

  function handleSearch(rawValue: string) {
    if (props.onSearchChange) {
      props.onSearchChange(rawValue);
    }
  }

  function handleSelect(selected: string) {
    setIsOpen(false);
    if (props.onSelect) {
      props.onSelect(selected);
    }
  }

  return (
    <div className={cn("relative flex w-full flex-col gap-3", props.className)}>
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center gap-1 text-sm font-medium text-components-select-all-color-label-foreground-default">
          {props.label}
          {props.required ? (
            <span
              aria-hidden="true"
              className="text-components-select-all-color-required-indicator-foreground-default"
            >
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={props.disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2.5 rounded-rounded-lg border bg-components-select-all-color-trigger-background-default px-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          triggerClasses()
        )}
        onClick={(event) => toggle()}
      >
        <span className="flex items-center gap-2.5 truncate">
          {props.showLeftIcon ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-components-select-all-color-trigger-icon-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" />
            </svg>
          ) : null}
          {selectedLabel() !== "" ? (
            <span className="truncate text-sm text-components-select-all-color-trigger-foreground-default">
              {selectedLabel()}
            </span>
          ) : null}
          {selectedLabel() === "" ? (
            <span className="truncate text-sm text-components-select-all-color-placeholder-foreground-default">
              {props.placeholder}
            </span>
          ) : null}
        </span>
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div
        role="listbox"
        className={cn(
          "absolute top-full z-50 mt-2 w-full overflow-hidden rounded-rounded-md border border-components-select-all-color-dropdown-menu-border-focus bg-components-select-all-color-dropdown-menu-background-focus shadow-lg",
          panelClasses()
        )}
      >
        {props.showSearch ? (
          <div className="flex items-center gap-2 border-b border-components-select-all-color-search-input-border-focus px-3 py-2">
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-components-select-all-color-vector-stroke-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" stroke-linecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              aria-label="Search options"
              className="w-full bg-transparent text-sm text-components-select-all-color-trigger-foreground-default outline-none placeholder:text-components-select-all-color-placeholder-foreground-default"
              value={props.searchQuery}
              onInput={(event) => handleSearch(event.target.value)}
            />
          </div>
        ) : null}
        <ul className="flex max-h-60 flex-col overflow-y-auto p-1">
          {props.options?.map((option) => (
            <li
              key={option.value}
              className={
                normalizedQuery() !== "" &&
                option.label.toLowerCase().indexOf(normalizedQuery()) === -1
                  ? "hidden"
                  : "block"
              }
            >
              <button
                type="button"
                role="option"
                aria-selected={option.value === props.value}
                disabled={option.disabled}
                className={cn(
                  "flex w-full items-center justify-between rounded-rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  option.value === props.value
                    ? "bg-components-select-all-color-wrapper-background-focus text-components-select-all-color-trigger-foreground-default"
                    : "text-components-select-all-color-trigger-foreground-default hover:bg-background-muted"
                )}
                onClick={(event) => handleSelect(option.value)}
              >
                <span className="truncate">{option.label}</span>
                {option.value === props.value ? (
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="m5 13 4 4L19 7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {props.showHint ? (
        <span className={cn("text-xs", supportingClasses())}>
          {supportingText()}
        </span>
      ) : null}
    </div>
  );
}

export default InputDropdown;
