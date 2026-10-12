"use client";
import * as React from "react";

export interface UploadedFile {
  id: string;
  name: string;
  status: string;
}
export interface InputMultipleFileUploadProps {
  id?: string;
  label?: string;
  instruction?: string;
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
}

import { cn } from "./utils";

function InputMultipleFileUpload(props: InputMultipleFileUploadProps) {
  props = {
    id: "multiple-file-upload",
    label: "Attachments",
    instruction: "Choose one or more files",
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
  function hasError() {
    return props.errorMessage !== "";
  }

  function containerClasses() {
    if (hasError()) {
      return "border-components-input-multiple-file-upload-color-container-border-error";
    }
    return "border-components-input-multiple-file-upload-color-container-border-default focus-within:border-components-input-multiple-file-upload-color-container-border-focus";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-input-multiple-file-upload-color-helper-text-error"
      : "text-components-input-multiple-file-upload-color-helper-text-default";
  }

  function remove(id: string) {
    if (props.onRemove) {
      props.onRemove(id);
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", props.className)}>
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1 text-sm font-medium text-components-input-multiple-file-upload-color-label-foreground-default">
            {props.label}
            {props.required ? (
              <span
                aria-hidden="true"
                className="text-components-input-multiple-file-upload-color-required-indicator-fill-default"
              >
                *
              </span>
            ) : null}
          </span>
          <span className="text-xs text-components-input-multiple-file-upload-color-file-count-text-default">
            {props.fileCount}
          </span>
        </span>
      ) : null}
      <div
        className={cn(
          "flex flex-col gap-3 rounded-rounded-lg border bg-components-input-multiple-file-upload-color-container-background-default px-3 py-3 transition-colors",
          containerClasses(),
          props.disabled && "opacity-50"
        )}
      >
        <label className="inline-flex cursor-pointer items-center gap-2 self-start rounded-rounded-sm border border-components-input-multiple-file-upload-color-container-border-default bg-components-input-multiple-file-upload-color-container-background-default px-3 py-1 text-sm text-components-input-multiple-file-upload-color-instruction-text-default focus-within:ring-2 focus-within:ring-focus-ring-primary">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M12 5v14M5 12h14" stroke-linecap="round" />
          </svg>
          <span>{props.instruction}</span>
          <input
            type="file"
            className="sr-only"
            id={props.id}
            multiple
            accept={props.accept}
            disabled={props.disabled}
            aria-invalid={hasError()}
          />
        </label>
        {props.files.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {props.files?.map((file) => (
              <li
                className="flex items-center justify-between gap-2 rounded-rounded-md border border-components-input-multiple-file-upload-color-file-row-border-filled bg-components-input-multiple-file-upload-color-file-row-background-filled p-3"
                key={file.id}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-components-input-multiple-file-upload-color-file-icon-fill-filled"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      d="M14 3v5h5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-components-input-multiple-file-upload-color-file-name-text-filled">
                      {file.name}
                    </span>
                    <span className="truncate text-xs text-components-input-multiple-file-upload-color-status-text-filled">
                      {file.status}
                    </span>
                  </span>
                </span>
                <button
                  type="button"
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-input-multiple-file-upload-color-status-icon-fill-filled hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  aria-label={"Remove " + file.name}
                  onClick={(event) => remove(file.id)}
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
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {props.showHint ? (
        <span className={cn("text-xs", supportingClasses())}>
          {supportingText()}
        </span>
      ) : null}
    </div>
  );
}

export default InputMultipleFileUpload;
