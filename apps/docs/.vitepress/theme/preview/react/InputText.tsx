"use client";
import * as React from "react";

export interface InputTextProps {
  value?: string;
  name?: string;
  id?: string;
  type?: "text" | "email" | "password" | "search" | "tel" | "url" | "number";
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

import { cn } from "./utils";

function InputText(props: InputTextProps) {
  props = {
    value: "",
    name: "input-text",
    id: "input-text",
    type: "text",
    label: "Username",
    placeholder: "Max Leiter",
    hint: "Choose a unique username for your account.",
    errorMessage: "",
    disabled: false,
    required: false,
    showLabel: true,
    showHint: true,
    showCharacterCount: false,
    maxLength: 200,
    showLeftIcon: false,
    showRightIcon: false,
    className: "",
    ...props,
  };
  function hasError() {
    return props.errorMessage !== "";
  }

  function containerClasses() {
    if (hasError()) {
      return "border-components-input-text-color-container-border-error focus-within:ring-2 focus-within:ring-focus-ring-error";
    }
    return "border-components-input-text-color-container-border-default focus-within:border-components-input-text-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary";
  }

  function iconClasses() {
    if (hasError()) {
      return "text-components-input-text-color-left-icon-foreground-error";
    }
    return "text-components-input-text-color-left-icon-foreground-default";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-input-text-color-supporting-text-foreground-error"
      : "text-components-input-text-color-supporting-text-foreground-default";
  }

  function countClasses() {
    return hasError()
      ? "text-components-input-text-color-character-count-foreground-error"
      : "text-components-input-text-color-character-count-foreground-default";
  }

  function countText() {
    return props.value.length + " / " + props.maxLength;
  }

  function handleInput(rawValue: string) {
    if (props.disabled) {
      return;
    }
    if (props.onValueChange) {
      props.onValueChange(rawValue);
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", props.className)}>
      {props.showLabel && props.label !== "" ? (
        <label
          className="flex items-center gap-1 text-sm font-medium text-components-input-text-color-label-foreground-default"
          htmlFor={props.id}
        >
          {props.label}
          {props.required ? (
            <span
              aria-hidden="true"
              className="text-components-input-text-color-required-indicator-foreground-default"
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-rounded-lg border bg-components-input-text-color-container-background-default px-3 transition-colors",
          containerClasses(),
          props.disabled && "opacity-50"
        )}
      >
        {props.showLeftIcon ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            className={cn("h-4 w-4 shrink-0", iconClasses())}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" stroke-linecap="round" />
          </svg>
        ) : null}
        <input
          className="h-9 w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-components-input-text-color-placeholder-foreground-default disabled:cursor-not-allowed"
          id={props.id}
          name={props.name}
          type={props.type}
          value={props.value}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={hasError()}
          aria-describedby={props.showHint ? props.id + "-hint" : undefined}
          onInput={(event) => handleInput(event.target.value)}
        />
        {props.showRightIcon ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            className={cn("h-4 w-4 shrink-0", iconClasses())}
          >
            <circle cx="12" cy="12" r="9" />
            <path
              d="m8.5 12 2.5 2.5 4.5-5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : null}
      </div>
      {props.showHint || props.showCharacterCount ? (
        <div className="flex items-start justify-between gap-2.5">
          {props.showHint ? (
            <span
              id={props.id + "-hint"}
              className={cn("text-xs", supportingClasses())}
            >
              {supportingText()}
            </span>
          ) : null}
          {props.showCharacterCount ? (
            <span className={cn("ml-auto shrink-0 text-xs", countClasses())}>
              {countText()}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default InputText;
