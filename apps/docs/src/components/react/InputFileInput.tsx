"use client";
import * as React from "react";

export interface InputFileInputProps {
  id?: string;
  label?: string;
  buttonText?: string;
  fileName?: string;
  hint?: string;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onFileNameChange?: (fileName: string) => void;
}

import { cn } from "./utils";

function InputFileInput(props: InputFileInputProps) {
  props = {
    id: "input-file",
    label: "Picture",
    buttonText: "Choose File",
    fileName: "",
    hint: "Supported formats: PNG, JPG, or PDF.",
    errorMessage: "",
    accept: "image/png,image/jpeg,application/pdf",
    disabled: false,
    required: false,
    showLabel: true,
    showHint: true,
    className: "",
    ...props,
  };
  function hasError() {
    return props.errorMessage !== "";
  }

  function hasFile() {
    return props.fileName !== "";
  }

  function containerClasses() {
    if (hasError()) {
      return "border-components-input-file-input-color-container-border-error";
    }
    return "border-components-input-file-input-color-container-border-default focus-within:border-components-input-file-input-color-container-border-focus";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-input-file-input-color-supporting-text-foreground-error"
      : "text-components-input-file-input-color-supporting-text-foreground-default";
  }

  function displayName() {
    return hasFile() ? props.fileName : "No file chosen";
  }

  function setName(fileName: string) {
    if (props.onFileNameChange) {
      props.onFileNameChange(fileName);
    }
  }

  function clear() {
    setName("");
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", props.className)}>
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center gap-1 text-sm font-medium text-components-input-file-input-color-label-foreground-default">
          {props.label}
          {props.required ? (
            <span
              aria-hidden="true"
              className="text-components-input-file-input-color-required-indicator-foreground-default"
            >
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <label
        className={cn(
          "flex items-center gap-2.5 rounded-rounded-lg border bg-components-input-file-input-color-container-background-default px-3 py-1 transition-colors",
          containerClasses(),
          props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
      >
        <span className="inline-flex h-7 shrink-0 items-center rounded-rounded-sm bg-components-button-secondary-color-container-background-default px-3 text-xs font-medium text-components-input-file-input-color-button-label-foreground-default">
          {props.buttonText}
        </span>
        <span
          className={cn(
            "truncate py-1 text-sm",
            hasFile()
              ? "text-components-input-file-input-color-file-name-foreground-filled"
              : "text-components-input-file-input-color-file-name-foreground-default"
          )}
        >
          {displayName()}
        </span>
        <input
          type="file"
          className="sr-only"
          id={props.id}
          accept={props.accept}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={hasError()}
          onChange={(event) =>
            setName(
              event.target.files && event.target.files.length > 0
                ? event.target.files[0].name
                : ""
            )
          }
        />
        {hasFile() ? (
          <button
            type="button"
            aria-label="Remove file"
            className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-input-file-input-color-file-name-foreground-filled hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            onClick={(event) => clear()}
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
            </svg>
          </button>
        ) : null}
      </label>
      {props.showHint ? (
        <span className={cn("text-xs", supportingClasses())}>
          {supportingText()}
        </span>
      ) : null}
    </div>
  );
}

export default InputFileInput;
