"use client";
import * as React from "react";

export interface UploadedFile {
  id: string;
  name: string;
  status: string;
}
export interface InputMultipleFileUploadProps {
  id?: string;
  name?: string;
  label?: string;
  instruction?: string;
  browseText?: string;
  files?: UploadedFile[];
  fileCount?: string;
  hint?: string;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onRemove?: (id: string) => void;
  onFilesChange?: (files: unknown[]) => void;
}

import {
  cn,
  getFileState,
  handleFileSelectEvent,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function InputMultipleFileUpload(props: InputMultipleFileUploadProps) {
  props = {
    id: "multiple-file-upload",
    name: "files",
    label: "Attachments",
    instruction: "Choose one or more files",
    browseText: "Browse",
    files: [],
    fileCount: "0 of 5",
    hint: "Up to 5 files, 10 MB each.",
    errorMessage: "",
    accept: "image/png,image/jpeg,application/pdf,application/zip",
    disabled: false,
    required: true,
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
        <span className="flex items-center justify-between gap-3">
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
          <span className="text-sm text-foreground-muted">
            {props.fileCount}
          </span>
        </span>
      ) : null}
      <label
        htmlFor={props.id}
        className={cn(
          "flex h-[52px] w-full items-center gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors",
          getFileState(props).hasError
            ? "border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error"
            : "border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",
          props.disabled
            ? "pointer-events-none cursor-not-allowed opacity-50"
            : "cursor-pointer"
        )}
      >
        <span className="flex-1 truncate text-base text-foreground-muted">
          {props.instruction}
        </span>
        <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-secondary-default px-3 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover">
          {props.browseText}
        </span>
        <input
          type="file"
          className="sr-only"
          id={props.id}
          name={props.name}
          multiple
          accept={props.accept}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={getFileState(props).hasError}
          onChange={(event) =>
            !props.disabled &&
            handleFileSelectEvent(event, undefined, props.onFilesChange)
          }
        />
      </label>
      {getFileState(props).files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {getFileState(props).files?.map((file) => (
            <li
              className="flex items-center justify-between gap-2 rounded-md border border-border-default bg-background-subtle p-3"
              key={file.id}
            >
              <span className="flex min-w-0 items-center gap-2">
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
                    d={ICON_PATHS.file}
                  />
                </svg>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-foreground-default">
                    {file.name}
                  </span>
                  <span className="truncate text-xs text-foreground-muted">
                    {file.status}
                  </span>
                </span>
              </span>
              <button
                type="button"
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                disabled={props.disabled}
                aria-label={"Remove " + file.name}
                onClick={(event) =>
                  !props.disabled && props.onRemove && props.onRemove(file.id)
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
            </li>
          ))}
        </ul>
      ) : null}
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

export default InputMultipleFileUpload;
