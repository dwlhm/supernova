"use client";
import * as React from "react";

export interface InputFileInputProps {
  id?: string;
  name?: string;
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
  onFilesChange?: (files: unknown[]) => void;
}

import {
  cn,
  getFileState,
  handleFileSelectEvent,
  clearFileInputEvent,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function InputFileInput(props: InputFileInputProps) {
  props = {
    id: "input-file",
    name: "file",
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
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn("flex w-full flex-col gap-3", props.className)}
    >
      {props.showLabel && props.label !== "" ? (
        <label
          className="flex items-center gap-1 text-sm font-medium text-foreground-default"
          htmlFor={props.id}
        >
          {props.label}
          {props.required ? (
            <span aria-hidden="true" className="text-destructive-default">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border bg-background-default px-3 py-1 shadow-xs transition-colors",
          getFileState(props).hasError
            ? "border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error"
            : "border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",
          props.disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <label
          htmlFor={props.id}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3",
            props.disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          <span className="inline-flex h-7 shrink-0 items-center rounded-sm bg-secondary-default px-3 text-sm font-medium text-secondary-foreground">
            {props.buttonText}
          </span>
          <span
            className={cn(
              "truncate py-1 text-sm",
              getFileState(props).hasFile
                ? "text-foreground-default"
                : "text-foreground-subtle"
            )}
          >
            {getFileState(props).displayName}
          </span>
          <input
            type="file"
            className="sr-only"
            id={props.id}
            name={props.name}
            accept={props.accept}
            disabled={props.disabled}
            required={props.required}
            aria-invalid={getFileState(props).hasError}
            aria-describedby={props.showHint ? props.id + "-hint" : undefined}
            onChange={(event) =>
              !props.disabled &&
              handleFileSelectEvent(
                event,
                props.onFileNameChange,
                props.onFilesChange
              )
            }
          />
        </label>
        {getFileState(props).hasFile ? (
          <button
            type="button"
            aria-label="Remove file"
            className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none"
            disabled={props.disabled}
            onClick={(event) =>
              !props.disabled &&
              clearFileInputEvent(
                event,
                props.onFileNameChange,
                props.onFilesChange
              )
            }
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d={ICON_PATHS.close} />
            </svg>
          </button>
        ) : null}
      </div>
      {props.showHint ? (
        <span
          id={props.id + "-hint"}
          className={cn(
            "text-sm",
            getFileState(props).hasError
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}
        >
          {getFileState(props).helpText}
        </span>
      ) : null}
    </div>
  );
}

export default InputFileInput;
