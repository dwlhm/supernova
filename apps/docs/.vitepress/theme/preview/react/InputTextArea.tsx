"use client";
import * as React from "react";

export interface InputTextAreaProps {
  value?: string;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
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

function InputTextArea(props: InputTextAreaProps) {
  props = {
    value: "",
    name: "input-textarea",
    id: "input-textarea",
    label: "Your message",
    placeholder: "Type your message here.",
    hint: "Your message will be copied to the support team.",
    errorMessage: "",
    disabled: false,
    required: false,
    rows: 4,
    showLabel: true,
    showHint: true,
    showCharacterCount: true,
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
      return "border-components-input-text-area-color-container-border-error focus-within:ring-2 focus-within:ring-focus-ring-error";
    }
    return "border-components-input-text-area-color-container-border-default focus-within:border-components-input-text-area-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary";
  }

  function iconClasses() {
    if (hasError()) {
      return "text-components-input-text-area-all-color-icon-foreground-error";
    }
    return "text-components-input-text-area-all-color-icon-foreground-default";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-input-text-area-color-supporting-text-foreground-error"
      : "text-components-input-text-area-color-supporting-text-foreground-default";
  }

  function countClasses() {
    return hasError()
      ? "text-components-input-text-area-color-character-count-foreground-error"
      : "text-components-input-text-area-color-character-count-foreground-default";
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
          className="flex items-center gap-1 text-sm font-medium text-components-input-text-area-color-label-foreground-default"
          htmlFor={props.id}
        >
          {props.label}
          {props.required ? (
            <span
              aria-hidden="true"
              className="text-components-input-text-area-color-required-indicator-foreground-default"
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        className={cn(
          "flex items-start gap-2.5 rounded-rounded-lg border bg-components-input-text-area-color-container-background-default px-3 py-1 transition-colors",
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
            className={cn("mt-2 h-4 w-4 shrink-0", iconClasses())}
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : null}
        <textarea
          className="w-full resize-y bg-transparent py-2 text-sm text-foreground-default outline-none placeholder:text-components-input-text-area-color-placeholder-foreground-default disabled:cursor-not-allowed"
          id={props.id}
          name={props.name}
          rows={props.rows}
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
            className={cn("mt-2 h-4 w-4 shrink-0", iconClasses())}
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

export default InputTextArea;
