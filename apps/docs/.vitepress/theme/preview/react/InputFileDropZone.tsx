"use client";
import * as React from "react";

export interface InputFileDropZoneProps {
  id?: string;
  name?: string;
  label?: string;
  primaryText?: string;
  supportingText?: string;
  browseText?: string;
  fileName?: string;
  fileMetadata?: string;
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
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function InputFileDropZone(props: InputFileDropZoneProps) {
  props = {
    id: "file-drop-zone",
    name: "drop-file",
    label: "Documents",
    primaryText: "or drag and drop files here",
    supportingText: "PNG, JPG, or PDF up to 10 MB",
    browseText: "Browse",
    fileName: "",
    fileMetadata: "",
    hint: "You can upload one file.",
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
      <label
        htmlFor={props.id}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border bg-background-default px-6 py-6 text-center shadow-sm transition-colors",
          getFileState(props).hasError
            ? "border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error"
            : "border-border-default border-dashed focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",
          props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) =>
          !props.disabled &&
          handleFileSelectEvent(
            event,
            props.onFileNameChange,
            props.onFilesChange
          )
        }
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6 shrink-0 text-foreground-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.upload}
          />
        </svg>
        {!getFileState(props).hasFile ? (
          <span className="flex flex-col items-center gap-1">
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5 text-base text-foreground-default">
              <span className="inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground">
                {props.browseText}
              </span>
              <span>{props.primaryText}</span>
            </span>
            <span className="text-sm text-foreground-muted">
              {props.supportingText}
            </span>
          </span>
        ) : null}
        {getFileState(props).hasFile ? (
          <span className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-foreground-default">
              {props.fileName}
            </span>
            {props.fileMetadata !== "" ? (
              <span className="text-xs text-foreground-muted">
                {props.fileMetadata}
              </span>
            ) : null}
          </span>
        ) : null}
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
      {props.showHint ? (
        <span
          id={props.id + "-hint"}
          className={cn(
            "text-sm",
            getFileState(props).hasError
              ? "text-destructive-default"
              : "text-foreground-muted"
          )}
        >
          {getFileState(props).helpText}
        </span>
      ) : null}
    </div>
  );
}

export default InputFileDropZone;
